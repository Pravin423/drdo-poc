import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Search, Users, User, UserPlus, Phone, Aperture, UploadCloud, Eye, Edit, Trash2, Activity, Zap, MapPin, Map, Filter, ChevronDown } from "lucide-react";
import ProtectedRoute from "../../../components/ProtectedRoute";
import DashboardLayout from "../../../components/DashboardLayout";

export default function SHGRepository() {
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
          statusStr = "Inactive";
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

  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedTaluka, setSelectedTaluka] = useState(null);
  const [districts, setDistricts] = useState([]);
  const [talukasOptions, setTalukasOptions] = useState([]);

  const [talukas, setTalukas] = useState([]);
  const [villages, setVillages] = useState([]);

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewSHGData, setViewSHGData] = useState(null);
  const [isViewLoading, setIsViewLoading] = useState(false);

  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
  const [editId, setEditId] = useState(null);

  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [addMemberSHG, setAddMemberSHG] = useState(null);
  const [addMembersList, setAddMembersList] = useState([
    { id: Date.now(), member_name: "", mobile_no: "", designation: "" }
  ]);

  const [isEditMemberModalOpen, setIsEditMemberModalOpen] = useState(false);
  const [isUpdatingMember, setIsUpdatingMember] = useState(false);
  const [editMemberData, setEditMemberData] = useState({ id: null, member_name: "", mobile_no: "", designation: "" });

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
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || data.status === false) {
        throw new Error(data.message || "Failed to update member");
      }

      setIsEditMemberModalOpen(false);
      // Refresh the view modal's member list
      if (viewSHGData) {
        handleViewClick({ id: viewSHGData.id });
      }
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to update member");
    } finally {
      setIsUpdatingMember(false);
    }
  };

  const handleAddMemberClick = (shg) => {
    setAddMemberSHG(shg);
    setAddMembersList([{ id: Date.now(), member_name: "", mobile_no: "", designation: "" }]);
    setIsAddMemberModalOpen(true);
  };

  const handleMemberChange = (index, field, value) => {
    const list = [...addMembersList];
    list[index][field] = value;
    setAddMembersList(list);
  };

  const addMemberRow = () => {
    setAddMembersList([...addMembersList, { id: Date.now() + Math.random(), member_name: "", mobile_no: "", designation: "" }]);
  };

  const removeMemberRow = (index) => {
    if (addMembersList.length > 1) {
      setAddMembersList(addMembersList.filter((_, i) => i !== index));
    }
  };

  const handleAddMemberSubmit = async (e) => {
    e.preventDefault();
    if (addMembersList.length === 0) return;
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
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json" 
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok || data.status === false) {
          throw new Error(data.message || "Failed to add members");
      }
      
      setIsAddMemberModalOpen(false);
      fetchSHGs();
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to add SHG members");
    } finally {
      setIsAddingMember(false);
    }
  };

  const [memberToDelete, setMemberToDelete] = useState(null);
  const [isDeletingMember, setIsDeletingMember] = useState(false);

  const handleDeleteMember = (member) => {
    setMemberToDelete(member);
  };

  const confirmDeleteMember = async () => {
    if (!memberToDelete) return;
    setIsDeletingMember(true);
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`/api/delete-shg-member?id=${memberToDelete.id}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok || data.status === false) {
        throw new Error(data.message || "Failed to delete member");
      }

      setMemberToDelete(null);
      // Refresh the view modal's member list
      if (viewSHGData) {
        handleViewClick({ id: viewSHGData.id });
      }
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to delete member");
    } finally {
      setIsDeletingMember(false);
    }
  };

  const handleViewClick = async (shg) => {
    setIsViewModalOpen(true);
    setIsViewLoading(true);
    setViewSHGData(null);
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`/api/shg-details?id=${shg.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      let d = result.data || result;
      if (Array.isArray(d)) {
        d = d[0] || {};
      }
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
    } finally {
      setIsViewLoading(false);
    }
  };

  const [formData, setFormData] = useState({
    shgName: "",
    contactPersonName: "",
    contactPersonMobile: "",
    district: "",
    taluka: "",
    village: "",
    status: 0, // 0 For active, 1 for Deactive
  });

  const handleEditClick = async (shg) => {
    setModalMode("edit");
    setEditId(shg.id);
    setIsModalOpen(true);
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`/api/shg-details?id=${shg.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      let d = result.data || result;
      if (Array.isArray(d)) {
        d = d[0] || {};
      }
      setFormData({
        shgName: d.shg_name || d.name || d.shgName || shg.name,
        contactPersonName: d.contact_person_name || d.contactPerson || shg.contactPerson,
        contactPersonMobile: d.contact_person_mobile || d.mobile || d.mobile_number || shg.mobile,
        district: d.district_id || d.district || "",
        taluka: d.taluka_id || d.taluka || "",
        village: d.village_id || d.village || "",
        status: (d.status === "Active" || shg.status === "Active" || d.status === 0 || d.status === "0") ? 0 : 1,
      });
    } catch (err) {
      console.error("View SHG error for edit:", err);
    }
  };

  useEffect(() => {
    fetchSHGs();
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

  useEffect(() => {
    if (!formData.district) {
      setTalukas([]);
      return;
    }
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
    if (!formData.taluka) {
      setVillages([]);
      return;
    }
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

  useEffect(() => {
    const handler = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const nextData = { ...prev, [name]: value };
      if (name === "district") {
        nextData.taluka = "";
        nextData.village = "";
      } else if (name === "taluka") {
        nextData.village = "";
      }
      return nextData;
    });
  };

  const handleSubmit = async (e) => {
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
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await res.json();

      if (!res.ok || result?.status === false) {
        throw new Error(result?.message || `Failed to ${modalMode} SHG`);
      }

      setIsModalOpen(false);
      setFormData({
        shgName: "", contactPersonName: "", contactPersonMobile: "", district: "", taluka: "", village: "", status: 0
      });
      fetchSHGs();
    } catch (err) {
      console.error("Submission error:", err);
      alert(err.message || "Failed to submit form");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredSHGs = shgs.filter(shg => {
    const matchSearch = shg.name.toLowerCase().includes(search.toLowerCase()) || shg.contactPerson.toLowerCase().includes(search.toLowerCase());
    const matchDistrict = !selectedDistrict || (shg.district && shg.district === selectedDistrict.name);
    const matchTaluka = !selectedTaluka || (shg.taluka && shg.taluka === selectedTaluka.name);
    return matchSearch && matchDistrict && matchTaluka;
  });

  const inputClasses = "w-full px-4 py-2.5 rounded-xl border focus:bg-white transition-all outline-none text-sm bg-slate-50 border-slate-100 focus:border-blue-500";
  const labelClasses = "text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1";

  const totalSHGs = shgs.length;
  const activeSHGs = shgs.filter(s => s.status === "Active").length;
  const villagesCovered = new Set(shgs.map(s => s.village)).size;
  const totalMembers = shgs.reduce((acc, shg) => acc + Number(shg.memberCount || 0), 0);

  const summaryCards = [
    { label: "Total SHGs", value: totalSHGs, icon: Users, accent: "bg-blue-50 text-blue-600 border-blue-100" },
    { label: "Active SHGs", value: activeSHGs, icon: Activity, accent: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    { label: "Villages Covered", value: villagesCovered, icon: MapPin, accent: "bg-orange-50 text-orange-600 border-orange-100" },
    { label: "Total Members", value: totalMembers, icon: UserPlus, accent: "bg-purple-50 text-purple-600 border-purple-100" },
  ];

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isModalOpen || isViewModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen, isViewModalOpen]);

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
                  {totalSHGs} Total
                </span>
              </h1>
              <p className="text-slate-500 mt-2 text-sm">
                Manage, monitor, and register Self Help Groups across Goa.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                className="bg-white hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-xl font-bold border border-slate-200 shadow-sm transition-all flex items-center gap-2 text-sm"
              >
                <UploadCloud size={18} className="text-slate-400" />
                Bulk Import
              </button>
              <button
                onClick={() => {
                  setModalMode("add");
                  setFormData({ shgName: "", contactPersonName: "", contactPersonMobile: "", district: "", taluka: "", village: "", status: 0 });
                  setIsModalOpen(true);
                }}
                className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-slate-900/20 transition-all flex items-center gap-2 text-sm"
              >
                <Plus size={18} />
                Register SHG
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {summaryCards.map((card, index) => (
              <motion.section
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex justify-between items-start">
                  <div className={`p-2.5 rounded-2xl border ${card.accent}`}>
                    <card.icon size={20} />
                  </div>
                </div>
                <div className="mt-5 space-y-1">
                  <p className="text-2xl font-bold text-slate-900 tracking-tight">{card.value}</p>
                  <p className="text-sm font-medium text-slate-500">{card.label}</p>
                </div>
                <div className="absolute -right-2 -bottom-2 opacity-5 transition-transform group-hover:scale-110">
                  <card.icon size={80} />
                </div>
              </motion.section>
            ))}
          </div>

          {/* Filter Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Filter Records</h3>
            </div>
            <div className="p-6">
              <div className="flex flex-col md:flex-row items-end gap-5">
                <div className="flex-1 w-full md:w-auto">
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 ml-1">Search</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Search size={16} className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                      placeholder="Search Name or Contact Person..."
                      className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none bg-slate-50/30 focus:bg-white"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  {selectedDistrict && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-xs font-semibold"
                    >
                      <MapPin size={12} />
                      {selectedDistrict.name}
                      <button
                        onClick={() => { setSelectedDistrict(null); setSelectedTaluka(null); }}
                        className="ml-0.5 text-blue-500 hover:text-blue-800 transition-colors"
                        title="Clear district filter"
                      >
                        <X size={12} />
                      </button>
                    </motion.div>
                  )}

                  {selectedTaluka && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-xs font-semibold"
                    >
                      <Map size={12} />
                      {selectedTaluka.name}
                      <button
                        onClick={() => setSelectedTaluka(null)}
                        className="ml-0.5 text-emerald-500 hover:text-emerald-800 transition-colors"
                        title="Clear taluka filter"
                      >
                        <X size={12} />
                      </button>
                    </motion.div>
                  )}

                  <div ref={filterRef} className="relative z-10 ml-auto sm:ml-0">
                    <button
                      onClick={() => setFilterOpen(prev => !prev)}
                      className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl border transition-all shadow-sm ${selectedDistrict || selectedTaluka
                        ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                        }`}
                    >
                      <Filter size={16} />
                      Filters
                      <ChevronDown size={14} className={`transition-transform duration-200 ${filterOpen ? "rotate-180" : ""}`} />
                    </button>

                    <AnimatePresence>
                      {filterOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -8, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.97 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full mt-2 w-[520px] bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden p-4 grid grid-cols-2 gap-4 origin-top-right z-50"
                        >
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 px-2">1. Select District</h4>
                            <div className="space-y-1 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                              <button
                                onClick={() => { setSelectedDistrict(null); setSelectedTaluka(null); setFilterOpen(false); }}
                                className={`w-full text-left px-3 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center justify-between ${!selectedDistrict
                                  ? "bg-blue-50 text-blue-700"
                                  : "text-slate-700 hover:bg-slate-50"
                                  }`}
                              >
                                All Districts
                                {!selectedDistrict && <span className="w-2 h-2 rounded-full bg-blue-500"></span>}
                              </button>
                              {districts.map(district => (
                                <button
                                  key={district.id}
                                  onClick={() => { setSelectedDistrict(district); setSelectedTaluka(null); }}
                                  className={`w-full text-left px-3 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center justify-between ${selectedDistrict?.id === district.id
                                    ? "bg-blue-50 text-blue-700"
                                    : "text-slate-700 hover:bg-slate-50"
                                    }`}
                                >
                                  {district.name}
                                  {selectedDistrict?.id === district.id && <span className="w-2 h-2 rounded-full bg-blue-500"></span>}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="border-l border-slate-100 pl-4">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 px-2">2. Select Taluka</h4>
                            <div className="space-y-1 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                              <button
                                onClick={() => { setSelectedTaluka(null); setFilterOpen(false); }}
                                className={`w-full text-left px-3 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center justify-between ${!selectedTaluka
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "text-slate-700 hover:bg-slate-50"
                                  }`}
                              >
                                All Talukas
                                {!selectedTaluka && <span className="w-2 h-2 rounded-full bg-emerald-500"></span>}
                              </button>
                              {talukasOptions
                                .map(taluka => (
                                  <button
                                    key={taluka.id}
                                    onClick={() => { setSelectedTaluka(taluka); setFilterOpen(false); }}
                                    className={`w-full text-left px-3 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center justify-between ${selectedTaluka?.id === taluka.id
                                      ? "bg-emerald-50 text-emerald-700"
                                      : "text-slate-700 hover:bg-slate-50"
                                      }`}
                                  >
                                    {taluka.name}
                                    {selectedTaluka?.id === taluka.id && <span className="w-2 h-2 rounded-full bg-emerald-500"></span>}
                                  </button>
                                ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-slate-50/60">
                  <tr>
                    {["ID", "SHG Name", "Contact Person", "Mobile", "District", "Taluka", "Village", "Members", "Status", "Action"].map((h) => (
                      <th key={h} className={`px-4 py-3 text-xs font-bold text-slate-500 uppercase ${h === "Action" ? "text-right" : "text-left"}`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                      {Array.from({ length: 10 }).map((_, j) => (
                          <td key={j} className="px-4 py-4">
                            <div className="h-4 bg-slate-100 rounded-lg w-3/4" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : filteredSHGs.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="px-4 py-16 text-center">
                        <div className="flex flex-col items-center gap-3 text-slate-400">
                          <Users size={36} className="opacity-30" />
                          <p className="text-sm font-semibold">No SHGs found</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredSHGs.map((shg, idx) => (
                      <motion.tr
                        key={shg.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="hover:bg-slate-50/70 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm font-bold text-slate-500">{shg.id}</td>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-slate-900 text-sm">{shg.name}</p>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700 font-medium">{shg.contactPerson}</td>
                        <td className="px-4 py-3 text-sm text-slate-700 font-medium">{shg.mobile}</td>
                        <td className="px-4 py-3 text-sm text-slate-600">{shg.district}</td>
                        <td className="px-4 py-3 text-sm text-slate-600">{shg.taluka}</td>
                        <td className="px-4 py-3 text-sm text-slate-600">{shg.village}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <Users size={14} className="text-slate-400 shrink-0" />
                            <span className="text-sm font-bold text-slate-700">{shg.memberCount ?? 0}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${shg.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                            {shg.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => handleAddMemberClick(shg)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Add Member">
                              <UserPlus size={16} />
                            </button>
                            <button onClick={() => handleViewClick(shg)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Details">
                              <Eye size={16} />
                            </button>
                            <button onClick={() => handleEditClick(shg)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit SHG">
                              <Edit size={16} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </DashboardLayout>

      {/* Add SHG Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-white w-full max-w-4xl rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200"
            >
              <div className="relative h-28 bg-gradient-to-r from-slate-800 to-slate-900 px-8 flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="p-3.5 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20 shadow-inner">
                    <Aperture className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white drop-shadow-sm">{modalMode === "edit" ? "Edit SHG" : "Create SHG"}</h2>
                    <p className="text-slate-400 text-xs font-medium mt-0.5">{modalMode === "edit" ? "Update details of the Self Help Group" : "Register a new Self Help Group"}</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="relative overflow-hidden">
                <div className="max-h-[70vh] overflow-y-auto pt-8 px-8 pb-4 custom-scrollbar">
                  <form onSubmit={handleSubmit} className="space-y-8">

                    {/* Group 1: General Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-1">
                        <h3 className="text-sm font-bold text-slate-900">Group Information</h3>
                        <p className="text-xs text-slate-500 mt-1">Core details and contact individual for the Self Help Group.</p>
                      </div>
                      <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div className="space-y-1">
                          <p className={labelClasses}>
                            SHG Name <span className="text-red-400">*</span>
                          </p>
                          <input
                            type="text"
                            name="shgName"
                            value={formData.shgName}
                            onChange={handleChange}
                            placeholder="Enter SHG Name"
                            required
                            className={inputClasses}
                          />
                        </div>

                        <div className="hidden md:block"></div>

                        <div className="space-y-1">
                          <p className={labelClasses}>
                            Contact Person Name <span className="text-red-400">*</span>
                          </p>
                          <input
                            type="text"
                            name="contactPersonName"
                            value={formData.contactPersonName}
                            onChange={handleChange}
                            placeholder="Enter full name"
                            required
                            className={inputClasses}
                          />
                        </div>

                        <div className="space-y-1">
                          <p className={labelClasses}>
                            Contact Person Mobile <span className="text-red-400">*</span>
                          </p>
                          <input
                            type="tel"
                            name="contactPersonMobile"
                            value={formData.contactPersonMobile}
                            onChange={handleChange}
                            placeholder="10-digit mobile number"
                            maxLength={10}
                            required
                            className={inputClasses}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="h-px w-full bg-slate-100" />

                    {/* Group 2: Location Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-1">
                        <h3 className="text-sm font-bold text-slate-900">Location Settings</h3>
                        <p className="text-xs text-slate-500 mt-1">Specify where this SHG operates.</p>
                      </div>
                      <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div className="space-y-1">
                          <p className={labelClasses}>
                            District <span className="text-red-400">*</span>
                          </p>
                          <select
                            name="district"
                            value={formData.district}
                            onChange={handleChange}
                            required
                            className={inputClasses}
                          >
                            <option value="" disabled>Choose District...</option>
                            {districts.map(d => (
                              <option key={d.id} value={d.id}>{d.name}</option>
                            ))}
                          </select>
                        </div>

                        <div className="hidden md:block"></div>

                        <div className="space-y-1">
                          <p className={labelClasses}>
                            Taluka <span className="text-red-400">*</span>
                          </p>
                          <select
                            name="taluka"
                            value={formData.taluka}
                            onChange={handleChange}
                            required
                            disabled={!formData.district || talukas.length === 0}
                            className={`${inputClasses} disabled:opacity-50`}
                          >
                            <option value="" disabled>Choose Taluka...</option>
                            {talukas.map(t => (
                              <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1">
                          <p className={labelClasses}>
                            Village <span className="text-red-400">*</span>
                          </p>
                          <select
                            name="village"
                            value={formData.village}
                            onChange={handleChange}
                            required
                            disabled={!formData.taluka || villages.length === 0}
                            className={`${inputClasses} disabled:opacity-50`}
                          >
                            <option value="" disabled>Choose Village...</option>
                            {villages.map(v => (
                              <option key={v.id} value={v.id}>{v.name}</option>
                            ))}
                          </select>
                        </div>

                        {modalMode === "edit" && (
                          <div className="space-y-1">
                            <p className={labelClasses}>
                              Status <span className="text-red-400">*</span>
                            </p>
                            <select
                              name="status"
                              value={formData.status}
                              onChange={handleChange}
                              required
                              className={inputClasses}
                            >
                              <option value={0}>Active</option>
                              <option value={1}>Deactive</option>
                            </select>
                          </div>
                        )}

                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-bold rounded-xl transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? "Submitting..." : "Submit"}
                      </button>
                    </div>

                  </form>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View SHG Modal */}
      <AnimatePresence>
        {isViewModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
              onClick={() => setIsViewModalOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0.25 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden relative z-10 border border-slate-100"
            >
              <div className="relative h-24 bg-gradient-to-r from-slate-800 to-slate-900 px-6 flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20">
                  <Eye className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">SHG Details</h3>
                  <p className="text-slate-400 text-xs mt-0.5">Full profile information</p>
                </div>
                <button onClick={() => setIsViewModalOpen(false)}
                  className="absolute top-5 right-5 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
                  <X size={16} />
                </button>
              </div>

              <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                {isViewLoading ? (
                  <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-700 mb-4" />
                    <p className="text-sm font-semibold">Loading SHG details...</p>
                  </div>
                ) : viewSHGData?.error ? (
                  <div className="text-center py-10">
                    <p className="text-red-500 font-medium text-sm">{viewSHGData.error}</p>
                  </div>
                ) : viewSHGData && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-white border-2 border-slate-100 shadow-md flex items-center justify-center">
                          <Users size={32} className="text-slate-300" />
                        </div>
                        <div>
                          <p className="text-lg font-bold text-slate-900">{viewSHGData.shgName}</p>
                          <p className="text-xs text-slate-500 mt-0.5">SHG ID: {viewSHGData.id}</p>
                          <div className="flex gap-2 mt-2">
                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${viewSHGData.status === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-500 border-slate-200"}`}>
                              {viewSHGData.status || "—"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right pr-4">
                        <p className="text-3xl font-black text-slate-800">{viewSHGData.memberCount}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Members</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Contact Information</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {[
                          { label: "Contact Person", value: viewSHGData.contactPersonName || "—" },
                          { label: "Mobile", value: viewSHGData.contactPersonMobile || "—" },
                          { label: "Created At", value: viewSHGData.timestamp && viewSHGData.timestamp !== "N/A" ? new Date(viewSHGData.timestamp).toLocaleDateString() : "—" },
                        ].map(item => (
                          <div key={item.label} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">{item.label}</p>
                            <p className="text-sm font-semibold text-slate-800 truncate">{item.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Location Information</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {[
                          { label: "District", value: viewSHGData.district || "—" },
                          { label: "Taluka", value: viewSHGData.taluka || "—" },
                          { label: "Village", value: viewSHGData.village || "—" },
                        ].map(item => (
                          <div key={item.label} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">{item.label}</p>
                            <p className="text-sm font-semibold text-slate-800 truncate">{item.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {viewSHGData.shgMembers && viewSHGData.shgMembers.length > 0 && (
                      <div className="mt-6">
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">SHG Members</p>
                          <span className="bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-bold px-2.5 py-0.5 rounded-full">{viewSHGData.shgMembers.length} Members</span>
                        </div>
                        <div className="space-y-3">
                          {viewSHGData.shgMembers.map((member, idx) => {
                            const designation = member.designation || member.role || "Member";
                            const isLeader = designation.toLowerCase().includes("president") || designation.toLowerCase().includes("leader") || designation.toLowerCase().includes("secretary");
                            
                            return (
                              <motion.div 
                                key={member.id || idx}
                                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ delay: idx * 0.05, type: 'spring', stiffness: 300, damping: 20 }}
                                className="group flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm cursor-pointer transition-all duration-200 hover:border-blue-200 hover:bg-blue-50/30"
                              >
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 group-hover:border-blue-200 transition-colors">
                                    <User size={20} />
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{member.member_name || member.name || "—"}</h4>
                                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${isLeader ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                                      {designation}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4">
                                  <div className="text-right">
                                    {(member.mobile_no || member.mobile || member.member_mobile) ? (
                                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 group-hover:bg-white text-slate-700 rounded-xl text-xs font-semibold border border-slate-100 transition-colors shadow-sm">
                                        <Phone size={12} className="text-blue-500" />
                                        {member.mobile_no || member.mobile || member.member_mobile}
                                      </div>
                                    ) : (
                                      <span className="text-xs text-slate-400 font-medium bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">—</span>
                                    )}
                                  </div>
                                  
                                  {/* Action Buttons */}
                                  <div className="flex items-center gap-1.5">
                                    <button 
                                      type="button"
                                      onClick={() => handleEditMemberClick(member)}
                                      className="p-2 bg-slate-100 hover:bg-blue-100 text-slate-500 hover:text-blue-600 rounded-lg transition-colors border border-transparent hover:border-blue-200"
                                      title="Edit member"
                                    >
                                      <Edit size={14} />
                                    </button>
                                    <button 
                                      type="button"
                                      onClick={() => handleDeleteMember(member)}
                                      className="p-2 bg-slate-100 hover:bg-red-100 text-slate-500 hover:text-red-600 rounded-lg transition-colors border border-transparent hover:border-red-200"
                                      title="Delete member"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button onClick={() => setIsViewModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-xl transition-colors">
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add SHG Member Modal */}
      <AnimatePresence>
        {isAddMemberModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4 py-8">
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="bg-white w-full max-w-4xl rounded-xl shadow-2xl border border-slate-200 flex flex-col max-h-full"
            >
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0 rounded-t-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100/50">
                    <UserPlus size={24} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Add Members</h2>
                    <p className="text-sm text-slate-500 mt-0.5">Adding members to SHG: <span className="font-semibold text-slate-700">{addMemberSHG?.name}</span></p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddMemberModalOpen(false)}
                  className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50">
                <form id="add-members-form" onSubmit={handleAddMemberSubmit} className="max-w-4xl mx-auto space-y-4">
                  
                  {/* Table Header (hidden on very small screens, shown otherwise) */}
                  <div className="hidden md:grid md:grid-cols-[1fr_1fr_1fr_40px] gap-4 px-3 mb-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5"><User size={12} /> Member Name <span className="text-red-500">*</span></label>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5"><Phone size={12} /> Mobile Number <span className="text-red-500">*</span></label>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5"><Activity size={12} /> Designation <span className="text-red-500">*</span></label>
                    <div></div>
                  </div>

                  <AnimatePresence>
                    {addMembersList.map((member, idx) => (
                      <motion.div 
                        layout
                        key={member.id} 
                        initial={{ opacity: 0, y: -10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0, height: 0, overflow: "hidden", marginTop: 0, marginBottom: 0 }}
                        transition={{ duration: 0.2 }}
                        className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_40px] gap-4 items-start bg-white p-4 md:p-3 border border-slate-200 rounded-xl hover:border-blue-200 transition-colors shadow-sm group"
                      >
                        <div className="space-y-1">
                          <label className="block md:hidden text-xs font-bold text-slate-600 flex items-center gap-1.5"><User size={12} /> Name <span className="text-red-500">*</span></label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                              <User size={16} />
                            </div>
                            <input
                              type="text"
                              value={member.member_name}
                              onChange={(e) => handleMemberChange(idx, "member_name", e.target.value)}
                              placeholder="Full Name"
                              required
                              className="w-full bg-slate-50/50 border border-slate-200 rounded-lg pl-10 pr-3 py-2 text-sm text-slate-900 font-medium focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:font-normal"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <label className="block md:hidden text-xs font-bold text-slate-600 flex items-center gap-1.5"><Phone size={12} /> Mobile <span className="text-red-500">*</span></label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                              <Phone size={16} />
                            </div>
                            <input
                              type="tel"
                              value={member.mobile_no}
                              onChange={(e) => handleMemberChange(idx, "mobile_no", e.target.value)}
                              placeholder="10-digit number"
                              maxLength={10}
                              required
                              className="w-full bg-slate-50/50 border border-slate-200 rounded-lg pl-10 pr-3 py-2 text-sm text-slate-900 font-medium focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:font-normal"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="block md:hidden text-xs font-bold text-slate-600 flex items-center gap-1.5"><Activity size={12} /> Designation <span className="text-red-500">*</span></label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                              <Activity size={16} />
                            </div>
                            <input
                              type="text"
                              value={member.designation}
                              onChange={(e) => handleMemberChange(idx, "designation", e.target.value)}
                              placeholder="Role (e.g., President)"
                              required
                              className="w-full bg-slate-50/50 border border-slate-200 rounded-lg pl-10 pr-3 py-2 text-sm text-slate-900 font-medium focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:font-normal"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end md:justify-center md:pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {addMembersList.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeMemberRow(idx)}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Remove member"
                            >
                              <X size={18} />
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  <div className="pt-2 px-1">
                    <button
                      type="button"
                      onClick={addMemberRow}
                      className="inline-flex items-center gap-2 px-4 py-2 mt-2 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-sm font-semibold text-slate-700 rounded-lg transition-all shadow-sm"
                    >
                      <Plus size={16} className="text-blue-600" />
                      Add Another Row
                    </button>
                  </div>
                </form>
              </div>

              <div className="px-6 py-4 border-t border-slate-100 bg-white shrink-0 flex items-center justify-between rounded-b-xl">
                <div className="text-sm font-semibold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 flex items-center gap-2">
                  <Users size={16} className="text-blue-500"/> 
                  {addMembersList.length} member{addMembersList.length !== 1 ? 's' : ''} queued
                </div>
                
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddMemberModalOpen(false)}
                    className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 font-semibold text-sm rounded-lg transition-all shadow-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    form="add-members-form"
                    disabled={isAddingMember || addMembersList.length === 0}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg transition-all shadow-sm shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isAddingMember ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </>
                      ) : (
                        <>
                          <UploadCloud size={16} />
                          Save Members
                        </>
                      )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit SHG Member Modal */}
      <AnimatePresence>
        {isEditMemberModalOpen && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200/80 flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="relative h-28 bg-gradient-to-r from-slate-800 to-slate-900 px-6 flex items-center gap-4 overflow-hidden">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-white opacity-5 rounded-full blur-xl"></div>
                <div className="w-14 h-14 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center text-white font-black text-xl shrink-0">
                  {editMemberData.member_name ? editMemberData.member_name.charAt(0).toUpperCase() : <User size={24} />}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-white">Edit Member</h2>
                  <p className="text-slate-400 text-xs mt-0.5 truncate">{editMemberData.member_name || "Member Details"}</p>
                </div>
                <button
                  onClick={() => setIsEditMemberModalOpen(false)}
                  className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Form Body */}
              <div className="p-6 bg-slate-50/50">
                <form id="edit-member-form" onSubmit={handleEditMemberSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Member Name <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <User size={16} />
                      </div>
                      <input
                        type="text"
                        value={editMemberData.member_name}
                        onChange={(e) => setEditMemberData(prev => ({ ...prev, member_name: e.target.value }))}
                        placeholder="Full Name"
                        required
                        className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Mobile Number <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Phone size={16} />
                      </div>
                      <input
                        type="tel"
                        value={editMemberData.mobile_no}
                        onChange={(e) => setEditMemberData(prev => ({ ...prev, mobile_no: e.target.value }))}
                        placeholder="10-digit number"
                        maxLength={10}
                        required
                        className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Designation <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Activity size={16} />
                      </div>
                      <input
                        type="text"
                        value={editMemberData.designation}
                        onChange={(e) => setEditMemberData(prev => ({ ...prev, designation: e.target.value }))}
                        placeholder="Role (e.g., President)"
                        required
                        className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all shadow-sm"
                      />
                    </div>
                  </div>
                </form>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-slate-100 bg-white flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditMemberModalOpen(false)}
                  className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 font-semibold text-sm rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="edit-member-form"
                  disabled={isUpdatingMember}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isUpdatingMember ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Edit size={15} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {memberToDelete && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
            >
              {/* Red danger header */}
              <div className="bg-red-50 px-6 pt-6 pb-5 flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-red-100 border border-red-200 rounded-full flex items-center justify-center mb-4">
                  <Trash2 size={26} className="text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Delete Member</h3>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-slate-700">
                    {memberToDelete.member_name || memberToDelete.name || "this member"}
                  </span>?
                  <br />
                  <span className="text-xs text-red-500 font-medium">This action cannot be undone.</span>
                </p>
              </div>

              {/* Actions */}
              <div className="px-6 py-4 flex gap-3 border-t border-slate-100 bg-white">
                <button
                  type="button"
                  onClick={() => setMemberToDelete(null)}
                  className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteMember}
                  disabled={isDeletingMember}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-xl transition-colors shadow-md shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isDeletingMember ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={15} />
                      Yes, Delete
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ProtectedRoute>
  );
}
