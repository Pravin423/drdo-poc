"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Users, Link as LinkIcon, Search, RefreshCw, Edit, Trash2, X } from "lucide-react";
import { useState, useEffect } from "react";
import ProtectedRoute from "../../../components/ProtectedRoute";
import DashboardLayout from "../../../components/DashboardLayout";

export default function CRPVerticalMapping() {
  const [mappings, setMappings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [crps, setCrps] = useState([]);
  const [verticals, setVerticals] = useState([]);
  const [formData, setFormData] = useState({
    crpuser: "",
    vertical_id: "",
    status: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    mappingId: "",
    crpuser: "",
    vertical_id: "",
    status: 0,
  });
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch mappings, crp list, and vertical list
  const fetchMappings = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      
      // Fetch CRPS
      const crpRes = await fetch("/api/user", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const crpResult = await crpRes.json();
      if (crpResult.data && Array.isArray(crpResult.data)) {
        setCrps(crpResult.data.filter(user => user.role === "crp"));
      }

      // Fetch Verticals
      const vertRes = await fetch("/api/vertical-list", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const vertResult = await vertRes.json();
      if (vertResult && Array.isArray(vertResult)) {
        setVerticals(vertResult);
      } else if (vertResult.data && Array.isArray(vertResult.data)) {
        setVerticals(vertResult.data);
      }

      // Fetch mappings
      const res = await fetch("/api/vertical-mapping-list", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        console.warn(`Failed to fetch mappings: ${res.statusText}`);
        return;
      }

      const result = await res.json();
      
      const mappingsList = Array.isArray(result.data) ? result.data : Array.isArray(result) ? result : [];
      setMappings(mappingsList.map((mapping, idx) => ({
        id: mapping.id || mapping.mapping_id || idx + 1,
        crpId: mapping.user_id || mapping.crpuser || mapping.crp_id || "",
        verticalId: mapping.vertical_id || "",
        name: mapping.fullname || mapping.crp_name || mapping.name || "N/A",
        email: mapping.email || mapping.crp_email || "N/A",
        mobile: mapping.mobile || mapping.crp_mobile || "N/A",
        verticalName: mapping.vertical_name || mapping.verticalName || mapping.title || "N/A",
        status: mapping.status === 0 || mapping.status === "0" || mapping.status === "Active" ? "Active" : "Inactive",
      })));

    } catch (err) {
      console.error("[CRP-Vertical Mapping] Fetch error:", err);
      // setMappings([]);
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
      vertical_id: mapping.verticalId,
      status: mapping.status === "Active" ? 0 : 1
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateMapping = async () => {
    if (!editFormData.crpuser || !editFormData.vertical_id) {
      alert("Please select both CRP and Vertical");
      return;
    }

    setIsUpdating(true);
    try {
      const token = localStorage.getItem("authToken");
      const payload = {
        mapping_id: editFormData.mappingId,
        crp_id: Number(editFormData.crpuser),
        vertical_id: Number(editFormData.vertical_id),
        status: Number(editFormData.status)
      };

      const res = await fetch("/api/edit-vertical-mapping", {
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
    if (!formData.crpuser || !formData.vertical_id) {
      alert("Please select both CRP and Vertical");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("authToken");
      const payload = {
        crp_id: Number(formData.crpuser),
        vertical_id: Number(formData.vertical_id),
        status: Number(formData.status)
      };

      const res = await fetch("/api/add-vertical-mapping", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      let data;
      try {
        data = await res.json();
      } catch(e) { /* ignore non-json */ }
      
      if (!res.ok) {
        throw new Error((data && data.message) || "Failed to save mapping");
      }

      alert("Mapping saved successfully");
      setIsModalOpen(false);
      setFormData({ crpuser: "", vertical_id: "", status: 0 });
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
    (m.email || "").toLowerCase().includes(search.toLowerCase()) ||
    (m.verticalName || "").toLowerCase().includes(search.toLowerCase())
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
                CRP - Vertical <span className="bg-gradient-to-b from-[#3b52ab] to-[#1a2e7a] bg-clip-text text-transparent">Mapping</span>
              </h1>
              <p className="text-slate-500 font-medium">Manage and view mappings between CRPs and Verticals</p>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <LinkIcon size={16} /> Link CRP to Vertical
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
                    placeholder="Search Mapping..."
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
                      "CRP Name",
                      "CRP Email",
                      "CRP Mobile",
                      "Vertical Name",
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
                      <td colSpan="7" className="p-8 text-center text-slate-500">Loading mappings...</td>
                    </tr>
                  ) : filteredMappings.length > 0 ? (
                    filteredMappings.map((mapping, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="p-4 text-sm text-slate-900">{mapping.id}</td>
                        <td className="p-4 text-sm font-semibold text-slate-900 whitespace-nowrap">{mapping.name}</td>
                        <td className="p-4 text-sm text-slate-600 whitespace-nowrap">{mapping.email}</td>
                        <td className="p-4 text-sm text-slate-600">{mapping.mobile}</td>
                        <td className="p-4 text-sm text-slate-600 whitespace-nowrap">{mapping.verticalName}</td>
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
                             <Trash2 size={16} />
                           </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="p-8 text-center text-slate-500">No mappings found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </DashboardLayout>

      {/* CREATE MODAL */}
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
                <h2 className="text-xl font-bold text-slate-700">Link CRP to Vertical</h2>
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
                        const display = crp.fullname || crp.name || `CRP ${crp.id}`;
                        const crpId = crp.id || crp.crp_id;
                        return (
                          <option key={crpId} value={crpId}>
                            {display}
                          </option>
                        );
                      })}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Select Vertical</label>
                  <div className="relative">
                    <select
                      value={formData.vertical_id}
                      onChange={(e) => setFormData({ ...formData, vertical_id: e.target.value })}
                      className="w-full border border-slate-200 text-slate-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none bg-white cursor-pointer hover:border-slate-300"
                    >
                      <option value="">Select Vertical</option>
                      {verticals.map((v) => {
                        const display = v.title || v.name || v.vertical_name || `Vertical ${v.id}`;
                        const vId = v.id || v.vertical_id;
                        return (
                          <option key={vId} value={vId}>
                            {display}
                          </option>
                        );
                      })}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
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
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
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

      {/* EDIT MODAL */}
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
                <h2 className="text-xl font-bold text-slate-700">Edit Vertical Mapping</h2>
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
                        const display = crp.fullname || crp.name || `CRP ${crp.id}`;
                        const crpId = crp.id || crp.crp_id;
                        return (
                          <option key={crpId} value={crpId}>
                            {display}
                          </option>
                        );
                      })}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Select Vertical</label>
                  <div className="relative">
                    <select
                      value={editFormData.vertical_id}
                      onChange={(e) => setEditFormData({ ...editFormData, vertical_id: e.target.value })}
                      className="w-full border border-slate-200 text-slate-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none bg-white cursor-pointer hover:border-slate-300"
                    >
                      <option value="">Select Vertical</option>
                      {verticals.map((v) => {
                        const display = v.title || v.name || v.vertical_name || `Vertical ${v.id}`;
                        const vId = v.id || v.vertical_id;
                        return (
                          <option key={vId} value={vId}>
                            {display}
                          </option>
                        );
                      })}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
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
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
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
