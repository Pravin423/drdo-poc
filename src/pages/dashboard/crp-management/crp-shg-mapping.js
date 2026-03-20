"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Users, Link as LinkIcon, Download, Search, RefreshCw, UploadCloud, Edit, Trash2, X } from "lucide-react";
import { useState, useEffect } from "react";
import ProtectedRoute from "../../../components/ProtectedRoute";
import DashboardLayout from "../../../components/DashboardLayout";

export default function CRPSHGMapping() {
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

  const fetchMappings = async () => {
    setIsLoading(true);
    // Placeholder fetching logic
    setTimeout(() => {
      setMappings([
        {
          id: 1,
          name: "Tejas Gupta",
          email: "tejas.runtime@gmail.com",
          mobile: "8483473844",
          shgName: "Maa Bhavani SHG",
          village: "South Goa",
          taluka: "Mormugao",
          district: "Dabolim",
          status: "Active"
        },
        {
          id: 2,
          name: "Santosh",
          email: "santosh@runtime-solutions.com",
          mobile: "7208188960",
          shgName: "Mata Rani SHG",
          village: "North Goa",
          taluka: "Pernem",
          district: "Poroscodem",
          status: "Active"
        },
        {
          id: 3,
          name: "Kiran",
          email: "kiran@runtime-solutions.com",
          mobile: "8296887994",
          shgName: "Savitri SHG",
          village: "North Goa",
          taluka: "Tiswadi",
          district: "Gancim",
          status: "Active"
        }
      ]);
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    fetchMappings();
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const [crpRes, shgRes] = await Promise.all([
          fetch("/api/crp-employee", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("/api/shg-list", { headers: { Authorization: `Bearer ${token}` } })
        ]);

        const crpData = await crpRes.json();
        const shgData = await shgRes.json();

        setCrps(Array.isArray(crpData.data) ? crpData.data : (Array.isArray(crpData) ? crpData : []));
        setShgs(Array.isArray(shgData.data) ? shgData.data : (Array.isArray(shgData) ? shgData : []));
      } catch (err) {
        console.error("Failed to fetch dropdown data:", err);
      }
    };
    fetchData();
  }, []);

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
                CRP - SHG <span className="bg-gradient-to-b from-[#3b52ab] to-[#1a2e7a] bg-clip-text text-transparent">Mapping</span>
              </h1>
              <p className="text-slate-500 font-medium">Manage and view mappings between CRPs and SHGs</p>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <LinkIcon size={16} /> Link CRP to SHG
              </button>
            </div>
          </motion.header>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
               <div className="relative group w-full sm:w-80">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Search size={16} className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    placeholder="Search CRP..."
                    className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none bg-slate-50/30 focus:bg-white"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
               </div>
               <div className="flex gap-3 w-full sm:w-auto">
                 <button className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 flex items-center gap-2">
                   <RefreshCw size={16} /> Refresh
                 </button>
               </div>
            </div>

            <div className="overflow-x-auto min-h-[400px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-bold whitespace-nowrap">
                    <th className="p-4 cursor-pointer hover:bg-slate-100 transition">ID ↑↓</th>
                    <th className="p-4 cursor-pointer hover:bg-slate-100 transition">Name ↑↓</th>
                    <th className="p-4 cursor-pointer hover:bg-slate-100 transition">Email ↑↓</th>
                    <th className="p-4 cursor-pointer hover:bg-slate-100 transition">Mobile ↑↓</th>
                    <th className="p-4 cursor-pointer hover:bg-slate-100 transition">SHGs Name ↑↓</th>
                    <th className="p-4 cursor-pointer hover:bg-slate-100 transition">Village ↑↓</th>
                    <th className="p-4 cursor-pointer hover:bg-slate-100 transition">Taluka ↑↓</th>
                    <th className="p-4 cursor-pointer hover:bg-slate-100 transition">District ↑↓</th>
                    <th className="p-4 cursor-pointer hover:bg-slate-100 transition">Status ↑↓</th>
                    <th className="p-4 text-center cursor-pointer hover:bg-slate-100 transition">Action ↑↓</th>
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
                           <button className="p-1.5 text-blue-500 bg-white border border-blue-200 rounded hover:bg-blue-50 transition-colors shadow-sm" title="Edit">
                             <Edit size={16} />
                           </button>
                           <button className="p-1.5 text-red-500 bg-white border border-red-200 rounded hover:bg-red-50 transition-colors shadow-sm" title="Delete">
                             <Trash2 size={16} />
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
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
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
    </ProtectedRoute>
  );
}
