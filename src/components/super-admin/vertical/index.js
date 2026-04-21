import { useState, useEffect } from "react";
import { Layers } from "lucide-react";
import VerticalHeader from "./VerticalHeader";
import VerticalTable from "./VerticalTable";
import DashboardLayout from "../../DashboardLayout";
import SummaryCard from "../../common/SummaryCard";
import { AddVerticalModal, EditVerticalModal, ViewVerticalModal } from "../../VerticalModals";

// ─── Data fetching helpers ────────────────────────────────────────────────────

async function fetchVerticalsFromAPI() {
    const token = localStorage.getItem("authToken");
    const response = await fetch("/api/vertical-list", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
    const result = await response.json();
    const dataArray = Array.isArray(result)
        ? result
        : Array.isArray(result.data)
            ? result.data
            : [];

    return dataArray.map((v, i) => ({
        id: v.id || v._id || i + 1,
        name: v.name || v.vertical_name || v.verticalName || "—",
        code: v.code || v.vertical_code || v.verticalCode || "—",
        desc: v.description || v.desc || "—",
        start: v.start_date || v.startDate || v.start || "—",
        end: v.end_date || v.endDate || v.end || "—",
        createdBy: v.created_by || v.createdBy || v.created_by_name || "—",
        status: v.status === 0 ? true : v.status === 1 ? false : true,
        raw: v,
    }));
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function VerticalManagementComponent() {
    // ── List state ──────────────────────────────────────────────────────────
    const [verticals, setVerticals] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const loadVerticals = async () => {
        setIsLoading(true);
        try {
            const mapped = await fetchVerticalsFromAPI();
            setVerticals(mapped);
        } catch (error) {
            console.error("Fetch verticals error:", error);
            setVerticals([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { loadVerticals(); }, []);
    useEffect(() => { setCurrentPage(1); }, [searchQuery]);

    const filteredData = verticals.filter(
        (v) =>
            (v.name && v.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (v.code && v.code.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (v.desc && v.desc.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredData.length);
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    // ── Add modal state ─────────────────────────────────────────────────────
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
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify({
                    vertical_name: addFormData.name,
                    vertical_code: addFormData.code,
                    start_date: addFormData.start,
                    end_date: addFormData.end,
                    description: addFormData.desc,
                }),
            });
            const result = await response.json();
            if (response.ok && result.status !== false && result.status !== 0) {
                setAddModalOpen(false);
                loadVerticals();
            } else {
                const errorMsg = result.message || result.error || (result.errors ? Object.values(result.errors).flat().join(" | ") : null);
                setAddFormError(errorMsg || "Failed to add vertical");
            }
        } catch {
            setAddFormError("An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // ── Edit modal state ────────────────────────────────────────────────────
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editFormData, setEditFormData] = useState({ id: "", name: "", code: "", start: "", end: "", desc: "" });
    const [editFormError, setEditFormError] = useState("");
    const [isEditSubmitting, setIsEditSubmitting] = useState(false);

    const handleEditClick = (vertical) => {
        setEditFormData({
            id: vertical.id,
            name: vertical.name !== "—" ? vertical.name : "",
            code: vertical.code !== "—" ? vertical.code : "",
            start: vertical.start !== "—" ? vertical.start : "",
            end: vertical.end !== "—" ? vertical.end : "",
            desc: vertical.desc !== "—" ? vertical.desc : "",
        });
        setEditFormError("");
        setEditModalOpen(true);
    };

    const confirmEdit = async () => {
        setEditFormError("");
        if (!editFormData.name.trim() || !editFormData.code.trim() || !editFormData.start || !editFormData.end || !editFormData.desc.trim()) {
            setEditFormError("Please fill out all required fields.");
            return;
        }
        setIsEditSubmitting(true);
        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch("/api/vertical-update", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify({
                    vertical_id: editFormData.id,
                    vertical_name: editFormData.name,
                    vertical_code: editFormData.code,
                    start_date: editFormData.start,
                    end_date: editFormData.end,
                    description: editFormData.desc,
                }),
            });
            const result = await response.json();
            if (response.ok && result.status !== false && result.status !== 0) {
                setEditModalOpen(false);
                loadVerticals();
            } else {
                const errorMsg = result.message || result.error || (result.errors ? Object.values(result.errors).flat().join(" | ") : null);
                setEditFormError(errorMsg || "Failed to update vertical");
            }
        } catch {
            setEditFormError("An error occurred. Please try again.");
        } finally {
            setIsEditSubmitting(false);
        }
    };

    // ── View modal state ────────────────────────────────────────────────────
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [viewData, setViewData] = useState(null);

    const handleViewClick = (vertical) => {
        setViewData(vertical);
        setViewModalOpen(true);
    };

    // ── Render ──────────────────────────────────────────────────────────────
    return (
        <>
            <DashboardLayout>
                <div className="max-w-[1600px] mx-auto space-y-6">
                    <VerticalHeader
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        onAddClick={handleAddClick}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <SummaryCard 
                            title="Total Verticals"
                            value={verticals.length}
                            icon={Layers}
                            variant="indigo"
                            delay={0.1}
                        />
                    </div>

                    <VerticalTable
                        isLoading={isLoading}
                        filteredData={paginatedData}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        onView={handleViewClick}
                        onEdit={handleEditClick}
                        footerProps={{
                            totalRecords: filteredData.length,
                            currentPage,
                            totalPages,
                            startIndex: startIndex + 1,
                            endIndex,
                            onPageChange: setCurrentPage
                        }}
                    />
                </div>
            </DashboardLayout>

            <AddVerticalModal
                open={addModalOpen}
                onClose={() => setAddModalOpen(false)}
                formData={addFormData}
                setFormData={setAddFormData}
                onSubmit={confirmAdd}
                isSubmitting={isSubmitting}
                formError={addFormError}
            />

            <EditVerticalModal
                open={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                formData={editFormData}
                setFormData={setAddFormData}
                onSubmit={confirmEdit}
                isSubmitting={isEditSubmitting}
                formError={editFormError}
            />

            <ViewVerticalModal
                open={viewModalOpen}
                onClose={() => setViewModalOpen(false)}
                data={viewData}
            />
        </>
    );
}
