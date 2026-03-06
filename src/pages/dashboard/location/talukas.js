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

// Mock Data for Goa Talukas
const TALUKAS_DATA = [
    { id: "1", name: "Canacona", censusCode: "5619", districtName: "South Goa" },
    { id: "2", name: "Mormugao", censusCode: "5615", districtName: "South Goa" },
    { id: "3", name: "Quepem", censusCode: "5617", districtName: "South Goa" },
    { id: "4", name: "Salcete", censusCode: "5616", districtName: "South Goa" },
    { id: "5", name: "Sanguem", censusCode: "5618", districtName: "South Goa" },
    { id: "6", name: "Bardez", censusCode: "5610", districtName: "North Goa" },
    { id: "7", name: "Bicholim", censusCode: "5612", districtName: "North Goa" },
    { id: "8", name: "Pernem", censusCode: "5609", districtName: "North Goa" },
    { id: "9", name: "Ponda", censusCode: "5614", districtName: "North Goa" },
    { id: "10", name: "Satari", censusCode: "5613", districtName: "North Goa" },
];

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
        value: "10",
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

export default function TalukasManagement() {
    const [talukas, setTalukas] = useState(TALUKAS_DATA);
    const [searchQuery, setSearchQuery] = useState("");

    // Modal States
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [addFormData, setAddFormData] = useState({ name: "", censusCode: "", districtName: "" });

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editFormData, setEditFormData] = useState({ id: "", name: "", censusCode: "", districtName: "" });

    const [saveConfirmOpen, setSaveConfirmOpen] = useState(false);

    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [talukaToDelete, setTalukaToDelete] = useState(null);

    const handleAddClick = () => {
        setAddFormData({ name: "", censusCode: "", districtName: "" });
        setAddModalOpen(true);
    };

    const confirmAdd = () => {
        if (!addFormData.name || !addFormData.censusCode || !addFormData.districtName) return;
        const newTaluka = {
            id: (talukas.length + 1).toString(),
            name: addFormData.name,
            censusCode: addFormData.censusCode,
            districtName: addFormData.districtName
        };
        setTalukas([...talukas, newTaluka]);
        setAddModalOpen(false);
    };

    const handleDeleteClick = (id) => {
        setTalukaToDelete(id);
        setDeleteConfirmOpen(true);
    };

    const confirmDelete = () => {
        if (talukaToDelete) {
            setTalukas(talukas.filter(t => t.id !== talukaToDelete));
            setDeleteConfirmOpen(false);
            setTalukaToDelete(null);
        }
    };

    const handleEditClick = (taluka) => {
        setEditFormData({ id: taluka.id, name: taluka.name, censusCode: taluka.censusCode, districtName: taluka.districtName });
        setEditModalOpen(true);
    };

    const handleSaveClick = () => {
        setSaveConfirmOpen(true);
    };

    const confirmSave = () => {
        setTalukas(talukas.map(t =>
            t.id === editFormData.id ? { ...t, name: editFormData.name, censusCode: editFormData.censusCode, districtName: editFormData.districtName } : t
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

    const filteredTalukas = talukas.filter((taluka) =>
        taluka.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        taluka.censusCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        taluka.districtName.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                                    Taluka <span className="bg-gradient-to-b from-[#3b52ab] to-[#1a2e7a] bg-clip-text text-transparent">
                                        Management</span>
                                </h1>
                                <p className="text-slate-500 font-medium">
                                    Manage and monitor talukas across Goa districts.
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all shadow-sm">
                                    <Download size={16} /> Export
                                </button>
                                <button onClick={handleAddClick} className="flex items-center gap-2 px-4 py-2 bg-tech-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-tech-blue-700 transition-all shadow-md shadow-tech-blue-500/20 active:scale-95">
                                    <Plus size={16} /> Add Taluka
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
                                        placeholder="Search talukas by name, code, or district..."
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
                                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-transparent">Name</th>
                                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-transparent">Census Code</th>
                                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-transparent">District Name</th>
                                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 text-right bg-transparent">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filteredTalukas.length > 0 ? (
                                            filteredTalukas.map((taluka) => (
                                                <tr
                                                    key={taluka.id}
                                                    className="hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
                                                >
                                                    <td className="px-6 py-4">
                                                        <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                                                            {taluka.id}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <p className="text-sm font-semibold text-slate-800">
                                                            {taluka.name}
                                                        </p>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm text-slate-600">{taluka.censusCode}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm text-slate-600">{taluka.districtName}</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button onClick={() => handleEditClick(taluka)} className="p-1.5 text-slate-400 cursor-pointer hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Edit Taluka">
                                                                <Edit2 size={16} />
                                                            </button>
                                                            <button onClick={() => handleDeleteClick(taluka.id)} className="p-1.5 text-slate-400 cursor-pointer hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Delete Taluka">
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-12 text-center">
                                                    <div className="flex flex-col items-center justify-center text-slate-400">
                                                        <Map size={32} className="mb-3 opacity-50" />
                                                        <p className="text-sm font-semibold">No talukas found matching your search.</p>
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
                                    Showing all <span className="text-slate-900">{filteredTalukas.length}</span> records
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
                                    <h3 className="text-xl font-medium text-slate-800">Add Taluka</h3>
                                    <button onClick={() => setAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                        <X size={20} className="stroke-2" />
                                    </button>
                                </div>
                                <div className="p-6 space-y-6 flex flex-col items-center w-full">
                                    <div className="w-full">
                                        <label className="block text-[15px] font-normal text-slate-700 mb-2">Taluka Name</label>
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
                                            value={addFormData.censusCode}
                                            onChange={(e) => setAddFormData({ ...addFormData, censusCode: e.target.value })}
                                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[15px] outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all text-slate-700"
                                        />
                                    </div>
                                    <div className="w-full">
                                        <label className="block text-[15px] font-normal text-slate-700 mb-2">District Name</label>
                                        <select
                                            value={addFormData.districtName}
                                            onChange={(e) => setAddFormData({ ...addFormData, districtName: e.target.value })}
                                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[15px] outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all text-slate-700 bg-white"
                                        >
                                            <option value="">Select District</option>
                                            <option value="North Goa">North Goa</option>
                                            <option value="South Goa">South Goa</option>
                                        </select>
                                    </div>
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
                                    <h3 className="text-lg font-bold text-slate-800">Edit Taluka</h3>
                                    <button onClick={() => setEditModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors">
                                        <X size={16} className="stroke-2" />
                                    </button>
                                </div>
                                <div className="p-6 space-y-5 flex flex-col items-center w-full">
                                    <div className="w-full">
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Taluka Name</label>
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
                                    <div className="w-full">
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">District Name</label>
                                        <select
                                            value={editFormData.districtName}
                                            onChange={(e) => setEditFormData({ ...editFormData, districtName: e.target.value })}
                                            className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-tech-blue-500 focus:ring-2 focus:ring-tech-blue-500/20 transition-all text-slate-700 font-medium bg-white"
                                        >
                                            <option value="North Goa">North Goa</option>
                                            <option value="South Goa">South Goa</option>
                                        </select>
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
                                    <p className="text-sm font-medium text-slate-500 mb-8 px-2">Are you sure you want to save these changes to the taluka form?</p>
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
                                    <h3 className="text-xl font-extrabold text-slate-800 mb-2">Delete Taluka?</h3>
                                    <p className="text-sm font-medium text-slate-500 mb-8">This action cannot be undone. Are you sure you want to permanently delete this taluka?</p>
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
