import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import ProtectedRoute from "../../../components/ProtectedRoute";
import DashboardLayout from "../../../components/DashboardLayout";
import LocationSummaryCards from "../../../components/LocationSummaryCards";
import { exportToExcel } from "../../../lib/exportToExcel";

// Village sub-components
import VillageHeader from "../../../components/super-admin/location/village/VillageHeader";
import VillageTable from "../../../components/super-admin/location/village/VillageTable";
import AddVillageModal from "../../../components/super-admin/location/village/AddVillageModal";
import ViewVillageModal from "../../../components/super-admin/location/village/ViewVillageModal";
import EditVillageModal from "../../../components/super-admin/location/village/EditVillageModal";
import ImportVillageModal from "../../../components/super-admin/location/village/ImportVillageModal";
import { SaveConfirmModal, DeleteConfirmModal } from "../../../components/super-admin/location/village/ConfirmModals";

export default function VillagesManagement() {
    const router = useRouter();
    const isViewOnly = router.query.viewOnly === "true";

    const ROWS_PER_PAGE = 10;

    // ─── Data State ───────────────────────────────────────────────────────────────
    const [villages, setVillages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const [districts, setDistricts] = useState([]);
    const [talukasOptions, setTalukasOptions] = useState([]);
    const [modalTalukas, setModalTalukas] = useState([]);

    // Filters
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedTaluka, setSelectedTaluka] = useState(null);
    const [filterOpen, setFilterOpen] = useState(false);
    const filterRef = useRef(null);

    // ─── API Helpers ──────────────────────────────────────────────────────────────
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
                    id: (d.id || d._id || d.district_id || i + 1).toString(),
                    name: d.name || d.district || d.districtName || d.district_name || "",
                }))
            );
        } catch (err) {
            console.error("[Villages] Error fetching districts:", err);
        }
    };

    const fetchDropdownTalukas = async (districtId = null, setTarget = setTalukasOptions) => {
        try {
            const token = localStorage.getItem("authToken");
            const url = districtId ? `/api/talukas?district_id=${districtId}` : "/api/talukas";
            const response = await fetch(url, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            });
            if (!response.ok) return;
            const result = await response.json();
            const dataArray = Array.isArray(result.data) ? result.data : Array.isArray(result) ? result : [];
            setTarget(
                dataArray.map((t, i) => ({
                    id: (t.id || t._id || t.taluka_id || i + 1).toString(),
                    name: t.name || t.taluka || t.talukaName || t.taluka_name || "",
                    district_id: (t.district_id || t.districtID || "").toString(),
                }))
            );
        } catch (err) {
            console.error("[Villages] Error fetching talukas:", err);
        }
    };

    const fetchVillages = async (distId = null, talId = null) => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("authToken");
            const params = new URLSearchParams();
            if (distId) params.append("district_id", distId);
            if (talId) params.append("taluka_id", talId);
            const endpoint = params.toString() ? `/api/villages?${params.toString()}` : "/api/villages";

            const response = await fetch(endpoint, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            });
            if (!response.ok) throw new Error(`Failed to fetch villages (status: ${response.status})`);

            const result = await response.json();
            const dataArray = Array.isArray(result.data) ? result.data : Array.isArray(result) ? result : [];

            setVillages(
                dataArray.map((v, index) => ({
                    id: (v.id || v.village_id || v.villageId || v.villageID || v._id || index + 1).toString(),
                    name: v.villageName || v.village_name || v.name || "",
                    talukaName: v.talukaName || v.taluka_name || v.taluka || talukasOptions.find((t) => t.id == (v.taluka_id || v.talukaID))?.name || "",
                    districtName: v.districtName || v.district_name || v.district || districts.find((d) => d.id == (v.district_id || v.districtID))?.name || "",
                    censusCode: (v.censusCode || v.census_code || v.census || "").toString(),
                }))
            );
        } catch (error) {
            console.error("[Villages] Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDistricts();
        fetchDropdownTalukas();
        fetchVillages();
    }, []);

    // Re-fetch on filter change
    const isMounted = useRef(false);
    useEffect(() => {
        if (!isMounted.current) { isMounted.current = true; return; }
        fetchDropdownTalukas(selectedDistrict ? selectedDistrict.id : null);
        fetchVillages(selectedDistrict ? selectedDistrict.id : null, selectedTaluka ? selectedTaluka.id : null);
    }, [selectedDistrict, selectedTaluka]);

    // Close filter on outside click
    useEffect(() => {
        const handler = (e) => {
            if (filterRef.current && !filterRef.current.contains(e.target)) setFilterOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // ─── Add Modal State ──────────────────────────────────────────────────────────
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [addFormData, setAddFormData] = useState({ name: "", talukaID: "", districtID: "", censusCode: "" });
    const [addFormError, setAddFormError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddClick = () => {
        setAddFormData({ name: "", talukaID: "", districtID: "", censusCode: "" });
        setModalTalukas([]);
        setAddFormError("");
        setAddModalOpen(true);
    };

    const handleAddDistrictChange = (distId) => {
        setAddFormData((prev) => ({ ...prev, districtID: distId, talukaID: "" }));
        fetchDropdownTalukas(distId, setModalTalukas);
    };

    const confirmAdd = async () => {
        setAddFormError("");
        const name = addFormData.name.trim();
        const { talukaID, districtID } = addFormData;
        const censusCode = addFormData.censusCode.trim();

        if (!name) { setAddFormError("Village Name is required."); return; }
        if (name.length < 3) { setAddFormError("Village Name must be at least 3 characters."); return; }
        if (!/^[a-zA-Z\s\-]+$/.test(name)) { setAddFormError("Village Name can only contain letters, spaces, and hyphens."); return; }
        if (!talukaID) { setAddFormError("Taluka is required."); return; }
        if (!districtID) { setAddFormError("District is required."); return; }
        if (!censusCode) { setAddFormError("Census Code is required."); return; }
        if (censusCode.length >= 7) { setAddFormError("Census Code must be below 7 digits."); return; }
        if (!/^\d+$/.test(censusCode)) { setAddFormError("Census Code must be a valid number."); return; }

        setIsSubmitting(true);
        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch("/api/villages", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify({
                    villageName: name,
                    censusCode: parseInt(censusCode, 10),
                    talukaID: parseInt(talukaID, 10),
                    districtID: parseInt(districtID, 10),
                }),
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Failed to add village (status: ${response.status})`);
            }
            await fetchVillages(selectedDistrict?.id ?? null, selectedTaluka?.id ?? null);
            setAddModalOpen(false);
        } catch (error) {
            setAddFormError(error.message || "An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    // ─── View Modal State ─────────────────────────────────────────────────────────
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [villageDetails, setVillageDetails] = useState(null);
    const [isFetchingDetails, setIsFetchingDetails] = useState(false);
    const [viewError, setViewError] = useState("");

    const handleViewClick = async (id) => {
        setViewError("");
        setVillageDetails(null);
        setIsFetchingDetails(true);
        setViewModalOpen(true);
        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch(`/api/village-details?id=${id}`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Failed to fetch details (status: ${response.status})`);
            }
            const data = await response.json();
            setVillageDetails(data.data || data);
        } catch (error) {
            setViewError(error.message || "An error occurred");
        } finally {
            setIsFetchingDetails(false);
        }
    };

    // ─── Edit Modal State ─────────────────────────────────────────────────────────
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editFormData, setEditFormData] = useState({ id: "", name: "", talukaName: "", districtName: "", censusCode: "" });
    const [editFormError, setEditFormError] = useState("");
    const [saveConfirmOpen, setSaveConfirmOpen] = useState(false);

    const handleEditClick = (village) => {
        setEditFormData({
            id: village.id,
            name: village.name,
            talukaName: village.talukaName,
            districtName: village.districtName,
            censusCode: village.censusCode,
        });
        setEditFormError("");
        setEditModalOpen(true);
    };

    const handleEditDistrictChange = (districtName) => {
        setEditFormData((prev) => ({ ...prev, districtName, talukaName: "" }));
        const dist = districts.find((d) => d.name === districtName);
        if (dist) fetchDropdownTalukas(dist.id, setModalTalukas);
    };

    const handleSaveClick = () => {
        setEditFormError("");
        const name = editFormData.name.trim();
        const { talukaName, districtName } = editFormData;
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
        setVillages((prev) =>
            prev.map((v) =>
                v.id === editFormData.id
                    ? { ...v, name: editFormData.name, talukaName: editFormData.talukaName, districtName: editFormData.districtName, censusCode: editFormData.censusCode }
                    : v
            )
        );
        setSaveConfirmOpen(false);
        setEditModalOpen(false);
    };

    // ─── Delete State ─────────────────────────────────────────────────────────────
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [villageToDelete, setVillageToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    const handleDeleteClick = (id) => {
        setVillageToDelete(id);
        setDeleteError("");
        setDeleteConfirmOpen(true);
    };

    const confirmDelete = async () => {
        if (!villageToDelete) return;
        setIsDeleting(true);
        setDeleteError("");
        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch(`/api/village-delete?id=${villageToDelete}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            });
            const result = await response.json();
            if (result.status === 1 || result.success || response.ok) {
                await fetchVillages(selectedDistrict?.id ?? null, selectedTaluka?.id ?? null);
                setDeleteConfirmOpen(false);
                setVillageToDelete(null);
            } else {
                setDeleteError(result.message || "Failed to delete village.");
            }
        } catch (error) {
            console.error("Error deleting village:", error);
            setDeleteError("Failed to delete village. Please try again.");
        } finally {
            setIsDeleting(false);
        }
    };

    // ─── Import State ─────────────────────────────────────────────────────────────
    const [importModalOpen, setImportModalOpen] = useState(false);
    const [importFile, setImportFile] = useState(null);
    const [importDragOver, setImportDragOver] = useState(false);
    const [importResult, setImportResult] = useState(null);
    const [importLoading, setImportLoading] = useState(false);

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
            const lines = text.split(/\r?\n/).filter((l) => l.trim());
            if (lines.length < 2) {
                setImportResult({ added: 0, skipped: 0, errors: ["File is empty or has no data rows."] });
                setImportLoading(false);
                return;
            }
            const dataLines = lines.slice(1);
            let added = 0, skipped = 0;
            const errors = [];
            const newVillages = [];
            let nextId = villages.length + 1;

            dataLines.forEach((line, idx) => {
                const cols = line.split(",").map((c) => c.trim());
                if (cols.length < 4) { errors.push(`Row ${idx + 2}: insufficient columns.`); skipped++; return; }
                const [name, talukaName, districtName, censusCode] = cols;
                if (!name || !talukaName || !districtName || !censusCode) { errors.push(`Row ${idx + 2}: missing required fields.`); skipped++; return; }
                const isDuplicate = villages.some((v) => v.censusCode === censusCode) || newVillages.some((v) => v.censusCode === censusCode);
                if (isDuplicate) { errors.push(`Row ${idx + 2}: census code "${censusCode}" already exists — skipped.`); skipped++; return; }
                newVillages.push({ id: (nextId++).toString(), name, talukaName, districtName, censusCode });
                added++;
            });

            if (newVillages.length > 0) setVillages((prev) => [...prev, ...newVillages]);
            setImportResult({ added, skipped, errors });
            setImportLoading(false);
        };
        reader.readAsText(importFile);
    };

    // ─── Disable scroll when modal open ──────────────────────────────────────────
    useEffect(() => {
        const anyOpen = addModalOpen || editModalOpen || saveConfirmOpen || deleteConfirmOpen || importModalOpen || viewModalOpen;
        document.body.style.overflow = anyOpen ? "hidden" : "unset";
        return () => { document.body.style.overflow = "unset"; };
    }, [addModalOpen, editModalOpen, saveConfirmOpen, deleteConfirmOpen, importModalOpen, viewModalOpen]);

    // ─── Filtered Data ────────────────────────────────────────────────────────────
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedDistrict, selectedTaluka]);

    const filteredVillages = villages.filter(
        (v) =>
            v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            v.talukaName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            v.districtName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            v.censusCode.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredVillages.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredVillages.length);
    const paginatedVillages = filteredVillages.slice(startIndex, startIndex + itemsPerPage);

    const handleSearchChange = (val) => {
        setSearchQuery(val);
    };

    // ─── Export ───────────────────────────────────────────────────────────────────
    const handleExport = () => {
        exportToExcel({
            title: "Goa Villages — Detailed Report",
            headers: ["ID", "Village Name", "Taluka Name", "District Name", "Census Code"],
            rows: filteredVillages.map((v) => [v.id, v.name, v.talukaName, v.districtName, v.censusCode]),
            filename: "goa_villages_report",
        });
    };

    // ─── Render ───────────────────────────────────────────────────────────────────
    return (
        <ProtectedRoute allowedRole="super-admin">
            <>
                <DashboardLayout>
                    <div className="max-w-[1600px] mx-auto space-y-8 p-4">
                        <VillageHeader
                            onExport={handleExport}
                            onImportClick={handleImportClick}
                            onAddClick={handleAddClick}
                            isViewOnly={isViewOnly}
                        />

                        <LocationSummaryCards
                            totalDistricts={districts.length}
                            totalTalukas={talukasOptions.length}
                            totalVillages={villages.length}
                        />

                        <VillageTable
                            villages={villages}
                            filteredVillages={paginatedVillages}
                            isLoading={isLoading}
                            searchQuery={searchQuery}
                            onSearchChange={handleSearchChange}
                            districts={districts}
                            talukasOptions={talukasOptions}
                            selectedDistrict={selectedDistrict}
                            selectedTaluka={selectedTaluka}
                            onSelectDistrict={setSelectedDistrict}
                            onSelectTaluka={setSelectedTaluka}
                            filterOpen={filterOpen}
                            onToggleFilter={() => setFilterOpen((prev) => !prev)}
                            onView={handleViewClick}
                            onEdit={handleEditClick}
                            onDelete={handleDeleteClick}
                            isViewOnly={isViewOnly}
                            footerProps={{
                                totalRecords: filteredVillages.length,
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
                <AddVillageModal
                    isOpen={addModalOpen}
                    onClose={() => { setAddModalOpen(false); setAddFormError(""); }}
                    formData={addFormData}
                    onChange={setAddFormData}
                    onConfirm={confirmAdd}
                    formError={addFormError}
                    isSubmitting={isSubmitting}
                    districts={districts}
                    modalTalukas={modalTalukas}
                    onDistrictChange={handleAddDistrictChange}
                />

                <ViewVillageModal
                    isOpen={viewModalOpen}
                    onClose={() => setViewModalOpen(false)}
                    villageDetails={villageDetails}
                    isLoading={isFetchingDetails}
                    viewError={viewError}
                    districts={districts}
                    talukasOptions={talukasOptions}
                />

                <EditVillageModal
                    isOpen={editModalOpen}
                    onClose={() => setEditModalOpen(false)}
                    formData={editFormData}
                    onChange={setEditFormData}
                    onSave={handleSaveClick}
                    formError={editFormError}
                    districts={districts}
                    modalTalukas={modalTalukas}
                    onDistrictChange={handleEditDistrictChange}
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

                <ImportVillageModal
                    isOpen={importModalOpen}
                    onClose={() => setImportModalOpen(false)}
                    importFile={importFile}
                    onFileChange={(file) => { setImportResult(null); setImportFile(file); }}
                    importDragOver={importDragOver}
                    onDragOver={(e) => { e.preventDefault(); setImportDragOver(true); }}
                    onDragLeave={() => setImportDragOver(false)}
                    onDrop={(e) => { e.preventDefault(); setImportDragOver(false); setImportResult(null); const file = e.dataTransfer.files[0]; if (file?.name.endsWith(".csv")) setImportFile(file); }}
                    importResult={importResult}
                    importLoading={importLoading}
                    onImport={parseAndImport}
                    onTemplateDownload={handleTemplateDownload}
                />
            </>
        </ProtectedRoute>
    );
}
