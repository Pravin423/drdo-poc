import ProtectedRoute from "../../../components/ProtectedRoute";
import DashboardLayout from "../../../components/DashboardLayout";
import { motion } from "framer-motion";
import { FileText, ArrowLeft, Send } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function ViewForm() {
  const router = useRouter();
  const [form, setForm] = useState(null);
  const [formData, setFormData] = useState({});

  const [error, setError] = useState(null);

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
        
        // Assemble format for the UI
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

  const handleInputChange = (label, value) => {
    setFormData((prev) => ({ ...prev, [label]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    alert("Form submitted successfully! (Simulated)");
    router.push("/dashboard/activity-forms/all");
  };

  if (error) {
    return (
      <ProtectedRoute allowedRole="super-admin">
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
      <ProtectedRoute allowedRole="super-admin">
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
    <ProtectedRoute allowedRole="super-admin">
      <DashboardLayout>
        <div className="max-w-3xl mx-auto space-y-6 p-4">
          
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-4"
          >
            <button
              onClick={() => router.back()}
              className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
            >
              <ArrowLeft size={18} />
            </button>
            
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{form.title}</h1>
              <p className="text-slate-500 text-sm font-medium">{form.description || "No description provided."}</p>
            </div>
          </motion.header>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="grid grid-cols-3 gap-4 pb-2"
          >
             <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Status</p>
                <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${form.status === 1 ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                    <p className="text-sm font-semibold text-slate-800">{form.status === 1 ? 'Active' : 'Inactive'}</p>
                </div>
             </div>
             <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Created By</p>
                <p className="text-sm font-semibold text-slate-800">{form.created_by_name || form.created_by || 'Unknown'}</p>
             </div>
             <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Created At</p>
                <p className="text-sm font-semibold text-slate-800">{form.created_at ? new Date(form.created_at).toLocaleString() : 'N/A'}</p>
             </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60">
              <h2 className="text-base font-bold text-slate-800">Fields on this form</h2>
            </div>

            <div className="p-6 space-y-4">
              {form.fields && form.fields.length > 0 ? (
                form.fields.map((field, idx) => {
                  const isReq = field.is_required === 1;
                  return (
                  <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-bold text-slate-800 capitalize">
                        {field.label || field.name || `Field ${idx + 1}`}
                        {isReq && <span className="text-red-500 ml-1" title="Required">*</span>}
                        </label>
                        <span className="text-xs font-semibold px-2 py-1 bg-white border border-slate-200 rounded-lg text-slate-500 capitalize">{field.type}</span>
                    </div>
                    
                    <div className="text-xs text-slate-500 font-medium">
                        <p>Internal Name: <span className="text-slate-700">{field.name}</span></p>
                        {Array.isArray(field.options) && field.options.length > 0 && (
                            <p className="mt-1">Options: <span className="text-slate-700">{field.options.join(", ")}</span></p>
                        )}
                    </div>
                  </div>
                )})
              ) : (
                <div className="py-8 text-center text-slate-500 text-sm">
                  This form currently has no fields attached to it.
                </div>
              )}
            </div>
          </motion.div>

        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
