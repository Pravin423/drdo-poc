import { useState, useEffect } from "react";
import ProtectedRoute from "../../../components/ProtectedRoute";
import DashboardLayout from "../../../components/DashboardLayout";
import { Edit, Trash2, Search, Plus, Download, X, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function VerticalManagement() {
    const [verticals, setVerticals] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const fetchVerticals = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch("/api/vertical-list", {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const result = await response.json();
            const dataArray = Array.isArray(result) ? result : Array.isArray(result.data) ? result.data : [];
            const mapped = dataArray.map((v, i) => ({
                id: v.id || v._id || i + 1,
                name: v.name || v.vertical_name || v.verticalName || "—",
                code: v.code || v.vertical_code || v.verticalCode || "—",
                desc: v.description || v.desc || "—",
                start: v.start_date || v.startDate || v.start || "—",
                end: v.end_date || v.endDate || v.end || "—",
                createdBy: v.created_by || v.createdBy || v.created_by_name || "—",
                status: v.status !== undefined ? v.status : true,
                raw: v
            }));
            setVerticals(mapped);
        } catch (error) {
            console.error("Fetch verticals error:", error);
            setVerticals([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchVerticals();
    }, []);

    // Modals
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [addFormData, setAddFormData] = useState({ name: "", code: "", start: "", end: "", desc: "" });
    const [addFormError, setAddFormError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const handleAddClick = () => {
        setAddFormData({ name: "", code: "", start: "", end: "", desc: "" });
        setAddFormError("");
        setAddModalOpen(true);
    };

    const confirmAdd = async () => {
        setAddFormError("");
        if (!addFormData.name.trim() || !addFormData.code.trim() || !addFormData.start || !addFormData.end || !addFormData.desc.trim()) {
            setAddFormError("Please fill out all required fields.");
            return;
        }

        setIsSubmitting(true);
        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch("/api/add-vertical", {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    vertical_name: addFormData.name,
                    vertical_code: addFormData.code,
                    start_date: addFormData.start,
                    end_date: addFormData.end,
                    description: addFormData.desc
                })
            });

            const result = await response.json();
            if (response.ok && result.status !== false && result.status !== 0) {
                setAddModalOpen(false);
                fetchVerticals();
            } else {
                let errorMsg = result.message || result.error;
                if (!errorMsg && result.errors) {
                    errorMsg = Object.values(result.errors).flat().join(" | ");
                }
                setAddFormError(errorMsg || "Failed to add vertical");
            }
        } catch (error) {
            console.error("Error adding vertical:", error);
            setAddFormError("An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const StatusBadge = ({ status }) => (
        <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${status ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-slate-50 text-slate-500 border-slate-200"}`}>
            {status ? "Active" : "Inactive"}
        </span>
    );

    const filteredData = verticals.filter(v => 
        (v.name && v.name.toLowerCase().includes(searchQuery.toLowerCase())) || 
        (v.code && v.code.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (v.desc && v.desc.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <ProtectedRoute allowedRole="super-admin">
            <DashboardLayout>
                <div className="max-w-[1600px] mx-auto space-y-8 p-6">
                    {/* Header Top Layer */}
                    <motion.header
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                        <div className="space-y-1">
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
                                Vertical <span className="bg-gradient-to-b from-[#3b52ab] to-[#1a2e7a] bg-clip-text text-transparent">Management</span>
                            </h1>
                            <p className="text-slate-500 font-medium">Manage operational verticals and domains for DRDA schemes.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all shadow-sm">
                                <Download size={16} /> Export CSV
                            </button>
                            <button onClick={handleAddClick} className="flex items-center gap-2 px-4 py-2 bg-[#3b52ab] text-white rounded-xl text-sm font-semibold hover:bg-[#2e4085] transition-all shadow-sm">
                                <Plus size={16} /> Add Vertical
                            </button>
                        </div>
                    </motion.header>

                    {/* Table Container CRP List Style */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px] flex flex-col"
                    >
                        {/* Search and Filters */}
                        <div className="px-6 py-5 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="relative group w-full sm:w-[320px]">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Search size={18} className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search verticals..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full border border-slate-200 rounded-2xl pl-11 pr-4 py-2.5 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none bg-white font-medium text-slate-700"
                                />
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto min-h-[400px]">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50/60 border-b border-t border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-bold whitespace-nowrap">
                                    <tr>
                                        {[
                                            "ID",
                                            "Vertical Name",
                                            "Vertical Code",
                                            "Description",
                                            "Start Date",
                                            "End Date",
                                            "Created By",
                                            "Status",
                                            "Action"
                                        ].map((h) => (
                                            <th
                                                key={h}
                                                className={`px-4 py-4 ${h === "Action" ? "text-right" : "text-left"}`}
                                            >
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan="9" className="px-4 py-16 text-center">
                                                <div className="flex flex-col items-center gap-3 text-slate-400">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-3"></div>
                                                    <p className="text-sm font-semibold">Loading verticals...</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filteredData.length === 0 ? (
                                        <tr>
                                            <td colSpan="9" className="px-4 py-16 text-center">
                                                <div className="flex flex-col items-center gap-3 text-slate-400">
                                                    <Search size={36} className="opacity-30" />
                                                    <p className="text-sm font-semibold">No records found</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredData.map((v, i) => (
                                            <motion.tr 
                                                key={v.id} 
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.05 }}
                                                className="hover:bg-slate-50/70 transition-colors"
                                            >
                                            <td className="px-4 py-4 text-sm font-bold text-slate-500 whitespace-nowrap">{i + 1}</td>
                                            <td className="px-4 py-4">
                                                <p className="font-semibold text-slate-900 text-sm">{v.name}</p>
                                            </td>
                                            <td className="px-4 py-4 text-sm font-medium text-slate-600 whitespace-nowrap">{v.code}</td>
                                            <td className="px-4 py-4 text-sm text-slate-600 max-w-sm truncate" title={v.desc}>{v.desc}</td>
                                            <td className="px-4 py-4 text-sm font-medium text-slate-600 whitespace-nowrap">{v.start}</td>
                                            <td className="px-4 py-4 text-sm font-medium text-slate-600 whitespace-nowrap">{v.end}</td>
                                            <td className="px-4 py-4 text-sm text-slate-700 font-medium whitespace-nowrap">{v.createdBy}</td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <StatusBadge status={v.status} />
                                            </td>
                                            <td className="px-4 py-4 text-right whitespace-nowrap">
                                                <div className="inline-flex gap-2 items-center">
                                                    <button className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-200 transition-colors" title="Edit Vertical">
                                                        <Edit size={14} />
                                                    </button>
                                                    <button className="p-1.5 rounded-lg border border-red-100 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors" title="Delete Vertical">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </div>
            </DashboardLayout>
            
            {/* Add Modal */}
            <AnimatePresence>
                {addModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setAddModalOpen(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="bg-white rounded-2xl shadow-xl w-full max-w-2xl relative z-10 overflow-hidden">
                            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center text-slate-800">
                                <h3 className="font-bold text-lg">Add Vertical</h3>
                                <button onClick={() => setAddModalOpen(false)} className="bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors text-slate-400">
                                    <X size={16}/>
                                </button>
                            </div>
                            <div className="p-6 space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="w-full">
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Vertical Name <span className="text-red-500">*</span></label>
                                        <input type="text" value={addFormData.name} onChange={(e) => setAddFormData({ ...addFormData, name: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none font-medium text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
                                    </div>
                                    <div className="w-full">
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Vertical Code <span className="text-red-500">*</span></label>
                                        <input type="text" value={addFormData.code} onChange={(e) => setAddFormData({ ...addFormData, code: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none font-medium text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
                                    </div>
                                    <div className="w-full">
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Start Date <span className="text-red-500">*</span></label>
                                        <input type="date" value={addFormData.start} onChange={(e) => setAddFormData({ ...addFormData, start: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none font-medium text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
                                    </div>
                                    <div className="w-full">
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">End Date <span className="text-red-500">*</span></label>
                                        <input type="date" value={addFormData.end} onChange={(e) => setAddFormData({ ...addFormData, end: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none font-medium text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
                                    </div>
                                </div>
                                <div className="w-full">
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description <span className="text-red-500">*</span></label>
                                    <textarea value={addFormData.desc} onChange={(e) => setAddFormData({ ...addFormData, desc: e.target.value })} placeholder="Enter description here..." className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none font-medium text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 h-28 resize-none" />
                                </div>
                                <AnimatePresence>
                                    {addFormError && (
                                        <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-sm text-red-500 bg-red-50 p-2.5 rounded-lg border border-red-100 font-medium">{addFormError}</motion.p>
                                    )}
                                </AnimatePresence>
                            </div>
                            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                                <button onClick={confirmAdd} disabled={isSubmitting} className="px-5 py-2.5 text-sm font-bold text-white bg-[#0d6efd] hover:bg-blue-600 rounded-xl shadow-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2">
                                    {isSubmitting ? <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : null}
                                    Submit
                                </button>
                                <button onClick={() => setAddModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-white bg-[#6c757d] hover:bg-slate-600 rounded-xl shadow-sm transition-colors">
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </ProtectedRoute>
    );
}
