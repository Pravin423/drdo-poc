import { MapPin, Search, Plus, Filter,Hash,CheckCircle2, Download, Edit2, Trash2, ChevronLeft, ChevronRight, TrendingUp, Users, Map, Eye, X, Save, Edit } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProtectedRoute from "../../../components/ProtectedRoute";
import DashboardLayout from "../../../components/DashboardLayout";
import LocationSummaryCards from "../../../components/LocationSummaryCards";
import { exportToExcel } from "../../../lib/exportToExcel";


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

    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [viewDistrictData, setViewDistrictData] = useState(null);
    const [isViewLoading, setIsViewLoading] = useState(false);

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editFormData, setEditFormData] = useState({ id: "", name: "", censusCode: "" });
    const [editFormError, setEditFormError] = useState("");

    const [saveConfirmOpen, setSaveConfirmOpen] = useState(false);

    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [districtToDelete, setDistrictToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    const handleAddClick = () => {
        setAddFormData({ name: "", censusCode: "" });
        setAddFormError("");
        setAddModalOpen(true);
    };

    const confirmAdd = async () => {
        setAddFormError("");

        const name = addFormData.name.trim();
        const censusCode = addFormData.censusCode.trim();

        if (!name) {
            setAddFormError("District Name is required.");
            return;
        }
        if (name.length < 3) {
            setAddFormError("District Name must be at least 3 characters.");
            return;
        }
        if (name.length > 100) {
            setAddFormError("District Name must not exceed 100 characters.");
            return;
        }
        if (!/^[a-zA-Z\s\-]+$/.test(name)) {
            setAddFormError("District Name can only contain letters, spaces, and hyphens.");
            return;
        }

        if (!censusCode) {
            setAddFormError("Census Code is required.");
            return;
        }
        if (censusCode.length >= 6) {
            setAddFormError("Census Code must be below 6 digits.");
            return;
        }
        if (!/^\d+$/.test(censusCode)) {
            setAddFormError("Census Code must be a valid number.");
            return;
        }

        try {
            const token = localStorage.getItem("authToken");

            const payload = {
                distName: name,
                censusCode: censusCode
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

            const result = await response.json();
            if (result.status === 1 || result.success) {
                await fetchDistricts();
                setAddModalOpen(false);
                setAddFormData({ name: "", censusCode: "" });
            } else {
                setAddFormError(result.message || "Failed to add district.");
            }
        } catch (error) {
            console.error("Error adding district:", error);
            setAddFormError("Failed to add district. Please try again.");
        }
    };

    const handleViewClick = async (district) => {
        setViewModalOpen(true);
        setIsViewLoading(true);
        setViewDistrictData(null);
        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch(`/api/district-details?id=${district.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const result = await response.json();

            // Expected nested structures depending on API variance
            if (result.status === 1 || result.data) {
                // Map the dynamic structure since sometimes its "census_code" vs "censusCode"
                const data = result.data || {};
                setViewDistrictData({
                    id: data.id || district.id,
                    name: data.name || data.districtName || district.name,
                    censusCode: data.census_code || data.censusCode || district.censusCode,
                });
            } else {
                setViewDistrictData({ error: 'Details not found' });
            }
        } catch (error) {
            console.error("Error fetching district details:", error);
            setViewDistrictData({ error: 'Failed to fetch details' });
        } finally {
            setIsViewLoading(false);
        }
    };

    const handleDeleteClick = (id) => {
        setDistrictToDelete(id);
        setDeleteError("");
        setDeleteConfirmOpen(true);
    };

    const confirmDelete = async () => {
        if (!districtToDelete) return;

        setIsDeleting(true);
        setDeleteError("");
        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch(`/api/district-delete?id=${districtToDelete}`, {
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();

            if (result.status === 1 || result.success || (response.ok && result.status !== 0)) {
                await fetchDistricts();
                setDeleteConfirmOpen(false);
                setDistrictToDelete(null);
            } else {
                setDeleteError(result.message || "Failed to delete district.");
            }
        } catch (error) {
            console.error("Error deleting district:", error);
            setDeleteError("Failed to delete district. Please try again.");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleEditClick = (district) => {
        setEditFormData({ id: district.id, name: district.name, censusCode: district.censusCode });
        setEditFormError("");
        setEditModalOpen(true);
    };

    const handleSaveClick = () => {
        setEditFormError("");

        const name = editFormData.name.trim();
        const censusCode = editFormData.censusCode.toString().trim();

        if (!name) {
            setEditFormError("District Name is required.");
            return;
        }
        if (name.length < 3) {
            setEditFormError("District Name must be at least 3 characters.");
            return;
        }
        if (name.length > 100) {
            setEditFormError("District Name must not exceed 100 characters.");
            return;
        }
        if (!/^[a-zA-Z\s\-]+$/.test(name)) {
            setEditFormError("District Name can only contain letters, spaces, and hyphens.");
            return;
        }

        if (!censusCode) {
            setEditFormError("Census Code is required.");
            return;
        }
        if (censusCode.length >= 6) {
            setEditFormError("Census Code must be below 6 digits.");
            return;
        }
        if (!/^\d+$/.test(censusCode)) {
            setEditFormError("Census Code must be a valid number.");
            return;
        }

        setSaveConfirmOpen(true);
    };

    const confirmSave = async () => {
        try {
            const token = localStorage.getItem("authToken");

            const payload = {
                district_id: parseInt(editFormData.id, 10),
                distName: editFormData.name.trim(),
                censusCode: editFormData.censusCode.toString().trim()
            };

            const response = await fetch("/api/district-update", {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error("Failed to update district");
            }

            const result = await response.json();
            if (result.status === 1 || result.success) {
                await fetchDistricts();
                setSaveConfirmOpen(false);
                setEditModalOpen(false);
            } else {
                setEditFormError(result.message || "Failed to edit from server");
                setSaveConfirmOpen(false); // Close the confirm but keep the edit modal open with the error flag
            }
        } catch (error) {
            console.error("Error updating district:", error);
            alert("Failed to update district. Please try again.");
            setSaveConfirmOpen(false);
        }
    };

    // Disable background scroll when a modal is open
    useEffect(() => {
        if (addModalOpen || editModalOpen || saveConfirmOpen || deleteConfirmOpen || viewModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        // Cleanup function for when component unmounts
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [addModalOpen, editModalOpen, saveConfirmOpen, deleteConfirmOpen, viewModalOpen]);

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
                        <LocationSummaryCards totalDistricts={districts.length} />

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
                                                <tr key={district.id}
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
                                                            <button onClick={() => handleViewClick(district)} className="p-1.5 text-slate-400 cursor-pointer hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors" title="View Details">
                                                                <Eye size={16} />
                                                            </button>
                                                            <button onClick={() => handleEditClick(district)} className="p-1.5 text-slate-400 cursor-pointer hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Edit District">
                                                                <Edit size={16} />
                                                            </button>
                                                            <button onClick={() => handleDeleteClick(district.id)} className="p-1.5 text-slate-400 cursor-pointer hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Delete District">
                                                                <X size={16} />
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

               <AnimatePresence>
  {addModalOpen && (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-md px-4 overflow-y-auto py-8">
      {/* Backdrop for closing */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setAddModalOpen(false)}
        className="absolute inset-0"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-[28px] shadow-2xl w-full max-w-lg overflow-hidden relative z-10"
      >
        {/* Modal Header with Gradient */}
        <div className="bg-gradient-to-r from-[#1a2e7a] to-[#2a44a1] p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <MapPin className="w-24 h-24 rotate-12" />
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black tracking-tight">Add District</h2>
              <p className="text-indigo-100/80 text-sm font-medium mt-1">Register a new district in the system</p>
            </div>
            <button
              onClick={() => { setAddModalOpen(false); setAddFormError(''); }}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all backdrop-blur-sm"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-8">
          {/* Error Message */}
          <AnimatePresence>
            {addFormError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 px-5 py-4 bg-rose-50 border border-rose-100 text-rose-600 text-sm font-semibold rounded-2xl flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                  <XCircle className="w-4 h-4" />
                </div>
                {addFormError}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form Fields */}
          <div className="space-y-6">
            {/* District Name */}
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-slate-500 uppercase tracking-wider ml-1">District Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                  <Map className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  maxLength={100}
                  placeholder="e.g. North Goa"
                  value={addFormData.name}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^a-zA-Z\s\-]/g, '');
                    setAddFormData({ ...addFormData, name: val });
                  }}
                  className={`w-full pl-12 pr-4 py-4 rounded-2xl border bg-slate-50/50 text-[15px] font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all ${
                    addFormError?.includes('District Name') ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-indigo-500 focus:bg-white'
                  }`}
                />
              </div>
            </div>

            {/* Census Code */}
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-slate-500 uppercase tracking-wider ml-1">Census Code</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                  <Hash className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  maxLength={5}
                  placeholder="Max 5 digits"
                  value={addFormData.censusCode}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setAddFormData({ ...addFormData, censusCode: val });
                  }}
                  className={`w-full pl-12 pr-4 py-4 rounded-2xl border bg-slate-50/50 text-[15px] font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all ${
                    addFormError?.includes('Census Code') ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-indigo-500 focus:bg-white'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Modal Footer with Actions */}
          <div className="flex items-center gap-4 mt-10">
            <button
              onClick={() => { setAddModalOpen(false); setAddFormError(''); }}
              className="flex-1 py-4 text-[15px] font-bold text-slate-600 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all active:scale-[0.98]"
            >
              Cancel
            </button>
            <button
              onClick={confirmAdd}
              className="flex-[1.5] py-4 text-[15px] font-bold text-white bg-gradient-to-r from-[#1a2e7a] to-[#2a44a1] rounded-2xl shadow-xl shadow-indigo-900/20 hover:shadow-2xl hover:shadow-indigo-900/30 hover:-translate-y-0.5 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Confirm & Save</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )}
</AnimatePresence>

                {/* View Details Modal */}
                <AnimatePresence>
                    {viewModalOpen && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
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
                                        <Eye className="text-emerald-500" size={18} /> District Details
                                    </h3>
                                    <button onClick={() => setViewModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-white hover:bg-slate-100 p-1.5 rounded-full border border-slate-200 transition-colors shadow-sm">
                                        <X size={16} className="stroke-2" />
                                    </button>
                                </div>

                                <div className="p-6">
                                    {isViewLoading ? (
                                        <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mb-3"></div>
                                            <p className="text-sm font-semibold">Loading details...</p>
                                        </div>
                                    ) : viewDistrictData?.error ? (
                                        <div className="text-center py-6">
                                            <p className="text-red-500 font-medium text-sm">{viewDistrictData.error}</p>
                                        </div>
                                    ) : viewDistrictData && (
                                        <div className="space-y-4">
                                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">District ID</p>
                                                <p className="text-base font-semibold text-slate-900">{viewDistrictData.id}</p>
                                            </div>
                                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">District Name</p>
                                                <p className="text-base font-semibold text-slate-900">{viewDistrictData.name}</p>
                                            </div>
                                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Census Code</p>
                                                <p className="text-base font-semibold text-slate-900">{viewDistrictData.censusCode}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                                    <button onClick={() => setViewModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-xl transition-colors">
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
                                            maxLength={100}
                                            value={editFormData.name}
                                            onChange={(e) => {
                                                // Allow only letters, spaces, and hyphens
                                                const val = e.target.value.replace(/[^a-zA-Z\s\-]/g, '');
                                                setEditFormData({ ...editFormData, name: val });
                                            }}
                                            className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all text-slate-700 font-medium ${editFormError && editFormError.includes('District Name') ? 'border-red-400 focus:ring-2 focus:ring-red-400/20' : 'border-slate-300 focus:border-tech-blue-500 focus:ring-2 focus:ring-tech-blue-500/20'}`}
                                            placeholder="e.g. North Goa"
                                        />
                                    </div>
                                    <div className="w-full">
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Census Code</label>
                                        <input
                                            type="text"
                                            maxLength={5}
                                            value={editFormData.censusCode}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, ''); // enforce numbers only
                                                setEditFormData({ ...editFormData, censusCode: val });
                                            }}
                                            className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all text-slate-700 font-medium ${editFormError && editFormError.includes('Census Code') ? 'border-red-400 focus:ring-2 focus:ring-red-400/20' : 'border-slate-300 focus:border-tech-blue-500 focus:ring-2 focus:ring-tech-blue-500/20'}`}
                                            placeholder="Max 5 digits"
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

                                    <AnimatePresence>
                                        {deleteError && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="w-full text-sm font-medium text-red-500 bg-red-50 p-3 rounded-xl border border-red-100 mb-6"
                                            >
                                                {deleteError}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>

                                    <div className="flex gap-3 justify-center w-full">
                                        <button onClick={() => setDeleteConfirmOpen(false)} disabled={isDeleting} className="flex-1 px-4 py-3 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50">
                                            Keep It
                                        </button>
                                        <button onClick={confirmDelete} disabled={isDeleting} className="flex-1 px-4 py-3 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md shadow-red-500/20 transition-colors active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
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
            </>
        </ProtectedRoute>
    );
}
