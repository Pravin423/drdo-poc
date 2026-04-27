"use client";

import ProtectedRoute from "../../../components/ProtectedRoute";
import DashboardLayout from "../../../components/DashboardLayout";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { AnimatePresence } from "framer-motion";

// Extracted Components
import { 
  AllFormsHeader, 
  FormsTable, 
  DeleteFormModal,
  CreateFormModal,
  AllFormsStats
} from "../../../components/super-admin/activity-form";
import { exportToExcel } from "../../../lib/exportToExcel";

export default function AllForms() {
  const [search, setSearch] = useState("");
  const [forms, setForms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [formToDelete, setFormToDelete] = useState(null);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState(null);

  const router = useRouter();
  const isViewOnly = router.query.viewOnly === "true";

  const fetchForms = useCallback(async () => {
    setIsLoading(true);
    try {
        const token = localStorage.getItem("authToken");
        const response = await fetch("/api/activity-forms", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch activity forms`);
        }

        const result = await response.json();
        const dataArray = Array.isArray(result.data) ? result.data : [];

        const fetchedForms = dataArray.map((f, index) => ({
            id: (f.id || index + 1).toString(),
            title: f.form_name || "",
            description: f.description || "",
            fields: f.field_count || 0,
            createdBy: f.created_by_name || f.created_by || "",
            createdAt: f.created_at || "",
            status: f.status === 1 ? "Active" : "Inactive"
        }));

        setForms(fetchedForms);
    } catch (error) {
        console.error("Error fetching forms:", error);
    } finally {
        setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchForms();
    if (router.query.action === 'create') {
      setIsModalOpen(true);
      setSelectedFormId(null);
    }
  }, [fetchForms, router.query.action]);

  const handleDeleteClick = (id) => {
    setFormToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (formToDelete) {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`/api/activity-form-delete?id=${formToDelete}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to delete the form");
        }

        const filtered = forms.filter((f) => f.id !== formToDelete);
        setForms(filtered);
      } catch (error) {
        console.error("Error deleting form:", error);
      } finally {
        setDeleteConfirmOpen(false);
        setFormToDelete(null);
      }
    }
  };

  const handleOpenCreateModal = () => {
    setSelectedFormId(null);
    setIsModalOpen(true);
  };

  const handleEditForm = (id) => {
    setSelectedFormId(id);
    setIsModalOpen(true);
  };

  const handleSaveSuccess = () => {
    fetchForms(); // Refresh the list
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const filtered = forms.filter((f) =>
    f.title.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filtered.length);
  const paginatedData = filtered.slice(startIndex, startIndex + itemsPerPage);
  const stats = {
    total: forms.length,
    active: forms.filter(f => f.status === "Active").length,
    inactive: forms.filter(f => f.status === "Inactive").length
  };

  const handleExport = () => {
    exportToExcel({
      title: "Activity Forms Report",
      headers: ["ID", "Title", "Description", "Fields Count", "Created By", "Created At", "Status"],
      rows: filtered.map(f => [
        f.id,
        f.title,
        f.description,
        f.fields,
        f.createdBy,
        f.createdAt,
        f.status
      ]),
      filename: `activity_forms_${new Date().toISOString().split('T')[0]}`
    });
  };

  return (
    <ProtectedRoute allowedRole={["super-admin", "state-admin"]}>
      <DashboardLayout>
        <div className="max-w-[1600px] mx-auto space-y-8 p-4">

          <AllFormsHeader onOpenCreateModal={handleOpenCreateModal} onExport={handleExport} isViewOnly={isViewOnly} />

          <AllFormsStats stats={stats} />

          <FormsTable 
            search={search}
            setSearch={setSearch}
            isLoading={isLoading}
            filtered={paginatedData}
            forms={forms}
            router={router}
            handleDeleteClick={handleDeleteClick}
            onEditForm={handleEditForm}
            isViewOnly={isViewOnly}
            footerProps={{
              totalRecords: filtered.length,
              currentPage,
              totalPages,
              startIndex: startIndex + 1,
              endIndex,
              onPageChange: setCurrentPage
            }}
          />

        </div>
      </DashboardLayout>

      <DeleteFormModal 
        deleteConfirmOpen={deleteConfirmOpen}
        setDeleteConfirmOpen={setDeleteConfirmOpen}
        confirmDelete={confirmDelete}
      />

      <AnimatePresence>
        {isModalOpen && (
          <CreateFormModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            formId={selectedFormId}
            onSaveSuccess={handleSaveSuccess}
          />
        )}
      </AnimatePresence>
    </ProtectedRoute>
  );
}
