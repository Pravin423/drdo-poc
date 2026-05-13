"use client";

import { motion } from "framer-motion";
import { Layers, Activity, Clock, MapPin, Download, Link as LinkIcon, Users } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";

import ProtectedRoute from "../../../components/ProtectedRoute";
import DashboardLayout from "../../../components/DashboardLayout";

import SummaryCard from "../../../components/common/SummaryCard";

// Village Mapping components
import VillageMappingFilterBar from "../../../components/super-admin/crp/village-mapping/VillageMappingFilterBar";
import VillageMappingTable from "../../../components/super-admin/crp/village-mapping/VillageMappingTable";
import VillageMappingModal from "../../../components/super-admin/crp/village-mapping/VillageMappingModal";
import { SuccessModal } from "../../../components/super-admin/location/village/ConfirmModals";
import { exportToExcel } from "../../../lib/exportToExcel";

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
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const fetchMappings = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch("/api/crp-village-mapping", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed to fetch mappings");

      const result = await res.json();

      const mappingsList = Array.isArray(result.data) ? result.data : [];
      setMappings(mappingsList.map((m, idx) => ({
        id: m.id || m.shg_mapping_id || m.mapping_id || idx + 1,
        crpId: m.crp_id || m.user_id || m.crpuser || "",
        districtId: m.district_id || "",
        talukaId: m.taluka_id || "",
        villageId: m.village_id || "",
        shgId: m.shg_id || m.shggroup || "",
        name: m.crp_name || m.fullname || m.name || "N/A",
        email: m.email || m.crp_email || "N/A",
        mobile: m.mobile || m.crp_mobile || "N/A",
        shgName: m.shg_name || m.shgName || "N/A",
        village: m.village_name || m.village || m.shg_village || "N/A",
        taluka: m.taluka_name || m.taluka || m.shg_taluka || "N/A",
        district: m.district_name || m.district || m.shg_district || "N/A",
        status: m.status === 0 || m.status === "0" || m.status === "Active" ? "Active" : "Inactive",
      })));

      // Populate lists. Fallback to /api/crp-shg-list if they are not provided by the primary API
      if (Array.isArray(result.crp_list) && result.crp_list.length > 0) {
        setCrps(result.crp_list);
      }
      if (Array.isArray(result.shglist) && result.shglist.length > 0) {
        setShgs(result.shglist);
      }

      if (!Array.isArray(result.crp_list) || !Array.isArray(result.shglist) || result.crp_list.length === 0 || result.shglist.length === 0) {
        try {
          const listRes = await fetch("/api/crp-shg-list", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          });
          if (listRes.ok) {
            const listResult = await listRes.json();
            if (!result.crp_list || result.crp_list.length === 0) {
              setCrps(Array.isArray(listResult.crp_list) ? listResult.crp_list : []);
            }
            if (!result.shglist || result.shglist.length === 0) {
              setShgs(Array.isArray(listResult.shglist) ? listResult.shglist : []);
            }
          }
        } catch (fallbackErr) {
          console.error("[CRP-Village Mapping] Fallback fetch error:", fallbackErr);
        }
      }
    } catch (err) {
      console.error("[CRP-Village Mapping] Fetch error:", err);
      setMappings([]); setCrps([]); setShgs([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchMappings(); }, []);

  const stats = useMemo(() => {
    const uniqueCrps = new Set(mappings.map(m => m.crpId).filter(Boolean)).size;
    const uniqueVillages = new Set(mappings.map(m => m.village).filter(v => v && v !== "N/A")).size;
    const uniqueTalukas = new Set(mappings.map(m => m.taluka).filter(t => t && t !== "N/A")).size;
    
    return [
      { label: "Total Mappings", value: mappings.length, icon: Layers, variant: "blue" },
      { label: "Mapped CRPs", value: uniqueCrps, icon: Users, variant: "emerald" },
      { label: "Villages Covered", value: uniqueVillages, icon: MapPin, variant: "indigo" },
      { label: "Talukas Covered", value: uniqueTalukas, icon: Activity, variant: "amber" },
    ];
  }, [mappings]);

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

  const handleExport = () => {
    const headers = ["CRP Name", "Village", "Taluka", "District"];
    const rows = filteredMappings.map(m => [
      m.name,
      m.village,
      m.taluka,
      m.district
    ]);

    exportToExcel({
      title: "CRP - Village Mapping Detailed Report",
      headers,
      rows,
      filename: `crp_village_mappings_${new Date().toISOString().split('T')[0]}`
    });
  };

  const totalPages = Math.max(1, Math.ceil(filteredMappings.length / itemsPerPage));
  
  const paginatedMappings = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredMappings.slice(start, start + itemsPerPage);
  }, [filteredMappings, currentPage, itemsPerPage]);

  // ── Add Modal ─────────────────────────────────────────────────────────────
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ crp_id: "", district_id: "", taluka_id: "", village_ids: [] });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSaveMapping = async () => {
    if (!formData.crp_id || !formData.district_id || !formData.taluka_id || !formData.village_ids || formData.village_ids.length === 0) {
      alert("Please select CRP, District, Taluka, and at least one Village");
      return;
    }
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("authToken");
      const payload = {
        crp_id: Number(formData.crp_id),
        district_id: String(formData.district_id),
        taluka_id: String(formData.taluka_id),
        village_id: formData.village_ids,
      };
      const res = await fetch("/api/crp-village-mapping", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || data.status !== 1) throw new Error(data.message || "Failed to save mapping");
      
      setSuccessMsg("CRP to Village mapping has been saved successfully.");
      setShowSuccess(true);
      setIsModalOpen(false);
      setFormData({ crp_id: "", district_id: "", taluka_id: "", village_ids: [] });
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
  const [editFormData, setEditFormData] = useState({ mappingId: "", crp_id: "", district_id: "", taluka_id: "", village_ids: [] });
  const [isUpdating, setIsUpdating] = useState(false);

  const handleEditClick = (mapping) => {
    setEditFormData({
      mappingId: mapping.id,
      crp_id: mapping.crpId,
      district_id: String(mapping.districtId || ""),
      taluka_id: String(mapping.talukaId || ""),
      village_ids: mapping.villageId ? [Number(mapping.villageId)] : [],
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateMapping = async () => {
    if (!editFormData.crp_id || !editFormData.district_id || !editFormData.taluka_id || !editFormData.village_ids || editFormData.village_ids.length === 0) {
      alert("Please select CRP, District, Taluka, and at least one Village");
      return;
    }
    setIsUpdating(true);
    try {
      const token = localStorage.getItem("authToken");
      const payload = {
        crp_id: Number(editFormData.crp_id),
        district_id: String(editFormData.district_id),
        taluka_id: String(editFormData.taluka_id),
        village_id: editFormData.village_ids,
      };
      const res = await fetch("/api/crp-village-mapping", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || data.status !== 1) throw new Error(data.message || "Failed to update mapping");
      
      setSuccessMsg("The mapping has been updated successfully.");
      setShowSuccess(true);
      setIsEditModalOpen(false);
      fetchMappings();
    } catch (err) {
      console.error(err);
      alert(err.message || "An error occurred while updating the mapping");
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
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                CRP - Village <span className="bg-gradient-to-b from-[#3b52ab] to-[#1a2e7a] bg-clip-text text-transparent">Mapping</span>
              </h1>
              <p className="text-slate-500 font-bold text-lg">Manage and view mappings between CRPs and Villages</p>
            </div>

            {!isViewOnly && (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleExport}
                  className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl text-sm font-bold hover:bg-slate-50 flex items-center gap-2.5 transition-all shadow-sm hover:shadow-md active:scale-95"
                >
                  <Download size={18} className="text-slate-400" /> Export Data
                </button>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-6 py-3 bg-[#3b52ab] text-white rounded-2xl text-sm font-bold hover:bg-[#2e418a] flex items-center gap-2.5 transition-all shadow-xl shadow-indigo-100 active:scale-95 border border-indigo-500/20"
                >
                  <LinkIcon size={18} /> Link CRP to Village
                </button>
              </div>
            )}
          </motion.header>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <SummaryCard
                key={i}
                title={stat.label}
                value={isLoading ? "..." : stat.value}
                icon={stat.icon}
                variant={stat.variant}
                delay={i * 0.1}
              />
            ))}
          </div>

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
        formData={editFormData}
        setFormData={setEditFormData}
        onSave={handleUpdateMapping}
        isSaving={isUpdating}
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

