"use client";

import ProtectedRoute from "../../../components/ProtectedRoute";
import DashboardLayout from "../../../components/DashboardLayout";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

// Extracted Components
import { 
  AllFormsHeader, 
  FormsTable, 
  DeleteFormModal 
} from "../../../components/super-admin/activity-form";

export default function AllForms() {
  const [search, setSearch] = useState("");
  const [forms, setForms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [formToDelete, setFormToDelete] = useState(null);
  const router = useRouter();

  const fetchForms = async () => {
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
  };

  useEffect(() => {
    fetchForms();
  }, []);

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

  const filtered = forms.filter((f) =>
    f.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ProtectedRoute allowedRole="super-admin">
      <DashboardLayout>
        <div className="max-w-5xl mx-auto space-y-8 p-4">

          <AllFormsHeader />

          <FormsTable 
            search={search}
            setSearch={setSearch}
            isLoading={isLoading}
            filtered={filtered}
            forms={forms}
            router={router}
            handleDeleteClick={handleDeleteClick}
          />

        </div>
      </DashboardLayout>

      <DeleteFormModal 
        deleteConfirmOpen={deleteConfirmOpen}
        setDeleteConfirmOpen={setDeleteConfirmOpen}
        confirmDelete={confirmDelete}
      />
    </ProtectedRoute>
  );
}
