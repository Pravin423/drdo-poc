"use client";

import ProtectedRoute from "../../../components/ProtectedRoute";
import DashboardLayout from "../../../components/DashboardLayout";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

// Extracted Components
import { 
  ViewFormHeader, 
  FormStats, 
  FieldsList 
} from "../../../components/super-admin/activity-form";

export default function ViewForm() {
  const router = useRouter();
  const isViewOnly = router.query.viewOnly === "true";
  const [form, setForm] = useState(null);
  const [error, setError] = useState(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    const fetchFormDetails = async () => {
      if (!router.query.id) return;
      
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`/api/activity-form-details?id=${router.query.id}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch form details");
        }

        const result = await response.json();
        
        setForm({
            ...result.data,
            title: result.data.form_name,
            fields: result.fields || []
        });

      } catch (err) {
        console.error("Error fetching form:", err);
        setError("Could not load the activity form.");
      }
    };

    fetchFormDetails();
  }, [router.query.id]);

  const toggleStatus = async () => {
    if (!form) return;
    setIsUpdatingStatus(true);
    const newStatus = form.status === 1 ? 0 : 1;
    try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`/api/activity-form-toggle?id=${form.id}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        });

        if (response.ok) {
            setForm(prev => ({...prev, status: newStatus}));
        } else {
            console.error("Failed to update status");
            alert("Failed to update status.");
        }
    } catch(err) {
        console.error("Error updating status:", err);
        alert("An error occurred while updating the status.");
    } finally {
        setIsUpdatingStatus(false);
    }
  };

  if (error) {
    return (
    <ProtectedRoute allowedRole={["super-admin", "state-admin"]}>
        <DashboardLayout>
          <div className="flex items-center justify-center min-h-[50vh]">
            <p className="text-red-500 font-medium px-4 py-2 bg-red-50 rounded-lg">{error}</p>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (!form) {
    return (
    <ProtectedRoute allowedRole={["super-admin", "state-admin"]}>
        <DashboardLayout>
          <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
             <div className="w-8 h-8 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin" />
            <p className="text-slate-500 font-medium">Loading form details...</p>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRole={["super-admin", "state-admin"]}>
      <DashboardLayout>
        <div className="max-w-3xl mx-auto space-y-6 p-4">
          
          <ViewFormHeader 
            router={router}
            title={form.title}
            description={form.description}
          />

          <FormStats 
            form={form}
            toggleStatus={toggleStatus}
            isUpdatingStatus={isUpdatingStatus}
            isViewOnly={isViewOnly}
          />

          <FieldsList 
            fields={form.fields}
          />

        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
