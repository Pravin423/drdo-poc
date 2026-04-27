"use client";

import React, { useState, useEffect } from "react";
import { Plus, UploadCloud } from "lucide-react";
import { useRouter } from "next/router";
import ProtectedRoute from "../../../components/ProtectedRoute";
import DashboardLayout from "../../../components/DashboardLayout";

// SHG Repository components
import ShgRepositoryStats from "../../../components/super-admin/shg-repository/ShgRepositoryStats";
import ShgRepositoryFilterBar from "../../../components/super-admin/shg-repository/ShgRepositoryFilterBar";
import ShgRepositoryTable from "../../../components/super-admin/shg-repository/ShgRepositoryTable";
import ShgRepositoryModal from "../../../components/super-admin/shg-repository/ShgRepositoryModal";
import ShgRepositoryViewModal from "../../../components/super-admin/shg-repository/ShgRepositoryViewModal";
import ShgMemberAddModal from "../../../components/super-admin/shg-repository/ShgMemberAddModal";
import ShgMemberEditModal from "../../../components/super-admin/shg-repository/ShgMemberEditModal";
import DeleteConfirmationModal from "../../../components/super-admin/shg-repository/DeleteConfirmationModal";

export default function SHGRepository() {
  const router = useRouter();
  const isViewOnly = router.query.viewOnly === "true";

  // ── Data ──────────────────────────────────────────────────────────────────
  const [shgs, setShgs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSHGs = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch("/api/shg-list", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await res.json();
      const arr = Array.isArray(result.data) ? result.data : Array.isArray(result) ? result : [];

      setShgs(arr.map((s, i) => {
        let statusStr = "Active";
        if (s.status === 1 || s.status === "1" || s.status === "Inactive" || s.status === "Deactive") {
          statusStr = "Deactive";
        } else if (s.status === 2 || s.status === "2" || s.status === "Deleted") {
          statusStr = "Deleted";
        }

        return {
          id: s.shg_id || s.id || `SHG${i + 1}`,
          name: s.shg_name || s.name || "-",
          contactPerson: s.contact_person_name || s.contactPerson || "-",
          mobile: s.contact_person_mobile || s.mobile || s.mobile_number || s.contact_number || "-",
          district: s.district || s.district_name || "-",
          taluka: s.taluka || s.taluka_name || "-",
          village: s.village || s.village_name || "-",
          status: statusStr,
          memberCount: s.member_count ?? 0,
        };
      }));
    } catch (err) {
      console.error("Failed to fetch SHGs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchSHGs(); }, []);

  // ── Filters ───────────────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedTaluka, setSelectedTaluka] = useState(null);
  const [districts, setDistricts] = useState([]);
  const [talukasOptions, setTalukasOptions] = useState([]);

  useEffect(() => {
    const loadDistricts = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch("/api/districts", { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) {
          const result = await res.json();
          const data = Array.isArray(result.data) ? result.data : Array.isArray(result) ? result : [];
          setDistricts(data.map(d => ({ id: d.id || d._id || d.district_id, name: d.name || d.district || d.districtName })));
        }
      } catch (err) { }
    };
    loadDistricts();
  }, []);

  useEffect(() => {
    const loadTalukas = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const url = selectedDistrict ? `/api/talukas?district_id=${selectedDistrict.id}` : "/api/talukas";
        const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) {
          const result = await res.json();
          const data = Array.isArray(result.data) ? result.data : Array.isArray(result) ? result : [];
          setTalukasOptions(data.map(t => ({ id: t.id || t._id || t.taluka_id, name: t.name || t.taluka || t.talukaName })));
        }
      } catch (err) { }
    };
    loadTalukas();
  }, [selectedDistrict]);

  const filteredSHGs = shgs.filter(shg => {
    const matchSearch = shg.name.toLowerCase().includes(search.toLowerCase()) || shg.contactPerson.toLowerCase().includes(search.toLowerCase());
    const matchDistrict = !selectedDistrict || (shg.district && shg.district === selectedDistrict.name);
    const matchTaluka = !selectedTaluka || (shg.taluka && shg.taluka === selectedTaluka.name);
    return matchSearch && matchDistrict && matchTaluka;
  });

  // ── SHG Register/Edit Modal ───────────────────────────────────────────────
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    shgName: "", contactPersonName: "", contactPersonMobile: "", district: "", taluka: "", village: "", status: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [talukas, setTalukas] = useState([]);
  const [villages, setVillages] = useState([]);

  useEffect(() => {
    if (!formData.district) { setTalukas([]); return; }
    const loadFormTalukas = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch(`/api/talukas?district_id=${formData.district}`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) {
          const result = await res.json();
          const data = Array.isArray(result.data) ? result.data : Array.isArray(result) ? result : [];
          setTalukas(data.map(t => ({ id: t.id || t._id || t.taluka_id, name: t.name || t.taluka || t.talukaName })));
        }
      } catch (err) { }
    };
    loadFormTalukas();
  }, [formData.district]);

  useEffect(() => {
    if (!formData.taluka) { setVillages([]); return; }
    const loadVillages = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch(`/api/villages?taluka_id=${formData.taluka}`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) {
          const result = await res.json();
          const data = Array.isArray(result.data) ? result.data : Array.isArray(result) ? result : [];
          setVillages(data.map(v => ({ id: v.id || v._id || v.village_id || v.villageId, name: v.name || v.village || v.villageName })));
        }
      } catch (err) { }
    };
    loadVillages();
  }, [formData.taluka]);

  const handleEditClick = async (shg) => {
    setModalMode("edit");
    setEditId(shg.id);
    setIsModalOpen(true);
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`/api/shg-details?id=${shg.id}`, { headers: { Authorization: `Bearer ${token}` } });
      const result = await res.json();
      let d = result.data || result;
      if (Array.isArray(d)) d = d[0] || {};
      setFormData({
        shgName: d.shg_name || d.name || d.shgName || shg.name,
        contactPersonName: d.contact_person_name || d.contactPerson || shg.contactPerson,
        contactPersonMobile: d.contact_person_mobile || d.mobile || d.mobile_number || shg.mobile,
        district: d.district_id || d.district || "",
        taluka: d.taluka_id || d.taluka || "",
        village: d.village_id || d.village || "",
        status: (d.status === "Active" || shg.status === "Active" || d.status === 0 || d.status === "0") ? 0 : 1,
      });
    } catch (err) { console.error("View SHG error for edit:", err); }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const nextData = { ...prev, [name]: value };
      if (name === "district") { nextData.taluka = ""; nextData.village = ""; }
      else if (name === "taluka") { nextData.village = ""; }
      return nextData;
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        shgname: formData.shgName,
        contactpersonname: formData.contactPersonName,
        contactpersonmobile: formData.contactPersonMobile,
        district: Number(formData.district) || 1,
        taluka: Number(formData.taluka) || 6,
        village: Number(formData.village) || 141,
      };
      let url = "/api/add-shg";
      if (modalMode === "edit") {
        payload.status = Number(formData.status);
        url = `/api/shg-update?id=${editId}`;
      }
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await res.json();
      if (!res.ok || result?.status === false) throw new Error(result?.message || `Failed to ${modalMode} SHG`);
      setIsModalOpen(false);
      setFormData({ shgName: "", contactPersonName: "", contactPersonMobile: "", district: "", taluka: "", village: "", status: 0 });
      fetchSHGs();
    } catch (err) {
      console.error("Submission error:", err);
      alert(err.message || "Failed to submit form");
    } finally { setIsSubmitting(false); }
  };

  // ── View Modal ────────────────────────────────────────────────────────────
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isViewLoading, setIsViewLoading] = useState(false);
  const [viewSHGData, setViewSHGData] = useState(null);

  const handleViewClick = async (shg) => {
    setIsViewModalOpen(true);
    setIsViewLoading(true);
    setViewSHGData(null);
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`/api/shg-details?id=${shg.id}`, { headers: { Authorization: `Bearer ${token}` } });
      const result = await res.json();
      let d = result.data || result;
      if (Array.isArray(d)) d = d[0] || {};
      setViewSHGData({
        id: shg.id,
        shgName: d.shg_name || d.name || d.shgName || shg.name,
        contactPersonName: d.contact_person_name || d.contactPerson || shg.contactPerson,
        contactPersonMobile: d.contact_person_mobile || d.mobile || d.mobile_number || shg.mobile,
        district: d.district || d.district_name || shg.district,
        taluka: d.taluka || d.taluka_name || shg.taluka,
        village: d.village || d.village_name || shg.village,
        status: shg.status,
        memberCount: d.member_count !== undefined ? d.member_count : (result.data?.member_count || 0),
        shgMembers: result.shg_member || [],
        timestamp: d.created_at || d.timestamp || d.time || "N/A",
      });
    } catch (err) {
      console.error("View SHG error:", err);
      setViewSHGData({ error: "Failed to load SHG details." });
    } finally { setIsViewLoading(false); }
  };

  const handleStatusToggle = async (id, newStatus) => {
    const originalStatus = viewSHGData?.status;
    const newStatusStr = newStatus === 0 ? "Active" : "Deactive";
    
    // Optimistic Update
    if (viewSHGData && viewSHGData.id === id) {
      setViewSHGData(prev => ({ ...prev, status: newStatusStr }));
    }
    setShgs(prev => prev.map(s => s.id === id ? { ...s, status: newStatusStr } : s));

    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`/api/shg-status-change?id=${id}&status=${newStatus}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await res.json();
      
      if (result.status === true || result.status === 1) {
        // Just fetch the list to keep everything in sync, 
        // the optimistic update already handled the modal.
        fetchSHGs();
      } else {
        throw new Error(result.message || "Failed to update status");
      }
    } catch (err) {
      console.error("Status toggle error:", err);
      // Revert on error
      if (viewSHGData && viewSHGData.id === id) {
        setViewSHGData(prev => ({ ...prev, status: originalStatus }));
      }
      setShgs(prev => prev.map(s => s.id === id ? { ...s, status: originalStatus } : s));
      alert(err.message || "Failed to update status");
    }
  };

  // ── Member Management ─────────────────────────────────────────────────────
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [addMemberSHG, setAddMemberSHG] = useState(null);
  const [addMembersList, setAddMembersList] = useState([]);
  const [isAddingMember, setIsAddingMember] = useState(false);

  const [isEditMemberModalOpen, setIsEditMemberModalOpen] = useState(false);
  const [editMemberData, setEditMemberData] = useState({ id: null, member_name: "", mobile_no: "", designation: "" });
  const [isUpdatingMember, setIsUpdatingMember] = useState(false);

  const [memberToDelete, setMemberToDelete] = useState(null);
  const [isDeletingMember, setIsDeletingMember] = useState(false);

  const handleAddMemberClick = (shg) => {
    setAddMemberSHG(shg);
    setAddMembersList([{ id: Date.now(), member_name: "", mobile_no: "", designation: "", errors: {} }]);
    setIsAddMemberModalOpen(true);
  };

  const handleMemberRowChange = (index, field, value) => {
    const list = [...addMembersList];
    list[index][field] = value;
    if (list[index].errors) list[index].errors[field] = null;
    setAddMembersList(list);
  };

  const addMemberRow = () => {
    setAddMembersList([...addMembersList, { id: Date.now() + Math.random(), member_name: "", mobile_no: "", designation: "", errors: {} }]);
  };

  const removeMemberRow = (index) => {
    if (addMembersList.length > 1) setAddMembersList(addMembersList.filter((_, i) => i !== index));
  };

  const handleAddMemberSubmit = async (e) => {
    e.preventDefault();
    let hasErrors = false;
    const newMembersList = addMembersList.map((m) => ({ ...m, errors: {} }));
    for (let i = 0; i < newMembersList.length; i++) {
      const member = newMembersList[i];
      if (!member.member_name.trim()) { member.errors.member_name = "Name is required"; hasErrors = true; }
      if (!member.mobile_no || !/^\d{10}$/.test(member.mobile_no)) { member.errors.mobile_no = "10-digit mobile required"; hasErrors = true; }
      if (!member.designation.trim()) { member.errors.designation = "Designation is required"; hasErrors = true; }
    }
    if (hasErrors) { setAddMembersList(newMembersList); return; }

    setIsAddingMember(true);
    try {
      const token = localStorage.getItem("authToken");
      const payload = {
        shg_id: addMemberSHG.id,
        member_name: addMembersList.map(m => m.member_name),
        member_mobile: addMembersList.map(m => m.mobile_no),
        designation: addMembersList.map(m => m.designation),
      };
      const res = await fetch("/api/add-shg-member", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok || data.status === false) throw new Error(data.message || "Failed to add members");
      setIsAddMemberModalOpen(false);
      fetchSHGs();
    } catch (err) { alert(err.message || "Failed to add SHG members"); }
    finally { setIsAddingMember(false); }
  };

  const handleEditMemberClick = (member) => {
    setEditMemberData({
      id: member.id,
      member_name: member.member_name || member.name || "",
      mobile_no: member.mobile_no || member.mobile || member.member_mobile || "",
      designation: member.designation || member.role || "Member",
    });
    setIsEditMemberModalOpen(true);
  };

  const handleEditMemberSubmit = async (e) => {
    e.preventDefault();
    setIsUpdatingMember(true);
    try {
      const token = localStorage.getItem("authToken");
      const payload = {
        shg_member_id: editMemberData.id,
        shg_member_name: editMemberData.member_name,
        shg_member_mobile: editMemberData.mobile_no,
        shg_member_designation: editMemberData.designation,
      };
      const res = await fetch("/api/edit-shg-member", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || data.status === false) throw new Error(data.message || "Failed to update member");
      setIsEditMemberModalOpen(false);
      if (viewSHGData) handleViewClick({ id: viewSHGData.id });
    } catch (err) { alert(err.message || "Failed to update member"); }
    finally { setIsUpdatingMember(false); }
  };

  const confirmDeleteMember = async () => {
    if (!memberToDelete) return;
    setIsDeletingMember(true);
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`/api/delete-shg-member?id=${memberToDelete.id}`, {
        method: "GET", headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok || data.status === false) throw new Error(data.message || "Failed to delete member");
      setMemberToDelete(null);
      if (viewSHGData) handleViewClick({ id: viewSHGData.id });
    } catch (err) { alert(err.message || "Failed to delete member"); }
    finally { setIsDeletingMember(false); }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <ProtectedRoute allowedRole="super-admin">
      <DashboardLayout>
        <div className="max-w-[1600px] mx-auto space-y-8 p-6">

          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                SHG Repository
                <span className="text-sm font-semibold bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-100">
                  {shgs.length} Total
                </span>
              </h1>
              <p className="text-slate-500 mt-2 text-sm">Manage, monitor, and register Self Help Groups across Goa.</p>
            </div>

            {!isViewOnly && (
              <div className="flex items-center gap-3">
                <button className="bg-white hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-xl font-bold border border-slate-200 shadow-sm transition-all flex items-center gap-2 text-sm">
                  <UploadCloud size={18} className="text-slate-400" /> Bulk Import
                </button>
                <button
                  onClick={() => {
                    setModalMode("add");
                    setFormData({ shgName: "", contactPersonName: "", contactPersonMobile: "", district: "", taluka: "", village: "", status: 0 });
                    setIsModalOpen(true);
                  }}
                  className="px-4 py-2 bg-[#3b52ab] text-white rounded-xl text-sm font-semibold hover:bg-gray-100 hover:text-[#3b52ab] flex items-center gap-2 transition-colors cursor-pointer ml-2 md:w-auto"
                >
                  <Plus size={18} /> Register SHG
                </button>
              </div>
            )}
          </div>

          <ShgRepositoryStats shgs={shgs} />

          <ShgRepositoryFilterBar
            search={search}
            setSearch={setSearch}
            selectedDistrict={selectedDistrict}
            setSelectedDistrict={setSelectedDistrict}
            selectedTaluka={selectedTaluka}
            setSelectedTaluka={setSelectedTaluka}
            districts={districts}
            talukasOptions={talukasOptions}
            filterOpen={filterOpen}
            setFilterOpen={setFilterOpen}
          />

          <ShgRepositoryTable
            filteredSHGs={filteredSHGs}
            isLoading={isLoading}
            onAddMember={handleAddMemberClick}
            onViewDetails={handleViewClick}
            onEditSHG={handleEditClick}
            isViewOnly={isViewOnly}
          />

        </div>
      </DashboardLayout>

      <ShgRepositoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        modalMode={modalMode}
        formData={formData}
        handleChange={handleFormChange}
        handleSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
        districts={districts}
        talukas={talukas}
        villages={villages}
      />

      <ShgRepositoryViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        isLoading={isViewLoading}
        viewSHGData={viewSHGData}
        onAddMember={handleAddMemberClick}
        onEditMember={handleEditMemberClick}
        onDeleteMember={setMemberToDelete}
        onStatusToggle={handleStatusToggle}
        isViewOnly={isViewOnly}
      />

      <ShgMemberAddModal
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        shg={addMemberSHG}
        addMembersList={addMembersList}
        handleMemberChange={handleMemberRowChange}
        addMemberRow={addMemberRow}
        removeMemberRow={removeMemberRow}
        handleSubmit={handleAddMemberSubmit}
        isAddingMember={isAddingMember}
      />

      <ShgMemberEditModal
        isOpen={isEditMemberModalOpen}
        onClose={() => setIsEditMemberModalOpen(false)}
        editMemberData={editMemberData}
        setEditMemberData={setEditMemberData}
        handleSubmit={handleEditMemberSubmit}
        isUpdatingMember={isUpdatingMember}
      />

      <DeleteConfirmationModal
        isOpen={!!memberToDelete}
        onClose={() => setMemberToDelete(null)}
        title="Delete Member"
        message={<>Are you sure you want to delete <span className="font-semibold text-slate-700">{memberToDelete?.member_name || memberToDelete?.name}</span>?<br /><span className="text-xs text-red-500 font-medium">This action cannot be undone.</span></>}
        onConfirm={confirmDeleteMember}
        isDeleting={isDeletingMember}
      />

    </ProtectedRoute>
  );
}
