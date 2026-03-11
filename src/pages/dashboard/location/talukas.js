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
    Save,
    ChevronDown
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { motion, AnimatePresence } from "framer-motion";
import ProtectedRoute from "../../../components/ProtectedRoute";
import DashboardLayout from "../../../components/DashboardLayout";
import { exportToExcel } from "../../../lib/exportToExcel";

export default function TalukasManagement() {
    const [talukas, setTalukas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [districts, setDistricts] = useState([]);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [filterOpen, setFilterOpen] = useState(false);

    const fetchDistricts = async () => {
        try {
            const token = Cookies.get("authToken");
            const response = await fetch("/api/districts", {
                method: "GET",
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            });
            if (!response.ok) return;
            const result = await response.json();
            const dataArray = Array.isArray(result.data) ? result.data : Array.isArray(result) ? result : [];
            setDistricts(dataArray.map((d, i) => ({
                id: (d.id || d._id || i + 1).toString(),
                name: d.name || d.district || d.districtName || d.district_name || "",
            })));
        } catch (err) {
            console.error("[Talukas] ❌ Error fetching districts for filter:", err);
        }
    };

    const fetchTalukas = async (districtId = null) => {
        setIsLoading(true);
        try {
            const token = Cookies.get("authToken");
            const url = districtId ? `/api/talukas?district_id=${districtId}` : "/api/talukas";
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch talukas (status: ${response.status})`);
            }

            const result = await response.json();

            const dataArray = Array.isArray(result.data)
                ? result.data
                : Array.isArray(result)
                    ? result
                    : [];

            const fetchedTalukas = dataArray.map((t, index) => ({
                id: (t.id || t._id || index + 1).toString(),
                name: t.name || t.taluka || t.talukaName || t.taluka_name || "",
                censusCode: (t.censusCode || t.census_code || t.census || "").toString(),
                districtName: t.districtName || t.district_name || t.district || "",
            }));

            setTalukas(fetchedTalukas);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDistricts();
        fetchTalukas();
    }, []);

    const isMounted = useRef(false);
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            return;
        }
        fetchTalukas(selectedDistrict ? selectedDistrict.id : null);
    }, [selectedDistrict]);
    const [searchQuery, setSearchQuery] = useState("");

    const [addModalOpen, setAddModalOpen] = useState(false);
    const [addFormData, setAddFormData] = useState({ name: "", censusCode: "", districtID: "" });
    const [addFormError, setAddFormError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editFormData, setEditFormData] = useState({ id: "", name: "", censusCode: "", districtID: "" });
    const [editFormError, setEditFormError] = useState("");

    const [saveConfirmOpen, setSaveConfirmOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState("");

    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [talukaToDelete, setTalukaToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [talukaDetails, setTalukaDetails] = useState(null);
    const [isFetchingDetails, setIsFetchingDetails] = useState(false);
    const [viewError, setViewError] = useState("");

    const handleAddClick = () => {
        setAddFormData({ name: "", censusCode: "", districtID: "" });
        setAddFormError("");
        setAddModalOpen(true);
    };

    const confirmAdd = async () => {
        setAddFormError("");
        const name = addFormData.name?.trim() || "";
        const censusCode = addFormData.censusCode?.trim() || "";
        const districtID = addFormData.districtID;

        // Validation to prevent vulnerabilities
        if (!name) { setAddFormError("Taluka Name is required."); return; }
        if (name.length < 3) { setAddFormError("Taluka Name must be at least 3 characters."); return; }
        if (name.length > 100) { setAddFormError("Taluka Name must be at most 100 characters."); return; }
        if (!/^[a-zA-Z\s\-]+$/.test(name)) { setAddFormError("Taluka Name can only contain letters, spaces, and hyphens."); return; }

        if (!censusCode) { setAddFormError("Census Code is required."); return; }
        if (censusCode.length > 5) { setAddFormError("Census Code must be at most 5 digits."); return; }
        if (!/^\d+$/.test(censusCode)) { setAddFormError("Census Code must be a valid number."); return; }

        if (!districtID) { setAddFormError("District is required."); return; }

        setIsSubmitting(true);
        try {
            const token = Cookies.get("authToken");
            if (!token) throw new Error("Authentication token missing. Please log in again.");

            const response = await fetch("/api/talukas", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    talukaName: name,
                    censusCode: parseInt(censusCode, 10),
                    districtID: parseInt(districtID, 10)
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Failed to add taluka (status: ${response.status})`);
            }
            
            await fetchTalukas(selectedDistrict ? selectedDistrict.id : null);
            setAddModalOpen(false);
        } catch (error) {
            setAddFormError(error.message || "An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteClick = (id) => {
        setTalukaToDelete(id);
        setDeleteError("");
        setDeleteConfirmOpen(true);
    };

    const confirmDelete = async () => {
        if (!talukaToDelete) return;

        // Protection logic: validate the ID formats specifically to protect against NoSQL/SQL injections effectively
        if (!/^[a-zA-Z0-9_-]+$/.test(talukaToDelete.toString())) {
            setDeleteError("Invalid Taluka ID format.");
            return;
        }

        setIsDeleting(true);
        setDeleteError("");

        try {
            const token = Cookies.get("authToken");
            if (!token) throw new Error("Authentication token missing. Please log in again.");

            const response = await fetch(`/api/taluka-delete?id=${talukaToDelete}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Failed to delete taluka (status: ${response.status})`);
            }

            // Immediately re-fetch after confirmed deletion
            await fetchTalukas(selectedDistrict ? selectedDistrict.id : null);
            
            setDeleteConfirmOpen(false);
            setTalukaToDelete(null);
        } catch (error) {
            setDeleteError(error.message || "An error occurred while deleting.");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleViewClick = async (id) => {
        setViewError("");
        setTalukaDetails(null);
        setIsFetchingDetails(true);
        setViewModalOpen(true);

        try {
            const token = Cookies.get("authToken");
            if (!token) throw new Error("Authentication token missing.");

            const response = await fetch(`/api/taluka-details?id=${id}`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Failed to fetch details (status: ${response.status})`);
            }

            const data = await response.json();
            setTalukaDetails(data.data || data); // handle standard structure
        } catch (error) {
            setViewError(error.message || "An error occurred");
        } finally {
            setIsFetchingDetails(false);
        }
    };

    const handleEditClick = (taluka) => {
        const matchedDistrict = districts.find(d => d.name === taluka.districtName || d.id == taluka.district_id);
        const distId = matchedDistrict ? matchedDistrict.id : "";
        setEditFormData({ id: taluka.id, name: taluka.name, censusCode: taluka.censusCode, districtID: distId });
        setEditFormError("");
        setEditModalOpen(true);
    };

    const handleSaveClick = () => {
        setEditFormError("");
        const name = editFormData.name?.trim() || "";
        const censusCode = editFormData.censusCode?.toString().trim() || "";
        const districtID = editFormData.districtID;

        if (!name) { setEditFormError("Taluka Name is required."); return; }
        if (name.length < 3) { setEditFormError("Taluka Name must be at least 3 characters."); return; }
        if (name.length > 100) { setEditFormError("Taluka Name must be at most 100 characters."); return; }
        if (!/^[a-zA-Z\s\-]+$/.test(name)) { setEditFormError("Taluka Name can only contain letters, spaces, and hyphens."); return; }

        if (!censusCode) { setEditFormError("Census Code is required."); return; }
        if (censusCode.length > 5) { setEditFormError("Census Code must be at most 5 digits."); return; }
        if (!/^\d+$/.test(censusCode)) { setEditFormError("Census Code must be a valid number."); return; }

        if (!districtID) { setEditFormError("District is required."); return; }

        setSaveError("");
        setSaveConfirmOpen(true);
    };

    const confirmSave = async () => {
        setIsSaving(true);
        setSaveError("");
        
        try {
            const token = Cookies.get("authToken");
            if (!token) throw new Error("Authentication token missing. Please log in again.");

            const payload = {
                taluka_id: parseInt(editFormData.id, 10),
                talukaName: editFormData.name,
                censusCode: parseInt(editFormData.censusCode, 10),
                districtID: parseInt(editFormData.districtID, 10)
            };

            const response = await fetch("/api/taluka-update", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Failed to update taluka (status: ${response.status})`);
            }

            await fetchTalukas(selectedDistrict ? selectedDistrict.id : null);
            setSaveConfirmOpen(false);
            setEditModalOpen(false);
        } catch (error) {
            setSaveError(error.message || "An error occurred while saving.");
        } finally {
            setIsSaving(false);
        }
    };

    const filterRef = useRef(null);
    useEffect(() => {
        const handler = (e) => {
            if (filterRef.current && !filterRef.current.contains(e.target)) {
                setFilterOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    useEffect(() => {
        if (addModalOpen || editModalOpen || saveConfirmOpen || deleteConfirmOpen || viewModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [addModalOpen, editModalOpen, saveConfirmOpen, deleteConfirmOpen, viewModalOpen]);

    const filteredTalukas = talukas.filter((taluka) =>
        taluka.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        taluka.censusCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        taluka.districtName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleExport = () => {
        exportToExcel({
            title: "Goa Talukas — Detailed Report",
            headers: ["ID", "Taluka Name", "Census Code", "District Name"],
            rows: filteredTalukas.map(t => [t.id, t.name, t.censusCode, t.districtName]),
            filename: "goa_talukas_report",
        });
    };

    const dynamicSummaryCards = [
        {
            label: "Total Districts",
            value: districts.length.toString(),
            delta: "State of Goa",
            isPositive: true,
            icon: MapPin,
            accent: "text-blue-600 bg-blue-50 border-blue-100",
        },
        {
            label: "Total Talukas",
            value: talukas.length.toString(),
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

    return (
        <ProtectedRoute allowedRole="super-admin">
            <>
                <DashboardLayout>
                    <div className="max-w-[1600px] mx-auto space-y-8 p-4">

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
                                <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all shadow-sm">
                                    <Download size={16} /> Export
                                </button>
                                <button onClick={handleAddClick} className="flex items-center gap-2 px-4 py-2 bg-tech-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-tech-blue-700 transition-all shadow-md shadow-tech-blue-500/20 active:scale-95">
                                    <Plus size={16} /> Add Taluka
                                </button>
                            </div>
                        </motion.header>

                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                            {dynamicSummaryCards.map((card, index) => (
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

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px] flex flex-col"
                        >
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
                                <div className="flex items-center gap-2 flex-wrap">
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
                                                onClick={() => setSelectedDistrict(null)}
                                                className="ml-0.5 text-blue-500 hover:text-blue-800 transition-colors"
                                                title="Clear filter"
                                            >
                                                <X size={12} />
                                            </button>
                                        </motion.div>
                                    )}

                                    <div ref={filterRef} className="relative">
                                        <button
                                            onClick={() => setFilterOpen(prev => !prev)}
                                            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl border transition-all shadow-sm ${selectedDistrict
                                                    ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                                                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                                }`}
                                        >
                                            <Filter size={16} />
                                            Filter by District
                                            <ChevronDown size={14} className={`transition-transform duration-200 ${filterOpen ? "rotate-180" : ""}`} />
                                        </button>

                                        <AnimatePresence>
                                            {filterOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                                                    transition={{ duration: 0.15 }}
                                                    className="absolute right-0 top-full mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden"
                                                >
                                                    <button
                                                        onClick={() => { setSelectedDistrict(null); setFilterOpen(false); }}
                                                        className={`w-full text-left px-4 py-3 text-sm font-semibold transition-colors flex items-center justify-between ${!selectedDistrict
                                                                ? "bg-blue-50 text-blue-700"
                                                                : "text-slate-700 hover:bg-slate-50"
                                                            }`}
                                                    >
                                                        All Districts
                                                        {!selectedDistrict && <span className="w-2 h-2 rounded-full bg-blue-500"></span>}
                                                    </button>
                                                    <div className="border-t border-slate-100" />
                                                    {districts.length === 0 ? (
                                                        <p className="px-4 py-3 text-xs text-slate-400 font-medium">Loading districts...</p>
                                                    ) : (
                                                        districts.map(district => (
                                                            <button
                                                                key={district.id}
                                                                onClick={() => { setSelectedDistrict(district); setFilterOpen(false); }}
                                                                className={`w-full text-left px-4 py-3 text-sm font-semibold transition-colors flex items-center justify-between ${selectedDistrict?.id === district.id
                                                                        ? "bg-blue-50 text-blue-700"
                                                                        : "text-slate-700 hover:bg-slate-50"
                                                                    }`}
                                                            >
                                                                {district.name}
                                                                {selectedDistrict?.id === district.id && <span className="w-2 h-2 rounded-full bg-blue-500"></span>}
                                                            </button>
                                                        ))
                                                    )}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>

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
                                        {isLoading ? (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-12 text-center">
                                                    <div className="flex flex-col items-center justify-center text-slate-400">
                                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-500 mb-3"></div>
                                                        <p className="text-sm font-semibold">Loading talukas...</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : filteredTalukas.length > 0 ? (
                                            filteredTalukas.map((taluka) => (
                                                <tr
                                                    key={taluka.id}
                                                    className="hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
                                                >
                                                    <td className="px-6 py-4">
                                                        <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                                                            {talukas.findIndex(t => t.id === taluka.id) + 1}
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
                                                            <button onClick={() => handleViewClick(taluka.id)} className="p-1.5 text-slate-400 cursor-pointer hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors" title="View Details">
                                                                <Eye size={16} />
                                                            </button>
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
                                            maxLength={100}
                                            value={addFormData.name}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/[^a-zA-Z\s\-]/g, '');
                                                setAddFormData({ ...addFormData, name: val });
                                            }}
                                            className={`w-full border rounded-lg px-3 py-2 text-[15px] outline-none transition-all text-slate-700 ${addFormError && addFormError.includes('Taluka Name') ? 'border-red-400 focus:ring-1 focus:ring-red-400' : 'border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-400'}`}
                                            placeholder="e.g. Tiswadi"
                                        />
                                    </div>
                                    <div className="w-full">
                                        <label className="block text-[15px] font-normal text-slate-700 mb-2">Census Code</label>
                                        <input
                                            type="text"
                                            maxLength={5}
                                            value={addFormData.censusCode}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, '');
                                                setAddFormData({ ...addFormData, censusCode: val });
                                            }}
                                            className={`w-full border rounded-lg px-3 py-2 text-[15px] outline-none transition-all text-slate-700 ${addFormError && addFormError.includes('Census Code') ? 'border-red-400 focus:ring-1 focus:ring-red-400' : 'border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-400'}`}
                                            placeholder="Max 5 digits"
                                        />
                                    </div>
                                    <div className="w-full">
                                        <label className="block text-[15px] font-normal text-slate-700 mb-2">District</label>
                                        <select
                                            value={addFormData.districtID}
                                            onChange={(e) => setAddFormData({ ...addFormData, districtID: e.target.value })}
                                            className={`w-full border rounded-lg px-3 py-2 text-[15px] outline-none transition-all text-slate-700 bg-white ${addFormError && addFormError.includes('District') ? 'border-red-400 focus:ring-1 focus:ring-red-400' : 'border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-400'}`}
                                        >
                                            <option value="">Select District</option>
                                            {districts.map(d => (
                                                <option key={d.id} value={d.id}>{d.name}</option>
                                            ))}
                                        </select>
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
                                    <button 
                                        onClick={confirmAdd} 
                                        disabled={isSubmitting}
                                        className="px-5 py-2 text-[15px] font-medium text-white bg-[#0d6efd] hover:bg-blue-600 rounded-lg shadow-sm transition-colors disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Submitting...
                                            </>
                                        ) : "Submit"}
                                    </button>
                                    <button onClick={() => setAddModalOpen(false)} disabled={isSubmitting} className="px-5 py-2 text-[15px] font-medium text-white bg-[#6c757d] hover:bg-slate-600 rounded-lg text-center transition-colors disabled:opacity-50">
                                        Close
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

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
                                            maxLength={100}
                                            value={editFormData.name}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/[^a-zA-Z\s\-]/g, '');
                                                setEditFormData({ ...editFormData, name: val });
                                            }}
                                            className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all text-slate-700 font-medium ${editFormError && editFormError.includes('Taluka Name') ? 'border-red-400 focus:ring-2 focus:ring-red-400/20' : 'border-slate-300 focus:border-tech-blue-500 focus:ring-2 focus:ring-tech-blue-500/20'}`}
                                            placeholder="e.g. Tiswadi"
                                        />
                                    </div>
                                    <div className="w-full">
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Census Code</label>
                                        <input
                                            type="text"
                                            maxLength={5}
                                            value={editFormData.censusCode}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, '');
                                                setEditFormData({ ...editFormData, censusCode: val });
                                            }}
                                            className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all text-slate-700 font-medium ${editFormError && editFormError.includes('Census Code') ? 'border-red-400 focus:ring-2 focus:ring-red-400/20' : 'border-slate-300 focus:border-tech-blue-500 focus:ring-2 focus:ring-tech-blue-500/20'}`}
                                            placeholder="Max 5 digits"
                                        />
                                    </div>
                                    <div className="w-full">
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">District</label>
                                        <select
                                            value={editFormData.districtID}
                                            onChange={(e) => setEditFormData({ ...editFormData, districtID: e.target.value })}
                                            className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all text-slate-700 font-medium bg-white ${editFormError && editFormError.includes('District') ? 'border-red-400 focus:ring-2 focus:ring-red-400/20' : 'border-slate-300 focus:border-tech-blue-500 focus:ring-2 focus:ring-tech-blue-500/20'}`}
                                        >
                                            <option value="">Select District</option>
                                            {districts.map(d => (
                                                <option key={d.id} value={d.id}>{d.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <AnimatePresence>
                                        {editFormError && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="w-full text-sm font-medium text-red-500 bg-red-50 p-2.5 rounded-lg border border-red-100"
                                            >
                                                {editFormError}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
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
                                    
                                    <AnimatePresence>
                                        {saveError && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="w-full text-sm font-medium text-red-500 bg-red-50 p-2.5 rounded-lg border border-red-100 mb-4"
                                            >
                                                {saveError}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>

                                    <div className="flex gap-3 justify-center w-full">
                                        <button disabled={isSaving} onClick={() => setSaveConfirmOpen(false)} className="flex-1 px-4 py-3 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50">
                                            Cancel
                                        </button>
                                        <button disabled={isSaving} onClick={confirmSave} className="flex-1 px-4 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-colors active:scale-95 disabled:opacity-50 flex justify-center items-center gap-2">
                                            {isSaving ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Saving...
                                                </>
                                            ) : "Yes, Save"}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {deleteConfirmOpen && (
                        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]"
                                onClick={() => !isDeleting && setDeleteConfirmOpen(false)}
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
                                    
                                    <AnimatePresence>
                                        {deleteError && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="w-full text-sm font-medium text-red-500 bg-red-50 p-2.5 rounded-lg border border-red-100 mb-4"
                                            >
                                                {deleteError}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>

                                    <div className="flex gap-3 justify-center w-full">
                                        <button disabled={isDeleting} onClick={() => setDeleteConfirmOpen(false)} className="flex-1 px-4 py-3 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50">
                                            Keep It
                                        </button>
                                        <button disabled={isDeleting} onClick={confirmDelete} className="flex-1 px-4 py-3 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md shadow-red-500/20 transition-colors active:scale-95 disabled:opacity-50 flex justify-center items-center gap-2">
                                            {isDeleting ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Deleting...
                                                </>
                                            ) : "Yes, Delete"}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
                <AnimatePresence>
                    {viewModalOpen && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]"
                                onClick={() => setViewModalOpen(false)}
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                                className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative z-10"
                            >
                                <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                        <Eye size={18} className="text-emerald-600" />
                                        Taluka Details
                                    </h3>
                                    <button onClick={() => setViewModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-white hover:bg-slate-100 p-2 rounded-full transition-colors shadow-sm mb-1">
                                        <X size={16} className="stroke-2" />
                                    </button>
                                </div>
                                <div className="p-6">
                                    {isFetchingDetails ? (
                                        <div className="flex flex-col items-center justify-center py-10">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mb-4"></div>
                                            <p className="text-sm font-semibold text-slate-500">Loading taluka details...</p>
                                        </div>
                                    ) : viewError ? (
                                        <div className="text-center py-6">
                                            <div className="inline-flex py-3 px-4 bg-red-50 text-red-600 rounded-xl border border-red-100 items-center justify-center gap-2 text-sm font-medium mb-4 w-full">
                                                <span>{viewError}</span>
                                            </div>
                                        </div>
                                    ) : talukaDetails ? (
                                        <div className="space-y-4">
                                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-2 transition-all hover:shadow-sm">
                                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Taluka Name</p>
                                                <p className="text-base font-bold text-slate-800">
                                                    {talukaDetails.talukaName || talukaDetails.name || talukaDetails.taluka_name || talukaDetails.taluka || 'N/A'}
                                                </p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 transition-all hover:shadow-sm">
                                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Census Code</p>
                                                    <p className="text-[15px] font-semibold text-slate-700">{talukaDetails.censusCode || talukaDetails.census_code || 'N/A'}</p>
                                                </div>
                                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 transition-all hover:shadow-sm">
                                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status</p>
                                                    <p className="text-[15px] font-semibold text-slate-700">
                                                        {(talukaDetails.status === 1 || talukaDetails.status === "1") ? (
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-green-50 text-green-700 text-xs font-bold border border-green-200">Active</span>
                                                        ) : typeof talukaDetails.status !== 'undefined' ? (
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">Inactive</span>
                                                        ) : (
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-green-50 text-green-700 text-xs font-bold border border-green-200">Active</span>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 transition-all hover:shadow-sm">
                                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">District</p>
                                                <p className="text-[15px] font-semibold text-slate-800 flex items-center gap-2">
                                                    <MapPin size={14} className="text-blue-500" />
                                                    {talukaDetails.districtName || 
                                                     talukaDetails.district_name || 
                                                     talukaDetails.district?.name || 
                                                     districts.find(d => d.id == talukaDetails.district_id)?.name || 
                                                     'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                                    <button onClick={() => setViewModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-xl transition-colors w-full sm:w-auto">
                                        Close
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </>
        </ProtectedRoute>
    );
}
