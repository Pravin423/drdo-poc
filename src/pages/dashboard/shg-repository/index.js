import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Search, Users, Aperture, UploadCloud, Eye, Edit, Activity, Zap, MapPin } from "lucide-react";
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
        if (s.status === 0 || s.status === "Inactive") statusStr = "Inactive";
        if (s.status === 2 || s.status === "Deleted") statusStr = "Deleted";
        
        return {
          id: s.shg_id || s.id || `SHG${i+1}`,
          name: s.shg_name || s.name || "-",
          contactPerson: s.contact_person_name || s.contactPerson || "-",
          mobile: s.contact_person_mobile || s.mobile || s.mobile_number || s.contact_number || "-",
          district: s.district || s.district_name || "-",
          taluka: s.taluka || s.taluka_name || "-",
          village: s.village || s.village_name || "-",
          status: statusStr
        };
      }));
    } catch (err) {
      console.error("Failed to fetch SHGs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSHGs();
  }, []);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    shgName: "",
    contactPersonName: "",
    contactPersonMobile: "",
    district: "",
    taluka: "",
    village: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newShg = {
      id: `SHG00${shgs.length + 1}`,
      name: formData.shgName,
      contactPerson: formData.contactPersonName,
      mobile: formData.contactPersonMobile,
      district: formData.district,
      taluka: formData.taluka,
      village: formData.village,
    };
    setShgs([newShg, ...shgs]);
    setIsModalOpen(false);
    setFormData({
      shgName: "", contactPersonName: "", contactPersonMobile: "", district: "", taluka: "", village: ""
    });
  };

  const filteredSHGs = shgs.filter(shg => 
    shg.name.toLowerCase().includes(search.toLowerCase()) ||
    shg.contactPerson.toLowerCase().includes(search.toLowerCase())
  );

  const inputClasses = "w-full px-4 py-2.5 rounded-xl border focus:bg-white transition-all outline-none text-sm bg-slate-50 border-slate-100 focus:border-blue-500";
  const labelClasses = "text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1";

  const totalSHGs = shgs.length;
  const activeSHGs = shgs.length;
  const villagesCovered = new Set(shgs.map(s => s.village)).size;

  const summaryCards = [
    { label: "Total SHGs", value: totalSHGs, icon: Users, accent: "bg-blue-50 text-blue-600 border-blue-100" },
    { label: "Active SHGs", value: activeSHGs, icon: Activity, accent: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    { label: "Villages Covered", value: villagesCovered, icon: MapPin, accent: "bg-orange-50 text-orange-600 border-orange-100" },
    { label: "New This Month", value: "0", icon: Zap, accent: "bg-purple-50 text-purple-600 border-purple-100" },
  ];

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

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
                onClick={() => setIsModalOpen(true)}
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
              <div className="w-full md:w-96 relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Search size={16} className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  placeholder="Search SHG or Contact Person..."
                  className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none bg-slate-50/30 focus:bg-white"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-slate-50/60">
                  <tr>
                    {["ID", "SHG Name", "Contact Person", "Mobile", "District", "Taluka", "Village", "Status", "Action"].map((h) => (
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
                        {Array.from({ length: 9 }).map((_, j) => (
                          <td key={j} className="px-4 py-4">
                            <div className="h-4 bg-slate-100 rounded-lg w-3/4" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : filteredSHGs.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-4 py-16 text-center">
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
                        <td className="px-4 py-3 text-sm text-slate-600">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${shg.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                            {shg.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                             <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                               <Eye size={16} />
                             </button>
                             <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
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
                    <h2 className="text-2xl font-bold text-white drop-shadow-sm">Create SHG</h2>
                    <p className="text-slate-400 text-xs font-medium mt-0.5">Register a new Self Help Group</p>
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
                            <option value="" disabled>Choose...</option>
                            <option value="North Goa">North Goa</option>
                            <option value="South Goa">South Goa</option>
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
                            className={inputClasses}
                          >
                            <option value="" disabled>Choose...</option>
                            <option value="Taluka 1">Taluka 1</option>
                            <option value="Taluka 2">Taluka 2</option>
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
                            className={inputClasses}
                          >
                            <option value="" disabled>Choose...</option>
                            <option value="Village 1">Village 1</option>
                            <option value="Village 2">Village 2</option>
                          </select>
                        </div>
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
                        className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors shadow-lg shadow-blue-500/30"
                      >
                        Submit
                      </button>
                    </div>

                  </form>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ProtectedRoute>
  );
}
