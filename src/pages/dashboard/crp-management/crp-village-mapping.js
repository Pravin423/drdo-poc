"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Users, Link as LinkIcon, Download, Search, RefreshCw, UploadCloud, Edit, Trash2, X } from "lucide-react";
import { useState, useEffect } from "react";
import ProtectedRoute from "../../../components/ProtectedRoute";
import DashboardLayout from "../../../components/DashboardLayout";

export default function CRPVillageMapping() {
  const [mappings, setMappings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [crps, setCrps] = useState([]);
  const [shgs, setShgs] = useState([]);
  const [formData, setFormData] = useState({
    crpuser: "",
    shggroup: "",
    status: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    mappingId: "",
    crpuser: "",
    shggroup: "",
    status: 0
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchMappings = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch("/api/crp-shg-list", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to fetch mappings");

      const result = await res.json();

      const mappingsList = Array.isArray(result.data) ? result.data : [];
      setMappings(mappingsList.map((mapping, idx) => ({
        id: mapping.id || mapping.shg_mapping_id || mapping.mapping_id || idx + 1,
        crpId: mapping.user_id || mapping.crpuser || "",
        shgId: mapping.shg_id || mapping.shggroup || "",
        name: mapping.fullname || mapping.crp_name || mapping.name || "N/A",
        email: mapping.email || mapping.crp_email || "N/A",
        mobile: mapping.mobile || mapping.crp_mobile || "N/A",
        shgName: mapping.shg_name || mapping.shgName || "N/A",
        village: mapping.village || mapping.shg_village || "N/A",
        taluka: mapping.taluka || mapping.shg_taluka || "N/A",
        district: mapping.district || mapping.shg_district || "N/A",
        status: mapping.status === 0 || mapping.status === "0" || mapping.status === "Active" ? "Active" : "Inactive",
      })));

      const crpData = Array.isArray(result.crp_list) ? result.crp_list : [];
      setCrps(crpData);

      const shgData = Array.isArray(result.shglist) ? result.shglist : [];
      setShgs(shgData);

    } catch (err) {
      console.error("[CRP-SHG Mapping] Fetch error:", err);
      setMappings([]);
      setCrps([]);
      setShgs([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMappings();
  }, []);

  const handleEditClick = (mapping) => {
    setEditFormData({
      mappingId: mapping.id,
      crpuser: mapping.crpId,
      shggroup: mapping.shgId,
      status: mapping.status === "Active" ? 0 : 1
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
        status: Number(editFormData.status)
      };

      const res = await fetch("/api/edit-crp-shg-mapping", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        if (data.status === false) {
          console.warn(data.message);
        }
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
        status: Number(formData.status)
      };
      console.log("[CRP-SHG Mapping] Sending payload:", payload);

      const res = await fetch("/api/crp-shg-mapping", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      console.log("[CRP-SHG Mapping] Response:", res.status, data);
      if (!res.ok || data.status === false) {
        throw new Error(data.message || "Failed to save mapping");
      }

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

  const filteredMappings = mappings.filter((m) =>
    (m.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (m.email || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ProtectedRoute allowedRole="super-admin">
      <DashboardLayout>
        <div className="max-w-[1600px] mx-auto space-y-8 p-6">
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                CRP - Village <span className="bg-gradient-to-b from-[#3b52ab] to-[#1a2e7a] bg-clip-text text-transparent">Mapping</span>
              </h1>
              <p className="text-slate-500 font-medium">Manage and view mappings between CRPs and Villages</p>
            </div>

            <div className="flex gap-3">
              <button

                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <LinkIcon size={16} /> Link CRP to Village
              </button>
            </div>
          </motion.header>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative group w-full sm:w-[320px]">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search size={18} className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  placeholder="Search CRP..."
                  className="w-full border border-slate-200 rounded-2xl pl-11 pr-4 py-2.5 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none bg-white font-medium text-slate-700"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <button onClick={() => { setSearch(""); fetchMappings(); }} className="px-5 py-2.5 border border-slate-200 text-slate-700 bg-white rounded-2xl text-sm font-semibold hover:bg-slate-50 flex items-center gap-2 transition-colors">
                  <RefreshCw size={16} /> Refresh
                </button>
              </div>
            </div>

            <div className="overflow-x-auto min-h-[400px]">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50/60 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-bold whitespace-nowrap">
                  <tr>
                    {[
                      "ID",
                      "Name",
                      "Email",
                      "Mobile",
                      "SHGs Name",
                      "Village",
                      "Taluka",
                      "District",
                      "Status",
                      "Action"
                    ].map((h) => (
                      <th
                        key={h}
                        className={`px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider ${h === "Action" ? "text-center" : "text-left"}`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    <tr>
                      <td colSpan="10" className="p-8 text-center text-slate-500">Loading mappings...</td>
                    </tr>
                  ) : filteredMappings.length > 0 ? (
                    filteredMappings.map((mapping, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="p-4 text-sm text-slate-900">{mapping.id}</td>
                        <td className="p-4 text-sm font-semibold text-slate-900 whitespace-nowrap">{mapping.name}</td>
                        <td className="p-4 text-sm text-slate-600 whitespace-nowrap">{mapping.email}</td>
                        <td className="p-4 text-sm text-slate-600">{mapping.mobile}</td>
                        <td className="p-4 text-sm text-slate-600 whitespace-nowrap">{mapping.shgName}</td>
                        <td className="p-4 text-sm text-slate-600 whitespace-nowrap">{mapping.village}</td>
                        <td className="p-4 text-sm text-slate-600 whitespace-nowrap">{mapping.taluka}</td>
                        <td className="p-4 text-sm text-slate-600 whitespace-nowrap">{mapping.district}</td>
                        <td className="p-4 text-sm">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${mapping.status === 'Active' ? 'text-emerald-700 bg-emerald-50 border border-emerald-100' : 'text-slate-600 bg-slate-100 border border-slate-200'}`}>
                            {mapping.status}
                          </span>
                        </td>
                        <td className="p-4 text-center flex items-center justify-center gap-2">
                          <button onClick={() => handleEditClick(mapping)} className="p-1.5 text-blue-500 bg-white border border-blue-200 rounded hover:bg-blue-50 transition-colors shadow-sm" title="Edit">
                            <Edit size={16} />
                          </button>
                          <button className="p-1.5 rounded-lg border border-red-100 bg-red-50 text-red-500 hover:bg-red-100 transition-colors" title="Delete">
                            <X size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10" className="p-8 text-center text-slate-500">No mappings found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </DashboardLayout>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-white w-full max-w-2xl rounded-xl shadow-2xl border border-slate-200 overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-700">SHG Mapping</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Select CRP</label>
                  <div className="relative">
                    <select
                      value={formData.crpuser}
                      onChange={(e) => setFormData({ ...formData, crpuser: e.target.value })}
                      className="w-full border border-slate-200 text-slate-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none bg-white cursor-pointer hover:border-slate-300"
                    >
                      <option value="">Select CRP</option>
                      {crps.map((crp) => {
                        const display = crp.fullname || crp.fullName || crp.name || crp.full_name || crp.employeeName || `CRP ${crp.crp_id || crp.id}`;
                        // The mapping API expects crpuser = crp_id (the CRP profile ID)
                        const crpId = crp.crp_id || crp.id || crp._id;
                        return (
                          <option key={crpId} value={crpId}>
                            {display}
                          </option>
                        );
                      })}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Select SHG</label>
                  <div className="relative">
                    <select
                      value={formData.shggroup}
                      onChange={(e) => setFormData({ ...formData, shggroup: e.target.value })}
                      className="w-full border border-slate-200 text-slate-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none bg-white cursor-pointer hover:border-slate-300"
                    >
                      <option value="">Select SHG</option>
                      {shgs.map((shg) => {
                        const display = shg.shg_name || shg.name || shg.shgName || `SHG ${shg.shg_id || shg.id}`;
                        // The mapping API expects shggroup = shg_id (the SHG profile ID)
                        const shgId = shg.shg_id || shg.id || shg._id;
                        return (
                          <option key={shgId} value={shgId}>
                            {display}
                          </option>
                        );
                      })}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Status</label>
                  <div className="relative">
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: Number(e.target.value) })}
                      className="w-full border border-slate-200 text-slate-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none bg-white cursor-pointer hover:border-slate-300"
                    >
                      <option value={0}>Active</option>
                      <option value={1}>Inactive</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-white">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 text-sm font-medium text-white bg-slate-500 hover:bg-slate-600 rounded-lg transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={handleSaveMapping}
                  disabled={isSubmitting}
                  className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Mapping"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-white w-full max-w-2xl rounded-xl shadow-2xl border border-slate-200 overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-700">Edit SHG Mapping</h2>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Select CRP</label>
                  <div className="relative">
                    <select
                      value={editFormData.crpuser}
                      onChange={(e) => setEditFormData({ ...editFormData, crpuser: e.target.value })}
                      className="w-full border border-slate-200 text-slate-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none bg-white cursor-pointer hover:border-slate-300"
                    >
                      <option value="">Select CRP</option>
                      {crps.map((crp) => {
                        const display = crp.fullname || crp.fullName || crp.name || crp.full_name || crp.employeeName || `CRP ${crp.crp_id || crp.id}`;
                        const crpId = crp.crp_id || crp.id || crp._id;
                        return (
                          <option key={crpId} value={crpId}>
                            {display}
                          </option>
                        );
                      })}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Select SHG</label>
                  <div className="relative">
                    <select
                      value={editFormData.shggroup}
                      onChange={(e) => setEditFormData({ ...editFormData, shggroup: e.target.value })}
                      className="w-full border border-slate-200 text-slate-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none bg-white cursor-pointer hover:border-slate-300"
                    >
                      <option value="">Select SHG</option>
                      {shgs.map((shg) => {
                        const display = shg.shg_name || shg.name || shg.shgName || `SHG ${shg.shg_id || shg.id}`;
                        const shgId = shg.shg_id || shg.id || shg._id;
                        return (
                          <option key={shgId} value={shgId}>
                            {display}
                          </option>
                        );
                      })}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Status</label>
                  <div className="relative">
                    <select
                      value={editFormData.status}
                      onChange={(e) => setEditFormData({ ...editFormData, status: Number(e.target.value) })}
                      className="w-full border border-slate-200 text-slate-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none bg-white cursor-pointer hover:border-slate-300"
                    >
                      <option value={0}>Active</option>
                      <option value={1}>Inactive</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-white">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2 text-sm font-medium text-white bg-slate-500 hover:bg-slate-600 rounded-lg transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={handleUpdateMapping}
                  disabled={isUpdating}
                  className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isUpdating ? "Saving..." : "Update Mapping"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ProtectedRoute>
  );
}
