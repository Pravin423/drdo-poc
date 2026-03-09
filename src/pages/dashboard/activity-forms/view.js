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

  useEffect(() => {
    if (router.query.id) {
      const saved = JSON.parse(localStorage.getItem("activity_forms") || "[]");
      const found = saved.find((f) => f.id === router.query.id);
      if (found) {
        setForm(found);
      }
    }
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

  if (!form) {
    return (
      <ProtectedRoute allowedRole="super-admin">
        <DashboardLayout>
          <div className="flex items-center justify-center min-h-[50vh]">
            <p className="text-slate-500 font-medium">Loading form...</p>
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
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <FileText size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{form.title}</h1>
              <p className="text-slate-500 text-sm font-medium">{form.description || "No description provided."}</p>
            </div>
          </motion.header>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60">
              <h2 className="text-base font-bold text-slate-800">Fill out this form</h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {form.customFields && form.customFields.length > 0 ? (
                form.customFields.map((field, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <label className="block text-sm font-semibold text-slate-700">
                      {field.label || `Field ${idx + 1}`}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    
                    {field.type === "text" && (
                      <input
                        type="text"
                        required={field.required}
                        placeholder={field.placeholder || ""}
                        onChange={(e) => handleInputChange(field.label, e.target.value)}
                        className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all"
                      />
                    )}

                    {field.type === "textarea" && (
                      <textarea
                        rows={3}
                        required={field.required}
                        placeholder={field.placeholder || ""}
                        onChange={(e) => handleInputChange(field.label, e.target.value)}
                        className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all resize-y"
                      />
                    )}

                    {field.type === "number" && (
                      <input
                        type="number"
                        required={field.required}
                        placeholder={field.placeholder || ""}
                        onChange={(e) => handleInputChange(field.label, e.target.value)}
                        className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all"
                      />
                    )}

                    {field.type === "select" && (
                      <select
                        required={field.required}
                        onChange={(e) => handleInputChange(field.label, e.target.value)}
                        className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all bg-white"
                      >
                        <option value="">{field.placeholder || "Select an option"}</option>
                        <option value="Option 1">Option 1</option>
                        <option value="Option 2">Option 2</option>
                        <option value="Option 3">Option 3</option>
                      </select>
                    )}

                    {field.type === "checkbox" && (
                      <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          required={field.required}
                          onChange={(e) => handleInputChange(field.label, e.target.checked)}
                          className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/20 accent-indigo-600"
                        />
                        <span>{field.placeholder || "Check here"}</span>
                      </label>
                    )}
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-slate-500 text-sm">
                  This form currently has no fields. Let an admin know to add some fields!
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-md shadow-indigo-500/20 active:scale-95"
                >
                  <Send size={16} /> Submit Response
                </button>
              </div>
            </form>
          </motion.div>

        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
