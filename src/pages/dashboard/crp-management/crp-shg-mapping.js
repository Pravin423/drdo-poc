"use client";

import { motion } from "framer-motion";
import { Users, Link as LinkIcon, Download, Search, RefreshCw, UploadCloud, Edit, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import ProtectedRoute from "../../../components/ProtectedRoute";
import DashboardLayout from "../../../components/DashboardLayout";

export default function CRPSHGMapping() {
  const [mappings, setMappings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");

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
  }, []);

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
              <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 flex items-center gap-2">
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
    </ProtectedRoute>
  );
}
