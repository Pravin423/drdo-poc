import { useState, useEffect, useRef } from "react";
import ProtectedRoute from "../../../components/ProtectedRoute";
import DashboardLayout from "../../../components/DashboardLayout";
import LocationSummaryCards from "../../../components/LocationSummaryCards";
import { exportToExcel } from "../../../lib/exportToExcel";

// Taluka sub-components
import TalukaHeader from "../../../components/super-admin/location/taluka/TalukaHeader";
import TalukaTable from "../../../components/super-admin/location/taluka/TalukaTable";
import AddTalukaModal from "../../../components/super-admin/location/taluka/AddTalukaModal";
import ViewTalukaModal from "../../../components/super-admin/location/taluka/ViewTalukaModal";
import EditTalukaModal from "../../../components/super-admin/location/taluka/EditTalukaModal";
import { SaveConfirmModal, DeleteConfirmModal } from "../../../components/super-admin/location/taluka/ConfirmModals";

export default function TalukasManagement() {
    // ─── Data State ──────────────────────────────────────────────────────────────
    const [talukas, setTalukas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [districts, setDistricts] = useState([]);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [filterOpen, setFilterOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchDistricts = async () => {
        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch("/api/districts", {
                method: "GET",
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            });
            if (!response.ok) return;
            const result = await response.json();
            const dataArray = Array.isArray(result.data) ? result.data : Array.isArray(result) ? result : [];
            setDistricts(
                dataArray.map((d, i) => ({
                    id: (d.id || d._id || i + 1).toString(),
                    name: d.name || d.district || d.districtName || d.district_name || "",
                }))
            );
        } catch (err) {
            console.error("[Talukas] Error fetching districts for filter:", err);
        }
    };

    const fetchTalukas = async (districtId = null) => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("authToken");
            const url = districtId ? `/api/talukas?district_id=${districtId}` : "/api/talukas";
            const response = await fetch(url, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            });
            if (!response.ok) throw new Error(`Failed to fetch talukas (status: ${response.status})`);

            const result = await response.json();
            const dataArray = Array.isArray(result.data) ? result.data : Array.isArray(result) ? result : [];

            setTalukas(
                dataArray.map((t, index) => ({
                    id: (t.id || t._id || index + 1).toString(),
                    name: t.name || t.taluka || t.talukaName || t.taluka_name || "",
                    censusCode: (t.censusCode || t.census_code || t.census || "").toString(),
                    districtName: t.districtName || t.district_name || t.district || "",
                }))
            );
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

    // Re-fetch when district filter changes (skip first render)
    const isMounted = useRef(false);
    useEffect(() => {
        if (!isMounted.current) { isMounted.current = true; return; }
        fetchTalukas(selectedDistrict ? selectedDistrict.id : null);
    }, [selectedDistrict]);

    // Close filter dropdown on outside click
    useEffect(() => {
        if (!filterOpen) return;
        const handler = (e) => {
            // Handled inside TalukaTable via its own ref
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [filterOpen]);

    // ─── Add Modal State ─────────────────────────────────────────────────────────
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [addFormData, setAddFormData] = useState({ name: "", censusCode: "", districtID: "" });
    const [addFormError, setAddFormError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddClick = () => {
        setAddFormData({ name: "", censusCode: "", districtID: "" });
        setAddFormError("");
        setAddModalOpen(true);
    };

    const validateTalukaForm = (name, censusCode, districtID, setError) => {
        if (!name) { setError("Taluka Name is required."); return false; }
        if (name.length < 3) { setError("Taluka Name must be at least 3 characters."); return false; }
        if (name.length > 100) { setError("Taluka Name must be at most 100 characters."); return false; }
        if (!/^[a-zA-Z\s\-]+$/.test(name)) { setError("Taluka Name can only contain letters, spaces, and hyphens."); return false; }
        if (!censusCode) { setError("Census Code is required."); return false; }
        if (censusCode.length > 5) { setError("Census Code must be at most 5 digits."); return false; }
        if (!/^\d+$/.test(censusCode)) { setError("Census Code must be a valid number."); return false; }
        if (!districtID) { setError("District is required."); return false; }
        return true;
    };

    const confirmAdd = async () => {
        setAddFormError("");
        const name = addFormData.name?.trim() || "";
        const censusCode = addFormData.censusCode?.trim() || "";
        const districtID = addFormData.districtID;
        if (!validateTalukaForm(name, censusCode, districtID, setAddFormError)) return;

        setIsSubmitting(true);
        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch("/api/talukas", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify({
                    talukaName: name,
                    censusCode: parseInt(censusCode, 10),
                    districtID: parseInt(districtID, 10),
                }),
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

    // ─── View Modal State ─────────────────────────────────────────────────────────
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [talukaDetails, setTalukaDetails] = useState(null);
    const [isFetchingDetails, setIsFetchingDetails] = useState(false);
    const [viewError, setViewError] = useState("");

    const handleViewClick = async (id) => {
        setViewError("");
        setTalukaDetails(null);
        setIsFetchingDetails(true);
        setViewModalOpen(true);
        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch(`/api/taluka-details?id=${id}`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Failed to fetch details (status: ${response.status})`);
            }
            const data = await response.json();
            setTalukaDetails(data.data || data);
        } catch (error) {
            setViewError(error.message || "An error occurred");
        } finally {
            setIsFetchingDetails(false);
        }
    };

    // ─── Edit Modal State ─────────────────────────────────────────────────────────
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editFormData, setEditFormData] = useState({ id: "", name: "", censusCode: "", districtID: "" });
    const [editFormError, setEditFormError] = useState("");
    const [saveConfirmOpen, setSaveConfirmOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState("");

    const handleEditClick = (taluka) => {
        const matchedDistrict = districts.find(
            (d) => d.name === taluka.districtName || d.id == taluka.district_id
        );
        setEditFormData({
            id: taluka.id,
            name: taluka.name,
            censusCode: taluka.censusCode,
            districtID: matchedDistrict ? matchedDistrict.id : "",
        });
        setEditFormError("");
        setEditModalOpen(true);
    };

    const handleSaveClick = () => {
        setEditFormError("");
        const name = editFormData.name?.trim() || "";
        const censusCode = editFormData.censusCode?.toString().trim() || "";
        const districtID = editFormData.districtID;
        if (!validateTalukaForm(name, censusCode, districtID, setEditFormError)) return;
        setSaveError("");
        setSaveConfirmOpen(true);
    };

    const confirmSave = async () => {
        setIsSaving(true);
        setSaveError("");
        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch("/api/taluka-update", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify({
                    taluka_id: parseInt(editFormData.id, 10),
                    talukaName: editFormData.name,
                    censusCode: parseInt(editFormData.censusCode, 10),
                    districtID: parseInt(editFormData.districtID, 10),
                }),
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

    // ─── Delete Modal State ───────────────────────────────────────────────────────
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [talukaToDelete, setTalukaToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    const handleDeleteClick = (id) => {
        setTalukaToDelete(id);
        setDeleteError("");
        setDeleteConfirmOpen(true);
    };

    const confirmDelete = async () => {
        if (!talukaToDelete) return;
        if (!/^[a-zA-Z0-9_-]+$/.test(talukaToDelete.toString())) {
            setDeleteError("Invalid Taluka ID format.");
            return;
        }
        setIsDeleting(true);
        setDeleteError("");
        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch(`/api/taluka-delete?id=${talukaToDelete}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Failed to delete taluka (status: ${response.status})`);
            }
            await fetchTalukas(selectedDistrict ? selectedDistrict.id : null);
            setDeleteConfirmOpen(false);
            setTalukaToDelete(null);
        } catch (error) {
            setDeleteError(error.message || "An error occurred while deleting.");
        } finally {
            setIsDeleting(false);
        }
    };

    // ─── Disable background scroll when any modal is open ───────────────────────
    useEffect(() => {
        const anyOpen = addModalOpen || editModalOpen || saveConfirmOpen || deleteConfirmOpen || viewModalOpen;
        document.body.style.overflow = anyOpen ? "hidden" : "unset";
        return () => { document.body.style.overflow = "unset"; };
    }, [addModalOpen, editModalOpen, saveConfirmOpen, deleteConfirmOpen, viewModalOpen]);

    // ─── Filtered Data ────────────────────────────────────────────────────────────
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedDistrict]);

    const filteredTalukas = talukas.filter(
        (t) =>
            t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.censusCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.districtName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredTalukas.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredTalukas.length);
    const paginatedTalukas = filteredTalukas.slice(startIndex, startIndex + itemsPerPage);

    // ─── Export ───────────────────────────────────────────────────────────────────
    const handleExport = () => {
        exportToExcel({
            title: "Goa Talukas — Detailed Report",
            headers: ["ID", "Taluka Name", "Census Code", "District Name"],
            rows: filteredTalukas.map((t) => [t.id, t.name, t.censusCode, t.districtName]),
            filename: "goa_talukas_report",
        });
    };

    // ─── Render ───────────────────────────────────────────────────────────────────
    return (
        <ProtectedRoute allowedRole="super-admin">
            <>
                <DashboardLayout>
                    <div className="max-w-[1600px] mx-auto space-y-8 p-4">
                        {/* Page Header */}
                        <TalukaHeader onExport={handleExport} onAddClick={handleAddClick} />

                        {/* Summary Cards */}
                        <LocationSummaryCards totalDistricts={districts.length} totalTalukas={talukas.length} />

                        {/* Data Table */}
                        <TalukaTable
                            talukas={talukas}
                            filteredTalukas={paginatedTalukas}
                            isLoading={isLoading}
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                            districts={districts}
                            selectedDistrict={selectedDistrict}
                            onSelectDistrict={(d) => { setSelectedDistrict(d); setFilterOpen(false); }}
                            filterOpen={filterOpen}
                            onToggleFilter={() => setFilterOpen((prev) => !prev)}
                            onView={handleViewClick}
                            onEdit={handleEditClick}
                            onDelete={handleDeleteClick}
                            footerProps={{
                                totalRecords: filteredTalukas.length,
                                currentPage,
                                totalPages,
                                startIndex: startIndex + 1,
                                endIndex,
                                onPageChange: setCurrentPage
                            }}
                        />
                    </div>
                </DashboardLayout>

                {/* Modals */}
                <AddTalukaModal
                    isOpen={addModalOpen}
                    onClose={() => { setAddModalOpen(false); setAddFormError(""); }}
                    formData={addFormData}
                    onChange={setAddFormData}
                    onConfirm={confirmAdd}
                    formError={addFormError}
                    isSubmitting={isSubmitting}
                    districts={districts}
                />

                <ViewTalukaModal
                    isOpen={viewModalOpen}
                    onClose={() => setViewModalOpen(false)}
                    talukaDetails={talukaDetails}
                    isLoading={isFetchingDetails}
                    viewError={viewError}
                    districts={districts}
                />

                <EditTalukaModal
                    isOpen={editModalOpen}
                    onClose={() => setEditModalOpen(false)}
                    formData={editFormData}
                    onChange={setEditFormData}
                    onSave={handleSaveClick}
                    formError={editFormError}
                    districts={districts}
                />

                <SaveConfirmModal
                    isOpen={saveConfirmOpen}
                    onClose={() => setSaveConfirmOpen(false)}
                    onConfirm={confirmSave}
                    isSaving={isSaving}
                    saveError={saveError}
                />

                <DeleteConfirmModal
                    isOpen={deleteConfirmOpen}
                    onClose={() => setDeleteConfirmOpen(false)}
                    onConfirm={confirmDelete}
                    isDeleting={isDeleting}
                    deleteError={deleteError}
                />
            </>
        </ProtectedRoute>
    );
}
