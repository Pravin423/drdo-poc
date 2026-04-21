import { useState, useEffect } from "react";
import ProtectedRoute from "../../../components/ProtectedRoute";
import DashboardLayout from "../../../components/DashboardLayout";
import LocationSummaryCards from "../../../components/LocationSummaryCards";
import { exportToExcel } from "../../../lib/exportToExcel";

// District sub-components
import DistrictHeader from "../../../components/super-admin/location/district/DistrictHeader";
import DistrictTable from "../../../components/super-admin/location/district/DistrictTable";
import AddDistrictModal from "../../../components/super-admin/location/district/AddDistrictModal";
import ViewDistrictModal from "../../../components/super-admin/location/district/ViewDistrictModal";
import EditDistrictModal from "../../../components/super-admin/location/district/EditDistrictModal";
import { SaveConfirmModal, DeleteConfirmModal } from "../../../components/super-admin/location/district/ConfirmModals";

export default function DistrictsManagement() {
    // ─── Data State ──────────────────────────────────────────────────────────────
    const [districts, setDistricts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchDistricts = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch("/api/districts", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) throw new Error("Failed to fetch districts");

            const result = await response.json();
            const dataArray = Array.isArray(result.data)
                ? result.data
                : Array.isArray(result)
                ? result
                : [];

            setDistricts(
                dataArray.map((d, index) => ({
                    id: (d.id || d._id || index + 1).toString(),
                    name: d.name || d.district || d.districtName || d.district_name || "",
                    censusCode: (d.censusCode || d.census_code || d.census || "").toString(),
                }))
            );
        } catch (error) {
            console.error("Error fetching districts:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDistricts();
    }, []);

    // ─── Add Modal State ─────────────────────────────────────────────────────────
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [addFormData, setAddFormData] = useState({ name: "", censusCode: "" });
    const [addFormError, setAddFormError] = useState("");

    const handleAddClick = () => {
        setAddFormData({ name: "", censusCode: "" });
        setAddFormError("");
        setAddModalOpen(true);
    };

    const validateDistrictForm = (name, censusCode, setError) => {
        if (!name) { setError("District Name is required."); return false; }
        if (name.length < 3) { setError("District Name must be at least 3 characters."); return false; }
        if (name.length > 100) { setError("District Name must not exceed 100 characters."); return false; }
        if (!/^[a-zA-Z\s\-]+$/.test(name)) { setError("District Name can only contain letters, spaces, and hyphens."); return false; }
        if (!censusCode) { setError("Census Code is required."); return false; }
        if (censusCode.length >= 6) { setError("Census Code must be below 6 digits."); return false; }
        if (!/^\d+$/.test(censusCode)) { setError("Census Code must be a valid number."); return false; }
        return true;
    };

    const confirmAdd = async () => {
        setAddFormError("");
        const name = addFormData.name.trim();
        const censusCode = addFormData.censusCode.trim();
        if (!validateDistrictForm(name, censusCode, setAddFormError)) return;

        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch("/api/districts", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ distName: name, censusCode }),
            });

            if (!response.ok) throw new Error("Failed to create district");

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

    // ─── View Modal State ─────────────────────────────────────────────────────────
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [viewDistrictData, setViewDistrictData] = useState(null);
    const [isViewLoading, setIsViewLoading] = useState(false);

    const handleViewClick = async (district) => {
        setViewModalOpen(true);
        setIsViewLoading(true);
        setViewDistrictData(null);
        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch(`/api/district-details?id=${district.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const result = await response.json();

            if (result.status === 1 || result.data) {
                const data = result.data || {};
                setViewDistrictData({
                    id: data.id || district.id,
                    name: data.name || data.districtName || district.name,
                    censusCode: data.census_code || data.censusCode || district.censusCode,
                });
            } else {
                setViewDistrictData({ error: "Details not found" });
            }
        } catch (error) {
            console.error("Error fetching district details:", error);
            setViewDistrictData({ error: "Failed to fetch details" });
        } finally {
            setIsViewLoading(false);
        }
    };

    // ─── Edit Modal State ─────────────────────────────────────────────────────────
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editFormData, setEditFormData] = useState({ id: "", name: "", censusCode: "" });
    const [editFormError, setEditFormError] = useState("");
    const [saveConfirmOpen, setSaveConfirmOpen] = useState(false);

    const handleEditClick = (district) => {
        setEditFormData({ id: district.id, name: district.name, censusCode: district.censusCode });
        setEditFormError("");
        setEditModalOpen(true);
    };

    const handleSaveClick = () => {
        setEditFormError("");
        const name = editFormData.name.trim();
        const censusCode = editFormData.censusCode.toString().trim();
        if (!validateDistrictForm(name, censusCode, setEditFormError)) return;
        setSaveConfirmOpen(true);
    };

    const confirmSave = async () => {
        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch("/api/district-update", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    district_id: parseInt(editFormData.id, 10),
                    distName: editFormData.name.trim(),
                    censusCode: editFormData.censusCode.toString().trim(),
                }),
            });

            if (!response.ok) throw new Error("Failed to update district");

            const result = await response.json();
            if (result.status === 1 || result.success) {
                await fetchDistricts();
                setSaveConfirmOpen(false);
                setEditModalOpen(false);
            } else {
                setEditFormError(result.message || "Failed to edit from server");
                setSaveConfirmOpen(false);
            }
        } catch (error) {
            console.error("Error updating district:", error);
            alert("Failed to update district. Please try again.");
            setSaveConfirmOpen(false);
        }
    };

    // ─── Delete Modal State ───────────────────────────────────────────────────────
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [districtToDelete, setDistrictToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState("");

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
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
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
    }, [searchQuery]);

    const filteredDistricts = districts.filter((d) => {
        const name = d?.name || "";
        const censusCode = d?.censusCode || "";
        return (
            name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            censusCode.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    const totalPages = Math.ceil(filteredDistricts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredDistricts.length);
    const paginatedDistricts = filteredDistricts.slice(startIndex, startIndex + itemsPerPage);

    // ─── Export ───────────────────────────────────────────────────────────────────
    const handleExport = () => {
        exportToExcel({
            title: "Goa Districts — Detailed Report",
            headers: ["ID", "District Name", "Census Code"],
            rows: filteredDistricts.map((d) => [d.id, d.name, d.censusCode]),
            filename: "goa_districts_report",
        });
    };

    // ─── Render ───────────────────────────────────────────────────────────────────
    return (
        <ProtectedRoute allowedRole="super-admin">
            <>
                <DashboardLayout>
                    <div className="max-w-[1600px] mx-auto space-y-8 p-4">
                        {/* Page Header */}
                        <DistrictHeader onExport={handleExport} onAddClick={handleAddClick} />

                        {/* Summary Cards */}
                        <LocationSummaryCards totalDistricts={districts.length} />

                        {/* Data Table */}
                        <DistrictTable
                            districts={districts}
                            filteredDistricts={paginatedDistricts}
                            isLoading={isLoading}
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                            onView={handleViewClick}
                            onEdit={handleEditClick}
                            onDelete={handleDeleteClick}
                            footerProps={{
                                totalRecords: filteredDistricts.length,
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
                <AddDistrictModal
                    isOpen={addModalOpen}
                    onClose={() => { setAddModalOpen(false); setAddFormError(""); }}
                    formData={addFormData}
                    onChange={setAddFormData}
                    onConfirm={confirmAdd}
                    formError={addFormError}
                />

                <ViewDistrictModal
                    isOpen={viewModalOpen}
                    onClose={() => setViewModalOpen(false)}
                    districtData={viewDistrictData}
                    isLoading={isViewLoading}
                />

                <EditDistrictModal
                    isOpen={editModalOpen}
                    onClose={() => setEditModalOpen(false)}
                    formData={editFormData}
                    onChange={setEditFormData}
                    onSave={handleSaveClick}
                    formError={editFormError}
                />

                <SaveConfirmModal
                    isOpen={saveConfirmOpen}
                    onClose={() => setSaveConfirmOpen(false)}
                    onConfirm={confirmSave}
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
