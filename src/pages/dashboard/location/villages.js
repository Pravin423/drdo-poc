import {
    MapPin,
    Search,
    Plus,
    Filter,
    Download,
    Upload,
    Edit2,
    Trash2,
    ChevronLeft,
    ChevronRight,
    TrendingUp,
    Users,
    Map,
    X,
    Save,
    Home,
    FileText,
    CheckCircle2,
    AlertCircle,
    FileUp,
    ChevronDown,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProtectedRoute from "../../../components/ProtectedRoute";
import DashboardLayout from "../../../components/DashboardLayout";
import { exportToExcel } from "../../../lib/exportToExcel";

// Mock Data for Goa Villages (based on provided screenshot data)
const VILLAGES_DATA = [
    { id: "1", name: "Agonda", talukaName: "Canacona", districtName: "South Goa", censusCode: "627023" },
    { id: "2", name: "Anjadip", talukaName: "Canacona", districtName: "South Goa", censusCode: "627029" },
    { id: "3", name: "Canacona", talukaName: "Canacona", districtName: "South Goa", censusCode: "627024" },
    { id: "4", name: "Cola", talukaName: "Canacona", districtName: "South Goa", censusCode: "627022" },
    { id: "5", name: "Cotigao", talukaName: "Canacona", districtName: "South Goa", censusCode: "627028" },
    { id: "6", name: "Gaodongrem", talukaName: "Canacona", districtName: "South Goa", censusCode: "627025" },
    { id: "7", name: "Loliem", talukaName: "Canacona", districtName: "South Goa", censusCode: "627027" },
    { id: "8", name: "Poinguinim", talukaName: "Canacona", districtName: "South Goa", censusCode: "627026" },
    { id: "9", name: "Arossim", talukaName: "Mormugao", districtName: "South Goa", censusCode: "626884" },
    { id: "10", name: "Cansaulim", talukaName: "Mormugao", districtName: "South Goa", censusCode: "626883" },
    { id: "11", name: "Bambolim", talukaName: "Tiswadi", districtName: "North Goa", censusCode: "626816" },
    { id: "12", name: "Betim", talukaName: "Bardez", districtName: "North Goa", censusCode: "626733" },
    { id: "13", name: "Calangute", talukaName: "Bardez", districtName: "North Goa", censusCode: "626741" },
    { id: "14", name: "Candolim", talukaName: "Bardez", districtName: "North Goa", censusCode: "626740" },
    { id: "15", name: "Anjuna", talukaName: "Bardez", districtName: "North Goa", censusCode: "626739" },
    { id: "16", name: "Arpora", talukaName: "Bardez", districtName: "North Goa", censusCode: "626738" },
    { id: "17", name: "Mapusa", talukaName: "Bardez", districtName: "North Goa", censusCode: "626731" },
    { id: "18", name: "Siolim", talukaName: "Bardez", districtName: "North Goa", censusCode: "626735" },
    { id: "19", name: "Aldona", talukaName: "Bardez", districtName: "North Goa", censusCode: "626732" },
    { id: "20", name: "Assagao", talukaName: "Bardez", districtName: "North Goa", censusCode: "626736" },
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
        label: "Total Villages",
        value: "334",
        delta: "100% Mapped",
        isPositive: true,
        icon: Home,
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

export default function VillagesManagement() {
    const ROWS_PER_PAGE = 10;
    const [villages, setVillages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");

    // Modal States
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [addFormData, setAddFormData] = useState({ name: "", talukaName: "", districtName: "", censusCode: "" });
    const [addFormError, setAddFormError] = useState("");

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editFormData, setEditFormData] = useState({ id: "", name: "", talukaName: "", districtName: "", censusCode: "" });
    const [editFormError, setEditFormError] = useState("");

    const [saveConfirmOpen, setSaveConfirmOpen] = useState(false);

    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [villageToDelete, setVillageToDelete] = useState(null);

    // Import Modal States
    const [importModalOpen, setImportModalOpen] = useState(false);
    const [importFile, setImportFile] = useState(null);
    const [importDragOver, setImportDragOver] = useState(false);
    const [importResult, setImportResult] = useState(null); // { added, skipped, errors }
    const [importLoading, setImportLoading] = useState(false);

    // Filters State
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedTaluka, setSelectedTaluka] = useState(null);
    const [filterOpen, setFilterOpen] = useState(false);
    const filterRef = useRef(null);

    // Hardcoded List from API payload
    const districts = [
        { "id": 1, "name": "North Goa" },
        { "id": 2, "name": "South Goa" }
    ];

    const talukasOptions = [
        { "id": 1, "name": "Canacona" },
        { "id": 2, "name": "Mormugao" },
        { "id": 3, "name": "Quepem" },
        { "id": 4, "name": "Salcete" },
        { "id": 5, "name": "Sanguem" },
        { "id": 6, "name": "Bardez" },
        { "id": 7, "name": "Bicholim" },
        { "id": 8, "name": "Pernem" },
        { "id": 9, "name": "Ponda" },
        { "id": 10, "name": "Satari" },
        { "id": 11, "name": "Tiswadi" }
    ];

    const fetchVillages = async (distId = null, talId = null) => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("authToken");
            let endpoint = "/api/villages";
            const params = new URLSearchParams();
            if (distId) params.append("district_id", distId);
            if (talId) params.append("taluka_id", talId);
            
            if (distId || talId) {
                endpoint += `?${params.toString()}`;
            }

            const response = await fetch(endpoint, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch villages (status: ${response.status})`);
            }

            const result = await response.json();

            const dataArray = Array.isArray(result.data) 
                ? result.data 
                : Array.isArray(result) 
                    ? result 
                    : [];

            const fetchedVillages = dataArray.map((v, index) => ({
                id: (v.id || v._id || index + 1).toString(),
                name: v.villageName || v.village_name || v.name || "",
                talukaName: v.talukaName || v.taluka_name || v.taluka || "",
                districtName: v.districtName || v.district_name || v.district || "",
                censusCode: (v.censusCode || v.census_code || v.census || "").toString(),
            }));

            setVillages(fetchedVillages);
        } catch (error) {
            console.error("[Villages] Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchVillages();
    }, []);

    const isMounted = useRef(false);
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            return;
        }
        fetchVillages(selectedDistrict ? selectedDistrict.id : null, selectedTaluka ? selectedTaluka.id : null);
    }, [selectedDistrict, selectedTaluka]);

    useEffect(() => {
        const handler = (e) => {
            if (filterRef.current && !filterRef.current.contains(e.target)) {
                setFilterOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleAddClick = () => {
        setAddFormData({ name: "", talukaName: "", districtName: "", censusCode: "" });
        setAddFormError("");
        setAddModalOpen(true);
    };

    const confirmAdd = () => {
        setAddFormError("");
        const name = addFormData.name.trim();
        const talukaName = addFormData.talukaName;
        const districtName = addFormData.districtName;
        const censusCode = addFormData.censusCode.trim();

        if (!name) { setAddFormError("Village Name is required."); return; }
        if (name.length < 3) { setAddFormError("Village Name must be at least 3 characters."); return; }
        if (!/^[a-zA-Z\s\-]+$/.test(name)) { setAddFormError("Village Name can only contain letters, spaces, and hyphens."); return; }

        if (!talukaName) { setAddFormError("Taluka Name is required."); return; }
        if (!districtName) { setAddFormError("District Name is required."); return; }

        if (!censusCode) { setAddFormError("Census Code is required."); return; }
        if (censusCode.length >= 7) { setAddFormError("Census Code must be below 7 digits."); return; }
        if (!/^\d+$/.test(censusCode)) { setAddFormError("Census Code must be a valid number."); return; }

        const newVillage = {
            id: (villages.length + 1).toString(),
            name,
            talukaName,
            districtName,
            censusCode,
        };
        setVillages([...villages, newVillage]);
        setAddModalOpen(false);
    };

    const handleDeleteClick = (id) => {
        setVillageToDelete(id);
        setDeleteConfirmOpen(true);
    };

    const confirmDelete = () => {
        if (villageToDelete) {
            setVillages(villages.filter(v => v.id !== villageToDelete));
            setDeleteConfirmOpen(false);
            setVillageToDelete(null);
        }
    };

    const handleEditClick = (village) => {
        setEditFormData({ id: village.id, name: village.name, talukaName: village.talukaName, districtName: village.districtName, censusCode: village.censusCode });
        setEditFormError("");
        setEditModalOpen(true);
    };

    const handleSaveClick = () => {
        setEditFormError("");
        const name = editFormData.name.trim();
        const talukaName = editFormData.talukaName;
        const districtName = editFormData.districtName;
        const censusCode = editFormData.censusCode.toString().trim();

        if (!name) { setEditFormError("Village Name is required."); return; }
        if (name.length < 3) { setEditFormError("Village Name must be at least 3 characters."); return; }
        if (!/^[a-zA-Z\s\-]+$/.test(name)) { setEditFormError("Village Name can only contain letters, spaces, and hyphens."); return; }

        if (!talukaName) { setEditFormError("Taluka Name is required."); return; }
        if (!districtName) { setEditFormError("District Name is required."); return; }

        if (!censusCode) { setEditFormError("Census Code is required."); return; }
        if (censusCode.length >= 7) { setEditFormError("Census Code must be below 7 digits."); return; }
        if (!/^\d+$/.test(censusCode)) { setEditFormError("Census Code must be a valid number."); return; }

        setSaveConfirmOpen(true);
    };

    const confirmSave = () => {
        setVillages(villages.map(v =>
            v.id === editFormData.id
                ? { ...v, name: editFormData.name, talukaName: editFormData.talukaName, districtName: editFormData.districtName, censusCode: editFormData.censusCode }
                : v
        ));
        setSaveConfirmOpen(false);
        setEditModalOpen(false);
    };

    // Disable background scroll when a modal is open
    useEffect(() => {
        if (addModalOpen || editModalOpen || saveConfirmOpen || deleteConfirmOpen || importModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [addModalOpen, editModalOpen, saveConfirmOpen, deleteConfirmOpen, importModalOpen]);

    // ── Import helpers ──────────────────────────────────────────
    const handleImportClick = () => {
        setImportFile(null);
        setImportResult(null);
        setImportModalOpen(true);
    };

    const handleTemplateDownload = () => {
        const header = "Village Name,Taluka Name,District Name,Census Code";
        const example = "Calangute,Bardez,North Goa,626741";
        const blob = new Blob([header + "\n" + example], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "villages_import_template.csv";
        a.click();
        URL.revokeObjectURL(url);
    };

    const parseAndImport = () => {
        if (!importFile) return;
        setImportLoading(true);
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target.result;
            const lines = text.split(/\r?\n/).filter(l => l.trim());
            if (lines.length < 2) {
                setImportResult({ added: 0, skipped: 0, errors: ["File is empty or has no data rows."] });
                setImportLoading(false);
                return;
            }
            const dataLines = lines.slice(1); // skip header
            let added = 0;
            let skipped = 0;
            const errors = [];
            const newVillages = [];
            let nextId = villages.length + 1;

            dataLines.forEach((line, idx) => {
                const cols = line.split(",").map(c => c.trim());
                if (cols.length < 4) {
                    errors.push(`Row ${idx + 2}: insufficient columns.`);
                    skipped++;
                    return;
                }
                const [name, talukaName, districtName, censusCode] = cols;
                if (!name || !talukaName || !districtName || !censusCode) {
                    errors.push(`Row ${idx + 2}: missing required fields.`);
                    skipped++;
                    return;
                }
                // Duplicate check by census code
                const isDuplicate = villages.some(v => v.censusCode === censusCode) ||
                    newVillages.some(v => v.censusCode === censusCode);
                if (isDuplicate) {
                    errors.push(`Row ${idx + 2}: census code "${censusCode}" already exists — skipped.`);
                    skipped++;
                    return;
                }
                newVillages.push({ id: (nextId++).toString(), name, talukaName, districtName, censusCode });
                added++;
            });

            if (newVillages.length > 0) {
                setVillages(prev => [...prev, ...newVillages]);
            }
            setImportResult({ added, skipped, errors });
            setImportLoading(false);
        };
        reader.readAsText(importFile);
    };

    const filteredVillages = villages.filter((village) =>
        village.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        village.talukaName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        village.districtName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        village.censusCode.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredVillages.length / ROWS_PER_PAGE);
    const paginatedVillages = filteredVillages.slice(
        (currentPage - 1) * ROWS_PER_PAGE,
        currentPage * ROWS_PER_PAGE
    );

    // Reset to page 1 whenever search changes
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handleExport = () => {
        exportToExcel({
            title: "Goa Villages — Detailed Report",
            headers: ["ID", "Village Name", "Taluka Name", "District Name", "Census Code"],
            rows: filteredVillages.map(v => [v.id, v.name, v.talukaName, v.districtName, v.censusCode]),
            filename: "goa_villages_report",
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
                                    Village <span className="bg-gradient-to-b from-[#3b52ab] to-[#1a2e7a] bg-clip-text text-transparent">
                                        Management</span>
                                </h1>
                                <p className="text-slate-500 font-medium">
                                    Manage and monitor villages across all Goa talukas.
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <button onClick={handleImportClick} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all shadow-sm">
                                    <Upload size={16} /> Import
                                </button>
                                <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all shadow-sm">
                                    <Download size={16} /> Export
                                </button>
                                <button onClick={handleAddClick} className="flex items-center gap-2 px-4 py-2 bg-tech-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-tech-blue-700 transition-all shadow-md shadow-tech-blue-500/20 active:scale-95">
                                    <Plus size={16} /> Add Village
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
                                        placeholder="Search villages by name, taluka, district, or code..."
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-tech-blue-500/20 focus:border-tech-blue-500 transition-all font-medium"
                                    />
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

                            {/* Table */}
                            <div className="flex-1 overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/80 border-b border-slate-100">
                                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-transparent">ID</th>
                                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-transparent">Village Name</th>
                                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-transparent">Taluka Name</th>
                                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-transparent">District Name</th>
                                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-transparent">Census Code</th>
                                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 text-right bg-transparent">Actions</th>
                                        </tr>
                                    </thead>
                                     <tbody className="divide-y divide-slate-100">
                                        {isLoading ? (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-12 text-center">
                                                    <div className="flex flex-col items-center justify-center text-slate-400">
                                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-500 mb-3"></div>
                                                        <p className="text-sm font-semibold">Loading villages...</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : paginatedVillages.length > 0 ? (
                                            paginatedVillages.map((village) => (
                                                <tr
                                                    key={village.id}
                                                    className="hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
                                                >
                                                    <td className="px-6 py-4">
                                                        <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                                                            {villages.findIndex(v => v.id === village.id) + 1}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <p className="text-sm font-semibold text-slate-800">{village.name}</p>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm text-slate-600">{village.talukaName}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm text-slate-600">{village.districtName}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm font-mono text-slate-600">{village.censusCode}</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button onClick={() => handleEditClick(village)} className="p-1.5 text-slate-400 cursor-pointer hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Edit Village">
                                                                <Edit2 size={16} />
                                                            </button>
                                                            <button onClick={() => handleDeleteClick(village.id)} className="p-1.5 text-slate-400 cursor-pointer hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Delete Village">
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-12 text-center">
                                                    <div className="flex flex-col items-center justify-center text-slate-400">
                                                        <Home size={32} className="mb-3 opacity-50" />
                                                        <p className="text-sm font-semibold">No villages found matching your search.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Table Footer / Pagination */}
                            <div className="px-6 py-4 bg-slate-50 mt-auto border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
                                <p className="text-xs font-semibold text-slate-500">
                                    Showing{" "}
                                    <span className="text-slate-900">{Math.min((currentPage - 1) * ROWS_PER_PAGE + 1, filteredVillages.length)}</span>
                                    {" "}–{" "}
                                    <span className="text-slate-900">{Math.min(currentPage * ROWS_PER_PAGE, filteredVillages.length)}</span>
                                    {" "}of{" "}
                                    <span className="text-slate-900">{filteredVillages.length}</span> records
                                </p>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="p-1.5 text-slate-500 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:text-slate-300 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                                        .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                                        .reduce((acc, p, idx, arr) => {
                                            if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...');
                                            acc.push(p);
                                            return acc;
                                        }, [])
                                        .map((item, idx) =>
                                            item === '...' ? (
                                                <span key={`ellipsis-${idx}`} className="px-2 text-xs text-slate-400 font-bold">…</span>
                                            ) : (
                                                <button
                                                    key={item}
                                                    onClick={() => setCurrentPage(item)}
                                                    className={`min-w-[32px] h-8 px-2 text-xs font-bold rounded-lg border transition-colors ${currentPage === item
                                                        ? 'bg-tech-blue-600 text-white border-tech-blue-600 shadow-sm'
                                                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                                                        }`}
                                                >
                                                    {item}
                                                </button>
                                            )
                                        )
                                    }
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages || totalPages === 0}
                                        className="p-1.5 text-slate-500 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:text-slate-300 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                    </div>
                </DashboardLayout>

                {/* ─────────── ADD MODAL ─────────── */}
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
                                    <h3 className="text-xl font-medium text-slate-800">Add Village</h3>
                                    <button onClick={() => setAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                        <X size={20} className="stroke-2" />
                                    </button>
                                </div>
                                <div className="p-6 space-y-5 flex flex-col items-center w-full">
                                    <div className="w-full">
                                        <label className="block text-[15px] font-normal text-slate-700 mb-2">Village Name</label>
                                        <input
                                            type="text"
                                            value={addFormData.name}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/[^a-zA-Z\s\-]/g, '');
                                                setAddFormData({ ...addFormData, name: val });
                                            }}
                                            className={`w-full border rounded-lg px-3 py-2 text-[15px] outline-none transition-all text-slate-700 ${addFormError && addFormError.includes('Village Name') ? 'border-red-400 focus:ring-1 focus:ring-red-400' : 'border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-400'}`}
                                            placeholder="e.g. Calangute"
                                        />
                                    </div>
                                    <div className="w-full">
                                        <label className="block text-[15px] font-normal text-slate-700 mb-2">Taluka Name</label>
                                        <select
                                            value={addFormData.talukaName}
                                            onChange={(e) => setAddFormData({ ...addFormData, talukaName: e.target.value })}
                                            className={`w-full border rounded-lg px-3 py-2 text-[15px] outline-none transition-all text-slate-700 bg-white ${addFormError && addFormError.includes('Taluka Name') ? 'border-red-400 focus:ring-1 focus:ring-red-400' : 'border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-400'}`}
                                        >
                                            <option value="">Select Taluka</option>
                                            <optgroup label="North Goa">
                                                <option>Bardez</option>
                                                <option>Bicholim</option>
                                                <option>Pernem</option>
                                                <option>Ponda</option>
                                                <option>Satari</option>
                                                <option>Tiswadi</option>
                                            </optgroup>
                                            <optgroup label="South Goa">
                                                <option>Canacona</option>
                                                <option>Dharbandora</option>
                                                <option>Mormugao</option>
                                                <option>Quepem</option>
                                                <option>Salcete</option>
                                                <option>Sanguem</option>
                                            </optgroup>
                                        </select>
                                    </div>
                                    <div className="w-full">
                                        <label className="block text-[15px] font-normal text-slate-700 mb-2">District Name</label>
                                        <select
                                            value={addFormData.districtName}
                                            onChange={(e) => setAddFormData({ ...addFormData, districtName: e.target.value })}
                                            className={`w-full border rounded-lg px-3 py-2 text-[15px] outline-none transition-all text-slate-700 bg-white ${addFormError && addFormError.includes('District Name') ? 'border-red-400 focus:ring-1 focus:ring-red-400' : 'border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-400'}`}
                                        >
                                            <option value="">Select District</option>
                                            <option value="North Goa">North Goa</option>
                                            <option value="South Goa">South Goa</option>
                                        </select>
                                    </div>
                                    <div className="w-full">
                                        <label className="block text-[15px] font-normal text-slate-700 mb-2">Census Code</label>
                                        <input
                                            type="text"
                                            maxLength={6}
                                            value={addFormData.censusCode}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, '');
                                                setAddFormData({ ...addFormData, censusCode: val });
                                            }}
                                            className={`w-full border rounded-lg px-3 py-2 text-[15px] outline-none transition-all text-slate-700 ${addFormError && addFormError.includes('Census Code') ? 'border-red-400 focus:ring-1 focus:ring-red-400' : 'border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-400'}`}
                                            placeholder="e.g. 627023"
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

                {/* ─────────── EDIT MODAL ─────────── */}
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
                                    <h3 className="text-lg font-bold text-slate-800">Edit Village</h3>
                                    <button onClick={() => setEditModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors">
                                        <X size={16} className="stroke-2" />
                                    </button>
                                </div>
                                <div className="p-6 space-y-5 flex flex-col items-center w-full">
                                    <div className="w-full">
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Village Name</label>
                                        <input
                                            type="text"
                                            maxLength={100}
                                            value={editFormData.name}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/[^a-zA-Z\s\-]/g, '');
                                                setEditFormData({ ...editFormData, name: val });
                                            }}
                                            className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all text-slate-700 font-medium ${editFormError && editFormError.includes('Village Name') ? 'border-red-400 focus:ring-2 focus:ring-red-400/20' : 'border-slate-300 focus:border-tech-blue-500 focus:ring-2 focus:ring-tech-blue-500/20'}`}
                                            placeholder="e.g. Calangute"
                                        />
                                    </div>
                                    <div className="w-full">
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Taluka Name</label>
                                        <select
                                            value={editFormData.talukaName}
                                            onChange={(e) => setEditFormData({ ...editFormData, talukaName: e.target.value })}
                                            className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all text-slate-700 font-medium bg-white ${editFormError && editFormError.includes('Taluka Name') ? 'border-red-400 focus:ring-2 focus:ring-red-400/20' : 'border-slate-300 focus:border-tech-blue-500 focus:ring-2 focus:ring-tech-blue-500/20'}`}
                                        >
                                            <optgroup label="North Goa">
                                                <option>Bardez</option>
                                                <option>Bicholim</option>
                                                <option>Pernem</option>
                                                <option>Ponda</option>
                                                <option>Satari</option>
                                                <option>Tiswadi</option>
                                            </optgroup>
                                            <optgroup label="South Goa">
                                                <option>Canacona</option>
                                                <option>Dharbandora</option>
                                                <option>Mormugao</option>
                                                <option>Quepem</option>
                                                <option>Salcete</option>
                                                <option>Sanguem</option>
                                            </optgroup>
                                        </select>
                                    </div>
                                    <div className="w-full">
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">District Name</label>
                                        <select
                                            value={editFormData.districtName}
                                            onChange={(e) => setEditFormData({ ...editFormData, districtName: e.target.value })}
                                            className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all text-slate-700 font-medium bg-white ${editFormError && editFormError.includes('District Name') ? 'border-red-400 focus:ring-2 focus:ring-red-400/20' : 'border-slate-300 focus:border-tech-blue-500 focus:ring-2 focus:ring-tech-blue-500/20'}`}
                                        >
                                            <option value="North Goa">North Goa</option>
                                            <option value="South Goa">South Goa</option>
                                        </select>
                                    </div>
                                    <div className="w-full">
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Census Code</label>
                                        <input
                                            type="text"
                                            maxLength={6}
                                            value={editFormData.censusCode}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, '');
                                                setEditFormData({ ...editFormData, censusCode: val });
                                            }}
                                            className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all text-slate-700 font-medium ${editFormError && editFormError.includes('Census Code') ? 'border-red-400 focus:ring-2 focus:ring-red-400/20' : 'border-slate-300 focus:border-tech-blue-500 focus:ring-2 focus:ring-tech-blue-500/20'}`}
                                            placeholder="Max 6 digits"
                                        />
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

                {/* ─────────── SAVE CONFIRMATION MODAL ─────────── */}
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
                                    <p className="text-sm font-medium text-slate-500 mb-8 px-2">Are you sure you want to save these changes to the village record?</p>
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

                {/* ─────────── DELETE CONFIRMATION MODAL ─────────── */}
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
                                    <h3 className="text-xl font-extrabold text-slate-800 mb-2">Delete Village?</h3>
                                    <p className="text-sm font-medium text-slate-500 mb-8">This action cannot be undone. Are you sure you want to permanently delete this village record?</p>
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
                {/* ─────────── IMPORT MODAL ─────────── */}
                <AnimatePresence>
                    {importModalOpen && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
                                onClick={() => { if (!importLoading) { setImportModalOpen(false); } }}
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                                className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden relative z-10"
                            >
                                {/* Modal Header */}
                                <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-tech-blue-50 flex items-center justify-center">
                                            <FileUp size={18} className="text-tech-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-800">Import Villages</h3>
                                            <p className="text-xs text-slate-500">Upload a CSV file to bulk-add villages</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setImportModalOpen(false)}
                                        disabled={importLoading}
                                        className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors disabled:opacity-40"
                                    >
                                        <X size={16} className="stroke-2" />
                                    </button>
                                </div>

                                <div className="p-6 space-y-5">
                                    {/* Template Download */}
                                    <div className="flex items-center justify-between p-3.5 bg-blue-50 border border-blue-100 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <FileText size={18} className="text-blue-600 shrink-0" />
                                            <div>
                                                <p className="text-sm font-semibold text-slate-800">Download Template</p>
                                                <p className="text-xs text-slate-500">CSV with required column headers</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleTemplateDownload}
                                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-700 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors shadow-sm"
                                        >
                                            <Download size={13} /> Template
                                        </button>
                                    </div>

                                    {/* File Drop Zone */}
                                    <div
                                        onDragOver={(e) => { e.preventDefault(); setImportDragOver(true); }}
                                        onDragLeave={() => setImportDragOver(false)}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            setImportDragOver(false);
                                            setImportResult(null);
                                            const file = e.dataTransfer.files[0];
                                            if (file && file.name.endsWith(".csv")) setImportFile(file);
                                        }}
                                        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${importDragOver
                                                ? "border-tech-blue-400 bg-tech-blue-50"
                                                : importFile
                                                    ? "border-emerald-400 bg-emerald-50"
                                                    : "border-slate-200 bg-slate-50 hover:border-tech-blue-300 hover:bg-tech-blue-50/30"
                                            }`}
                                        onClick={() => document.getElementById("village-csv-input").click()}
                                    >
                                        <input
                                            id="village-csv-input"
                                            type="file"
                                            accept=".csv"
                                            className="hidden"
                                            onChange={(e) => {
                                                setImportResult(null);
                                                setImportFile(e.target.files[0] || null);
                                                e.target.value = "";
                                            }}
                                        />
                                        {importFile ? (
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                                                    <CheckCircle2 size={24} className="text-emerald-600" />
                                                </div>
                                                <p className="text-sm font-bold text-slate-800">{importFile.name}</p>
                                                <p className="text-xs text-slate-500">{(importFile.size / 1024).toFixed(1)} KB · Click to change file</p>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                                                    <Upload size={22} className="text-slate-400" />
                                                </div>
                                                <p className="text-sm font-semibold text-slate-700">Drag & drop your CSV here</p>
                                                <p className="text-xs text-slate-400">or click to browse · .csv files only</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* CSV Format Hint */}
                                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                                        <p className="text-xs font-bold text-slate-600 mb-1">Expected CSV columns:</p>
                                        <code className="text-xs text-slate-500">Village Name, Taluka Name, District Name, Census Code</code>
                                    </div>

                                    {/* Import Result */}
                                    <AnimatePresence>
                                        {importResult && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0 }}
                                                className="space-y-3"
                                            >
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                                                        <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                                                        <div>
                                                            <p className="text-lg font-extrabold text-emerald-700">{importResult.added}</p>
                                                            <p className="text-xs font-semibold text-emerald-600">Rows Added</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                                                        <AlertCircle size={18} className="text-amber-600 shrink-0" />
                                                        <div>
                                                            <p className="text-lg font-extrabold text-amber-700">{importResult.skipped}</p>
                                                            <p className="text-xs font-semibold text-amber-600">Rows Skipped</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                {importResult.errors.length > 0 && (
                                                    <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 max-h-32 overflow-y-auto">
                                                        <p className="text-xs font-bold text-rose-700 mb-1.5">Issues:</p>
                                                        {importResult.errors.map((err, i) => (
                                                            <p key={i} className="text-xs text-rose-600 flex items-start gap-1.5">
                                                                <AlertCircle size={11} className="mt-0.5 shrink-0" />{err}
                                                            </p>
                                                        ))}
                                                    </div>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Modal Footer */}
                                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                                    <button
                                        onClick={() => setImportModalOpen(false)}
                                        className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-xl transition-colors"
                                    >
                                        {importResult ? "Close" : "Cancel"}
                                    </button>
                                    {!importResult && (
                                        <button
                                            onClick={parseAndImport}
                                            disabled={!importFile || importLoading}
                                            className="px-5 py-2.5 text-sm font-bold text-white bg-tech-blue-600 hover:bg-tech-blue-700 rounded-xl shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            {importLoading ? (
                                                <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}><Upload size={15} /></motion.div> Processing...</>
                                            ) : (
                                                <><Upload size={15} /> Import Villages</>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </>
        </ProtectedRoute>
    );
}
