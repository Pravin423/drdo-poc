"use client";

import { motion } from "framer-motion";
import { Link as LinkIcon } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";

import ProtectedRoute from "../../../components/ProtectedRoute";
import DashboardLayout from "../../../components/DashboardLayout";

// Vertical Mapping components
import VerticalMappingFilterBar from "../../../components/super-admin/crp/vertical-mapping/VerticalMappingFilterBar";
import VerticalMappingTable from "../../../components/super-admin/crp/vertical-mapping/VerticalMappingTable";
import VerticalMappingModal from "../../../components/super-admin/crp/vertical-mapping/VerticalMappingModal";
import { SuccessModal } from "../../../components/super-admin/location/village/ConfirmModals";

export default function CRPVerticalMapping() {
  const router = useRouter();
  const isViewOnly = router.query.viewOnly === "true";

  // ── Data ──────────────────────────────────────────────────────────────────
  const [mappings, setMappings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [crps, setCrps] = useState([]);
  const [verticals, setVerticals] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const fetchMappings = async () => {
    setIsLoading(true);
    try {
      // Fetch CRPs
      const crpRes = await fetch("/api/crp-shg-list", { credentials: "include" });
      const crpResult = await crpRes.json();
      if (Array.isArray(crpResult.crp_list)) setCrps(crpResult.crp_list);

      // Fetch Verticals
      const vertRes = await fetch("/api/vertical-list", { credentials: "include" });
      const vertResult = await vertRes.json();
      let allVerticals = Array.isArray(vertResult)
        ? vertResult
        : Array.isArray(vertResult.data)
        ? vertResult.data
        : [];

      // Fetch mappings + activity-tasks in parallel
      const [res, tasksRes] = await Promise.all([
        fetch("/api/vertical-mapping-list", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }),
        fetch("/api/activity-tasks", { credentials: "include" }),
      ]);

      if (!res.ok) {
        console.warn(`Failed to fetch mappings: ${res.statusText}`);
        setVerticals(allVerticals);
        return;
      }

      const result = await res.json();
      const mappingsList = Array.isArray(result.data)
        ? result.data
        : Array.isArray(result)
        ? result
        : [];

      const parsedMappings = mappingsList.map((m, idx) => {
        const rawTaskType = m.task_type !== undefined ? m.task_type : m.taskType;
        let parsedTaskType = "N/A";
        if (rawTaskType === 0 || String(rawTaskType) === "0") parsedTaskType = "Regular Task";
        else if (rawTaskType === 1 || String(rawTaskType) === "1") parsedTaskType = "Special Task";
        else if (rawTaskType) parsedTaskType = rawTaskType;

        return {
          id: m.id || m.mapping_id || idx + 1,
          crpId: m.user_id || m.crpuser || m.crp_id || "",
          verticalId: m.vertical_id || "",
          name: m.fullname || m.crp_name || m.name || "N/A",
          email: m.email || m.crp_email || "N/A",
          mobile: m.mobile || m.crp_mobile || "N/A",
          taskType: parsedTaskType,
          taskName: m.task_name || m.taskName || "N/A",
          verticalName: m.vertical_name || m.verticalName || m.title || "N/A",
          verticalCode: m.vertical_code || m.verticalCode || "N/A",
          status: m.task_status === 0 || m.task_status === "0" ? "Active" : "Inactive",
        };
      });

      // Sort by id descending (newest first)
      setMappings(
        parsedMappings.sort((a, b) => {
          const idA = !isNaN(a.id) ? Number(a.id) : 0;
          const idB = !isNaN(b.id) ? Number(b.id) : 0;
          return idB - idA;
        })
      );

      // Filter verticals to only those that have at least one task
      try {
        const tasksResult = await tasksRes.json();
        const tasksList = Array.isArray(tasksResult)
          ? tasksResult
          : Array.isArray(tasksResult?.data)
          ? tasksResult.data
          : Array.isArray(tasksResult?.tasks)
          ? tasksResult.tasks
          : [];

        const verticalIdsWithTasks = new Set(
          tasksList.map((t) => String(t.vertical_id || t.verticalId || "")).filter(Boolean)
        );

        if (verticalIdsWithTasks.size > 0) {
          const filtered = allVerticals.filter((v) =>
            verticalIdsWithTasks.has(String(v.id || v.vertical_id || ""))
          );
          setVerticals(filtered.length > 0 ? filtered : allVerticals);
        } else {
          setVerticals(allVerticals);
        }
      } catch (taskErr) {
        console.warn("[CRP-Vertical Mapping] Could not parse tasks, showing all verticals:", taskErr);
        setVerticals(allVerticals);
      }
    } catch (err) {
      console.error("[CRP-Vertical Mapping] Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchMappings(); }, []);

  // ── Filter & Pagination ───────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredMappings = useMemo(
    () =>
      mappings.filter(
        (m) =>
          (m.name || "").toLowerCase().includes(search.toLowerCase()) ||
          (m.email || "").toLowerCase().includes(search.toLowerCase()) ||
          (m.verticalName || "").toLowerCase().includes(search.toLowerCase())
      ),
    [mappings, search]
  );

  // Reset to page 1 whenever search changes
  useEffect(() => { setCurrentPage(1); }, [search]);

  const totalPages = Math.max(1, Math.ceil(filteredMappings.length / itemsPerPage));
  const paginatedMappings = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredMappings.slice(start, start + itemsPerPage);
  }, [filteredMappings, currentPage, itemsPerPage]);

  // ── Add Modal ─────────────────────────────────────────────────────────────
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [formData, setFormData] = useState({ crpuser: "", vertical_id: "", status: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSaveMapping = async () => {
    setApiError(null);
    if (!formData.crpuser || !formData.vertical_id) {
      setApiError("Please select both CRP and Vertical");
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        crp_user_id: Number(formData.crpuser),
        vertical_id: Number(formData.vertical_id),
        status: Number(formData.status),
      };
      const res = await fetch("/api/add-vertical-mapping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      let data;
      try { data = await res.json(); } catch (_) {}
      if (!res.ok || data?.status === false) throw new Error((data && data.message) || "Failed to save mapping");
      
      setSuccessMsg("CRP to Vertical mapping has been saved successfully.");
      setShowSuccess(true);
      setIsModalOpen(false);
      setFormData({ crpuser: "", vertical_id: "", status: 0 });
      fetchMappings();
    } catch (err) {
      console.error(err);
      setApiError(err.message || "An error occurred while saving the mapping");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Edit Modal ────────────────────────────────────────────────────────────
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editApiError, setEditApiError] = useState(null);
  const [editFormData, setEditFormData] = useState({ mappingId: "", crpuser: "", vertical_id: "", status: 0 });
  const [isUpdating, setIsUpdating] = useState(false);

  const handleEditClick = (mapping) => {
    setEditApiError(null);
    setEditFormData({
      mappingId: mapping.id,
      crpuser: mapping.crpId,
      vertical_id: mapping.verticalId,
      status: mapping.status === "Active" ? 0 : 1,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateMapping = async () => {
    setEditApiError(null);
    if (!editFormData.crpuser || !editFormData.vertical_id) {
      setEditApiError("Please select both CRP and Vertical");
      return;
    }
    setIsUpdating(true);
    try {
      const payload = {
        mapping_id: editFormData.mappingId,
        crp_user_id: Number(editFormData.crpuser),
        vertical_id: Number(editFormData.vertical_id),
        status: Number(editFormData.status),
      };
      const res = await fetch("/api/edit-vertical-mapping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      let data;
      try { data = await res.json(); } catch (_) {}
      if (!res.ok || data?.status === false) throw new Error((data && data.message) || "Failed to update mapping");
      
      setSuccessMsg("The mapping has been updated successfully.");
      setShowSuccess(true);
      setIsEditModalOpen(false);
      fetchMappings();
    } catch (err) {
      console.error(err);
      setEditApiError(err.message || "An error occurred while updating the mapping");
    } finally {
      setIsUpdating(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <ProtectedRoute allowedRole="super-admin">
      <DashboardLayout>
        <div className="max-w-[1600px] mx-auto space-y-8 p-6">

          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                CRP - Vertical{" "}
                <span className="bg-gradient-to-b from-[#3b52ab] to-[#1a2e7a] bg-clip-text text-transparent">
                  Mapping
                </span>
              </h1>
              <p className="text-slate-500 font-medium">Manage and view mappings between CRPs and Verticals</p>
            </div>

            {!isViewOnly && (
              <button
                onClick={() => { setApiError(null); setIsModalOpen(true); }}
                className="px-4 py-2 bg-[#3b52ab] text-white rounded-xl text-sm font-semibold hover:bg-gray-100 hover:text-[#3b52ab] flex items-center gap-2 transition-colors cursor-pointer w-fit"
              >
                <LinkIcon size={16} /> Link CRP to Vertical
              </button>
            )}
          </motion.header>

          {/* Table card */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <VerticalMappingFilterBar
              search={search}
              setSearch={setSearch}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={(n) => { setItemsPerPage(n); setCurrentPage(1); }}
              onRefresh={() => { setSearch(""); fetchMappings(); }}
            />
            <VerticalMappingTable
              paginatedMappings={paginatedMappings}
              filteredMappings={filteredMappings}
              isLoading={isLoading}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
              onEdit={handleEditClick}
              isViewOnly={isViewOnly}
            />
          </div>

        </div>
      </DashboardLayout>

      {/* Add Modal */}
      <VerticalMappingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Link CRP to Vertical"
        crps={crps}
        verticals={verticals}
        formData={formData}
        setFormData={setFormData}
        onSave={handleSaveMapping}
        isSaving={isSubmitting}
        apiError={apiError}
        saveLabel="Save Mapping"
      />

      {/* Edit Modal */}
      <VerticalMappingModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Vertical Mapping"
        crps={crps}
        verticals={verticals}
        formData={editFormData}
        setFormData={setEditFormData}
        onSave={handleUpdateMapping}
        isSaving={isUpdating}
        apiError={editApiError}
        saveLabel="Update Mapping"
      />

      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Mapping Successful"
        message={successMsg}
      />
    </ProtectedRoute>
  );
}
