import {
    MapPin,
    Search,
    Plus,
    Filter,
    Download,
    MoreVertical,
    Edit2,
    Trash2,
    ChevronLeft,
    ChevronRight,
    TrendingUp,
    Users,
    Map,
    Eye,
    X,
    Save
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProtectedRoute from "../../../components/ProtectedRoute";
import DashboardLayout from "../../../components/DashboardLayout";
import { exportToExcel } from "../../../lib/exportToExcel";



const SUMMARY_CARDS = [
    {
        label: "Total Districts",
        value: "2",
        delta: "State of Goa",
        isPositive: true,
        icon: MapPin,
        accent: "text-blue-600 bg-blue-50 border-blue-100",
    },
    {
        label: "Total Talukas",
        value: "12",
        delta: "Across all districts",
        isPositive: true,
        icon: Map,
        accent: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
    {
        label: "Geocoded Villages",
        value: "396",
        delta: "100% Mapped",
        isPositive: true,
        icon: TrendingUp,
        accent: "text-purple-600 bg-purple-50 border-purple-100",
    },
    {
        label: "Active Field CRPs",
        value: "8,970",
        delta: "Deployed",
        isPositive: true,
        icon: Users,
        accent: "text-amber-600 bg-amber-50 border-amber-100",
    },
];

export default function DistrictsManagement() {
    const [districts, setDistricts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchDistricts = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch("/api/districts", {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch districts');
            }
            
            const result = await response.json();
            
            const dataArray = Array.isArray(result.data) ? result.data : (Array.isArray(result) ? result : []);
            
            const fetchedDistricts = dataArray.map((d, index) => ({
                id: (d.id || d._id || index + 1).toString(),
                name: d.name || d.district || d.districtName || d.district_name || "",
                censusCode: (d.censusCode || d.census_code || d.census || "").toString()
            }));
            
            setDistricts(fetchedDistricts);
        } catch (error) {
            console.error("Error fetching districts:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDistricts();
    }, []);

    // Modal States
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [addFormData, setAddFormData] = useState({ name: "", censusCode: "" });
    const [addFormError, setAddFormError] = useState("");

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editFormData, setEditFormData] = useState({ id: "", name: "", censusCode: "" });

    const [saveConfirmOpen, setSaveConfirmOpen] = useState(false);

    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [districtToDelete, setDistrictToDelete] = useState(null);

    const handleAddClick = () => {
        setAddFormData({ name: "", censusCode: "" });
        setAddFormError("");
        setAddModalOpen(true);
    };

    const confirmAdd = async () => {
        setAddFormError("");
        if (!addFormData.name || !addFormData.censusCode) {
            setAddFormError("Both fields are required.");
            return;
        }

        // Validate Census Code strictly below 6 digits (max 5 digits length)
        if (addFormData.censusCode.length >= 6) {
            setAddFormError("Census Code must be below 6 digits.");
            return;
        }
        
        // Optional: Ensure it's numeric only 
        if (!/^\d+$/.test(addFormData.censusCode)) {
             setAddFormError("Census Code must be a valid number.");
             return;
        }

        try {
            const token = localStorage.getItem("authToken");
            
            // Expected payload format based on Postman details: {"distName": "...", "censusCode": "..."}
            const payload = {
                distName: addFormData.name,
                censusCode: addFormData.censusCode
            };

            const response = await fetch("/api/districts", {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error("Failed to create district");
            }
            
            // Check successfully returned response to conditionally re-fetch
            const result = await response.json();
            if (result.status === 1 || result.success || response.ok) {
                 // Re-fetch all districts from server to guarantee sync with Database
                 await fetchDistricts();
                 setAddModalOpen(false);   
                 setAddFormData({ name: "", censusCode: "" });
            }
        } catch (error) {
            console.error("Error adding district:", error);
            alert("Failed to add district. Please try again.");
        }
    };

    const handleDeleteClick = (id) => {
        setDistrictToDelete(id);
        setDeleteConfirmOpen(true);
    };

    const confirmDelete = () => {
        if (districtToDelete) {
            setDistricts(districts.filter(d => d.id !== districtToDelete));
            setDeleteConfirmOpen(false);
            setDistrictToDelete(null);
        }
    };

    const handleEditClick = (district) => {
        setEditFormData({ id: district.id, name: district.name, censusCode: district.censusCode });
        setEditModalOpen(true);
    };

    const handleSaveClick = () => {
        setSaveConfirmOpen(true);
    };

    const confirmSave = () => {
        setDistricts(districts.map(d =>
            d.id === editFormData.id ? { ...d, name: editFormData.name, censusCode: editFormData.censusCode } : d
        ));
        setSaveConfirmOpen(false);
        setEditModalOpen(false);
    };

    // Disable background scroll when a modal is open
    useEffect(() => {
        if (addModalOpen || editModalOpen || saveConfirmOpen || deleteConfirmOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        // Cleanup function for when component unmounts
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [addModalOpen, editModalOpen, saveConfirmOpen, deleteConfirmOpen]);

    const filteredDistricts = districts.filter((district) => {
        const name = district?.name || "";
        const censusCode = district?.censusCode || "";
        return name.toLowerCase().includes(searchQuery.toLowerCase()) ||
               censusCode.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const handleExport = () => {
        exportToExcel({
            title: "Goa Districts — Detailed Report",
            headers: ["ID", "District Name", "Census Code"],
            rows: filteredDistricts.map(d => [d.id, d.name, d.censusCode]),
            filename: "goa_districts_report",
        });
    };

    return (
        <ProtectedRoute allowedRole="super-admin">
            <>
                <DashboardLayout>
                    <div className="max-w-[1600px] mx-auto space-y-8 p-4">

                        {/* Header Section */}
                        <motion.header
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="flex flex-col md:flex-row md:items-center justify-between gap-4"
                        >
                            <div className="space-y-1">
                                <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
                                    District <span className="bg-gradient-to-b from-[#3b52ab] to-[#1a2e7a] bg-clip-text text-transparent">
                                        Management</span>
                                </h1>
                                <p className="text-slate-500 font-medium">
                                    Manage and monitor administrative districts across Goa.
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all shadow-sm">
                                    <Download size={16} /> Export
                                </button>
                                <button onClick={handleAddClick} className="flex items-center gap-2 px-4 py-2 bg-tech-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-tech-blue-700 transition-all shadow-md shadow-tech-blue-500/20 active:scale-95">
                                    <Plus size={16} /> Add District
                                </button>
                            </div>
                        </motion.header>

                        {/* Summary Cards */}
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                            {SUMMARY_CARDS.map((card, index) => (
                                <motion.section
                                    key={card.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
                                    className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className={`p-3 rounded-2xl ${card.accent} border`}>
                                            <card.icon size={22} />
                                        </div>
                                        <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 rounded-full">
                                            {card.delta}
                                        </div>
                                    </div>
                                    <div className="mt-6 space-y-1">
                                        <p className="text-3xl font-extrabold text-slate-900 tracking-tight">{card.value}</p>
                                        <p className="text-sm font-semibold text-slate-500">{card.label}</p>
                                    </div>
                                </motion.section>
                            ))}
                        </div>

                        {/* Main Content Area: Table */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px] flex flex-col"
                        >
                            {/* Table Controls Header */}
                            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
                                <div className="relative max-w-md w-full">
                                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search districts by name or census code..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-tech-blue-500/20 focus:border-tech-blue-500 transition-all font-medium"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm">
                                        <Filter size={16} /> Filters
                                    </button>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="flex-1 overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/80 border-b border-slate-100">
                                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-transparent">ID</th>
                                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-transparent">District Name</th>
                                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-transparent">Census Code</th>
                                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 text-right bg-transparent">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {isLoading ? (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-12 text-center">
                                                    <div className="flex flex-col items-center justify-center text-slate-400">
                                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-500 mb-3"></div>
                                                        <p className="text-sm font-semibold">Loading districts...</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : filteredDistricts.length > 0 ? (
                                            filteredDistricts.map((district, idx) => (
                                                <tr
                                                    key={district.id}
                                                    className="hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
                                                >
                                                    <td className="px-6 py-4">
                                                        <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                                                            {districts.findIndex(d => d.id === district.id) + 1}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <p className="text-sm font-semibold text-slate-800">
                                                            {district.name}
                                                        </p>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm text-slate-600">{district.censusCode}</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button onClick={() => handleEditClick(district)} className="p-1.5 text-slate-400 cursor-pointer hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Edit District">
                                                                <Edit2 size={16} />
                                                            </button>
                                                            <button onClick={() => handleDeleteClick(district.id)} className="p-1.5 text-slate-400 cursor-pointer hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Delete District">
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-12 text-center">
                                                    <div className="flex flex-col items-center justify-center text-slate-400">
                                                        <Map size={32} className="mb-3 opacity-50" />
                                                        <p className="text-sm font-semibold">No districts found matching your search.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Table Footer */}
                            <div className="px-6 py-4 bg-slate-50 mt-auto border-t border-slate-100 flex items-center justify-between">
                                <p className="text-xs font-semibold text-slate-500">
                                    Showing all <span className="text-slate-900">{filteredDistricts.length}</span> records
                                </p>
                                <div className="flex gap-2">
                                    <button disabled className="p-1.5 text-slate-300 rounded-lg border border-slate-200 bg-white cursor-not-allowed">
                                        <ChevronLeft size={16} />
                                    </button>
                                    <button disabled className="p-1.5 text-slate-300 rounded-lg border border-slate-200 bg-white cursor-not-allowed">
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                    </div>
                </DashboardLayout>

                {/* Add Modal */}
                <AnimatePresence>
                    {addModalOpen && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
                                onClick={() => setAddModalOpen(false)}
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                                className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden relative z-10"
                            >
                                <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center">
                                    <h3 className="text-xl font-medium text-slate-800">Add District</h3>
                                    <button onClick={() => setAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                        <X size={20} className="stroke-2" />
                                    </button>
                                </div>
                                <div className="p-6 space-y-6 flex flex-col items-center w-full">
                                    <div className="w-full">
                                        <label className="block text-[15px] font-normal text-slate-700 mb-2">District Name</label>
                                        <input
                                            type="text"
                                            value={addFormData.name}
                                            onChange={(e) => setAddFormData({ ...addFormData, name: e.target.value })}
                                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[15px] outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all text-slate-700"
                                        />
                                    </div>
                                    <div className="w-full">
                                        <label className="block text-[15px] font-normal text-slate-700 mb-2">Census Code</label>
                                        <input
                                            type="text"
                                            maxLength={5}
                                            value={addFormData.censusCode}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, ''); // enforce numbers only
                                                setAddFormData({ ...addFormData, censusCode: val });
                                            }}
                                            className={`w-full border rounded-lg px-3 py-2 text-[15px] outline-none transition-all text-slate-700 ${addFormError && addFormError.includes('Census Code') ? 'border-red-400 focus:ring-1 focus:ring-red-400' : 'border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-400'}`}
                                            placeholder="Max 5 digits"
                                        />
                                    </div>
                                    <AnimatePresence>
                                        {addFormError && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="w-full text-sm font-medium text-red-500 bg-red-50 p-2.5 rounded-lg border border-red-100"
                                            >
                                                {addFormError}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <div className="px-6 py-5 border-t border-slate-200 flex justify-end gap-3">
                                    <button onClick={confirmAdd} className="px-5 py-2 text-[15px] font-medium text-white bg-[#0d6efd] hover:bg-blue-600 rounded-lg shadow-sm transition-colors">
                                        Submit
                                    </button>
                                    <button onClick={() => setAddModalOpen(false)} className="px-5 py-2 text-[15px] font-medium text-white bg-[#6c757d] hover:bg-slate-600 rounded-lg text-center transition-colors">
                                        Close
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Edit Modal */}
                <AnimatePresence>
                    {editModalOpen && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
                                onClick={() => setEditModalOpen(false)}
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                                className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative z-10"
                            >
                                <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
                                    <h3 className="text-lg font-bold text-slate-800">Edit District</h3>
                                    <button onClick={() => setEditModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors">
                                        <X size={16} className="stroke-2" />
                                    </button>
                                </div>
                                <div className="p-6 space-y-5 flex flex-col items-center w-full">
                                    <div className="w-full">
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">District Name</label>
                                        <input
                                            type="text"
                                            value={editFormData.name}
                                            onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                            className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-tech-blue-500 focus:ring-2 focus:ring-tech-blue-500/20 transition-all text-slate-700 font-medium"
                                        />
                                    </div>
                                    <div className="w-full">
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Census Code</label>
                                        <input
                                            type="text"
                                            value={editFormData.censusCode}
                                            onChange={(e) => setEditFormData({ ...editFormData, censusCode: e.target.value })}
                                            className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-tech-blue-500 focus:ring-2 focus:ring-tech-blue-500/20 transition-all text-slate-700 font-medium"
                                        />
                                    </div>
                                </div>
                                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                                    <button onClick={() => setEditModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-xl transition-colors">
                                        Cancel
                                    </button>
                                    <button onClick={handleSaveClick} className="px-5 py-2.5 text-sm font-bold text-white bg-tech-blue-600 hover:bg-tech-blue-700 rounded-xl shadow-sm transition-colors">
                                        Save Changes
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Save Confirmation Modal */}
                <AnimatePresence>
                    {saveConfirmOpen && (
                        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
                                onClick={() => setSaveConfirmOpen(false)}
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ type: "spring", duration: 0.5, bounce: 0.4 }}
                                className="bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden z-10"
                            >
                                <div className="p-8 text-center flex flex-col items-center">
                                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-5 rotate-3">
                                        <Save size={32} />
                                    </div>
                                    <h3 className="text-xl font-extrabold text-slate-800 mb-2">Confirm Save</h3>
                                    <p className="text-sm font-medium text-slate-500 mb-8 px-2">Are you sure you want to save these changes to the district form?</p>
                                    <div className="flex gap-3 justify-center w-full">
                                        <button onClick={() => setSaveConfirmOpen(false)} className="flex-1 px-4 py-3 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
                                            Cancel
                                        </button>
                                        <button onClick={confirmSave} className="flex-1 px-4 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-colors active:scale-95">
                                            Yes, Save
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Delete Confirmation Modal */}
                <AnimatePresence>
                    {deleteConfirmOpen && (
                        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]"
                                onClick={() => setDeleteConfirmOpen(false)}
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                transition={{ type: "spring", duration: 0.5, bounce: 0.4 }}
                                className="bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden z-10"
                            >
                                <div className="p-8 text-center flex flex-col items-center">
                                    <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-5 -rotate-3">
                                        <Trash2 size={32} />
                                    </div>
                                    <h3 className="text-xl font-extrabold text-slate-800 mb-2">Delete District?</h3>
                                    <p className="text-sm font-medium text-slate-500 mb-8">This action cannot be undone. Are you sure you want to permanently delete this district?</p>
                                    <div className="flex gap-3 justify-center w-full">
                                        <button onClick={() => setDeleteConfirmOpen(false)} className="flex-1 px-4 py-3 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
                                            Keep It
                                        </button>
                                        <button onClick={confirmDelete} className="flex-1 px-4 py-3 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md shadow-red-500/20 transition-colors active:scale-95">
                                            Yes, Delete
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </>
        </ProtectedRoute>
    );
}
