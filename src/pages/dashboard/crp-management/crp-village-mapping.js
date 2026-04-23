"use client";

import { motion } from "framer-motion";
import { Link as LinkIcon } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";

import ProtectedRoute from "../../../components/ProtectedRoute";
import DashboardLayout from "../../../components/DashboardLayout";

// Village Mapping components
import VillageMappingFilterBar from "../../../components/super-admin/crp/village-mapping/VillageMappingFilterBar";
import VillageMappingTable from "../../../components/super-admin/crp/village-mapping/VillageMappingTable";
import VillageMappingModal from "../../../components/super-admin/crp/village-mapping/VillageMappingModal";

export default function CRPVillageMapping() {
  const router = useRouter();
  const isViewOnly = router.query.viewOnly === "true";

  // ── Data ──────────────────────────────────────────────────────────────────
  const [mappings, setMappings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [crps, setCrps] = useState([]);
  const [shgs, setShgs] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchMappings = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch("/api/crp-shg-list", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed to fetch mappings");

      const result = await res.json();

      const mappingsList = Array.isArray(result.data) ? result.data : [];
      setMappings(mappingsList.map((m, idx) => ({
        id: m.id || m.shg_mapping_id || m.mapping_id || idx + 1,
        crpId: m.user_id || m.crpuser || "",
        shgId: m.shg_id || m.shggroup || "",
        name: m.fullname || m.crp_name || m.name || "N/A",
        email: m.email || m.crp_email || "N/A",
        mobile: m.mobile || m.crp_mobile || "N/A",
        shgName: m.shg_name || m.shgName || "N/A",
        village: m.village || m.shg_village || "N/A",
        taluka: m.taluka || m.shg_taluka || "N/A",
        district: m.district || m.shg_district || "N/A",
        status: m.status === 0 || m.status === "0" || m.status === "Active" ? "Active" : "Inactive",
      })));

      setCrps(Array.isArray(result.crp_list) ? result.crp_list : []);
      setShgs(Array.isArray(result.shglist) ? result.shglist : []);
    } catch (err) {
      console.error("[CRP-Village Mapping] Fetch error:", err);
      setMappings([]); setCrps([]); setShgs([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchMappings(); }, []);

  // ── Filter & Pagination ───────────────────────────────────────────────────
  const filteredMappings = useMemo(() => {
    return mappings.filter((m) =>
      (m.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (m.email || "").toLowerCase().includes(search.toLowerCase())
    );
  }, [mappings, search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(filteredMappings.length / itemsPerPage));
  
  const paginatedMappings = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredMappings.slice(start, start + itemsPerPage);
  }, [filteredMappings, currentPage, itemsPerPage]);

  // ── Add Modal ─────────────────────────────────────────────────────────────
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ crpuser: "", shggroup: "", status: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSaveMapping = async () => {
    if (!formData.crpuser || !formData.shggroup) {
      alert("Please select both CRP and SHG");
      return;
    }
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("authToken");
      const payload = {
        crpuser: Number(formData.crpuser),
        shggroup: Number(formData.shggroup),
        status: Number(formData.status),
      };
      const res = await fetch("/api/crp-shg-mapping", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || data.status === false) throw new Error(data.message || "Failed to save mapping");
      alert("Mapping saved successfully");
      setIsModalOpen(false);
      setFormData({ crpuser: "", shggroup: "", status: 0 });
      fetchMappings();
    } catch (err) {
      console.error(err);
      alert(err.message || "An error occurred while saving the mapping");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Edit Modal ────────────────────────────────────────────────────────────
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({ mappingId: "", crpuser: "", shggroup: "", status: 0 });
  const [isUpdating, setIsUpdating] = useState(false);

  const handleEditClick = (mapping) => {
    setEditFormData({
      mappingId: mapping.id,
      crpuser: mapping.crpId,
      shggroup: mapping.shgId,
      status: mapping.status === "Active" ? 0 : 1,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateMapping = async () => {
    if (!editFormData.crpuser || !editFormData.shggroup) {
      alert("Please select both CRP and SHG");
      return;
    }
    setIsUpdating(true);
    try {
      const token = localStorage.getItem("authToken");
      const payload = {
        mapping_id: editFormData.mappingId,
        crpuser: Number(editFormData.crpuser),
        shggroup: Number(editFormData.shggroup),
        status: Number(editFormData.status),
      };
      const res = await fetch("/api/edit-crp-shg-mapping", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.status === false) console.warn(data.message);
      }
      alert("Mapping updated successfully!");
      setIsEditModalOpen(false);
      fetchMappings();
    } catch (err) {
      console.error(err);
      alert("An error occurred while updating the mapping");
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
                CRP - Village{" "}
                <span className="bg-gradient-to-b from-[#3b52ab] to-[#1a2e7a] bg-clip-text text-transparent">
                  Mapping
                </span>
              </h1>
              <p className="text-slate-500 font-medium">Manage and view mappings between CRPs and Villages</p>
            </div>

            {!isViewOnly && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-[#3b52ab] text-white rounded-xl text-sm font-semibold hover:bg-gray-100 hover:text-[#3b52ab] flex items-center gap-2 transition-colors cursor-pointer w-fit"
              >
                <LinkIcon size={16} /> Link CRP to Village
              </button>
            )}
          </motion.header>

          {/* Table card */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <VillageMappingFilterBar
              search={search}
              setSearch={setSearch}
              onRefresh={() => { setSearch(""); fetchMappings(); }}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={(n) => { setItemsPerPage(n); setCurrentPage(1); }}
            />
            <VillageMappingTable
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
      <VillageMappingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Village Mapping"
        crps={crps}
        shgs={shgs}
        formData={formData}
        setFormData={setFormData}
        onSave={handleSaveMapping}
        isSaving={isSubmitting}
        saveLabel="Save Mapping"
      />

      {/* Edit Modal */}
      <VillageMappingModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Village Mapping"
        crps={crps}
        shgs={shgs}
        formData={editFormData}
        setFormData={setEditFormData}
        onSave={handleUpdateMapping}
        isSaving={isUpdating}
        saveLabel="Update Mapping"
      />
    </ProtectedRoute>
  );
}
