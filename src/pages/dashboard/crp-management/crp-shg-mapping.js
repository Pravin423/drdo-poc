"use client";

import { motion } from "framer-motion";
import { Link as LinkIcon, Download } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import ProtectedRoute from "../../../components/ProtectedRoute";
import DashboardLayout from "../../../components/DashboardLayout";

// SHG Mapping components
import ShgMappingFilterBar from "../../../components/super-admin/crp/shg-mapping/ShgMappingFilterBar";
import ShgMappingTable from "../../../components/super-admin/crp/shg-mapping/ShgMappingTable";
import ShgMappingModal from "../../../components/super-admin/crp/shg-mapping/ShgMappingModal";
import { SuccessModal, DeleteConfirmModal } from "../../../components/super-admin/location/village/ConfirmModals";
import { exportToExcel } from "../../../lib/exportToExcel";

export default function CRPSHGMapping() {
  const router = useRouter();
  const isViewOnly = router.query.viewOnly === "true";

  // ── Data ──────────────────────────────────────────────────────────────────
  const [mappings, setMappings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [crps, setCrps] = useState([]);
  const [shgs, setShgs] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Deletion state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [mappingToDelete, setMappingToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

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
      console.error("[CRP-SHG Mapping] Fetch error:", err);
      setMappings([]); setCrps([]); setShgs([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchMappings(); }, []);

  // ── Filter ────────────────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const filteredMappings = mappings.filter((m) =>
    (m.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (m.email || "").toLowerCase().includes(search.toLowerCase())
  );
  
  const handleExport = () => {
    const headers = ["CRP Name", "CRP Email", "CRP Mobile", "SHG Name", "Village", "Taluka", "District", "Status"];
    const rows = filteredMappings.map(m => [
      m.name,
      m.email,
      m.mobile,
      m.shgName,
      m.village,
      m.taluka,
      m.district,
      m.status
    ]);

    exportToExcel({
      title: "CRP - SHG Mapping Detailed Report",
      headers,
      rows,
      filename: `crp_shg_mappings_${new Date().toISOString().split('T')[0]}`
    });
  };

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
      
      setSuccessMsg("CRP to SHG mapping has been saved successfully.");
      setShowSuccess(true);
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
      
      setSuccessMsg("The mapping has been updated successfully.");
      setShowSuccess(true);
      setIsEditModalOpen(false);
      fetchMappings();
    } catch (err) {
      console.error(err);
      alert("An error occurred while updating the mapping");
    } finally {
      setIsUpdating(false);
    }
  };

  // ── Delete Logic ──────────────────────────────────────────────────────────
  const handleDeleteClick = (mapping) => {
    setMappingToDelete(mapping);
    setDeleteError("");
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!mappingToDelete) return;
    setIsDeleting(true);
    setDeleteError("");
    try {
      // We rely on the backend proxy to handle the HttpOnly auth_token cookie.
      // We still try to send the Authorization header as a fallback if available in localStorage.
      const localToken = localStorage.getItem("authToken");
      const headers = {};
      if (localToken) headers["Authorization"] = `Bearer ${localToken}`;

      const res = await fetch(`/api/crp-shg-delete/${mappingToDelete.id}`, {
        method: "GET",
        headers: headers,
        credentials: "include", // Important for sending the HttpOnly cookie
      });

      const data = await res.json();
      if (!res.ok || data.status !== 1) throw new Error(data.message || "Failed to delete mapping");

      setSuccessMsg("CRP to SHG mapping has been deleted successfully.");
      setShowSuccess(true);
      setShowDeleteModal(false);
      fetchMappings();
    } catch (err) {
      console.error(err);
      setDeleteError(err.message || "An error occurred while deleting the mapping");
    } finally {
      setIsDeleting(false);
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
                CRP - SHG{" "}
                <span className="bg-gradient-to-b from-[#3b52ab] to-[#1a2e7a] bg-clip-text text-transparent">
                  Mapping
                </span>
              </h1>
              <p className="text-slate-500 font-medium">Manage and view mappings between CRPs and SHGs</p>
            </div>

            {!isViewOnly && (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleExport}
                  className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 flex items-center gap-2 transition-colors shadow-sm"
                >
                  <Download size={16} /> Export Data
                </button>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-4 py-2 bg-[#3b52ab] text-white rounded-xl text-sm font-semibold hover:bg-gray-100 hover:text-[#3b52ab] flex items-center gap-2 transition-colors cursor-pointer w-fit"
                >
                  <LinkIcon size={16} /> Link CRP to SHG
                </button>
              </div>
            )}
          </motion.header>

          {/* Table card */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <ShgMappingFilterBar
              search={search}
              setSearch={setSearch}
              onRefresh={() => { setSearch(""); fetchMappings(); }}
            />
            <ShgMappingTable
              filteredMappings={filteredMappings}
              isLoading={isLoading}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              isViewOnly={isViewOnly}
            />
          </div>

        </div>
      </DashboardLayout>

      {/* Add Mapping Modal */}
      <ShgMappingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="SHG Mapping"
        crps={crps}
        shgs={shgs}
        formData={formData}
        setFormData={setFormData}
        onSave={handleSaveMapping}
        isSaving={isSubmitting}
        saveLabel="Save Mapping"
      />

      {/* Edit Mapping Modal */}
      <ShgMappingModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit SHG Mapping"
        crps={crps}
        shgs={shgs}
        formData={editFormData}
        setFormData={setEditFormData}
        onSave={handleUpdateMapping}
        isSaving={isUpdating}
        saveLabel="Update Mapping"
      />

      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Operation Successful"
        message={successMsg}
      />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
        isVillage={false} // This was a placeholder in my head, I'll use title/message instead
        deleteError={deleteError}
        title="Delete Mapping?"
        message="Are you sure you want to permanently delete this CRP to SHG mapping?"
      />
    </ProtectedRoute>
  );
}
