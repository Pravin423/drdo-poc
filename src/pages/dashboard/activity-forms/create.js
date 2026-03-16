import ProtectedRoute from "../../../components/ProtectedRoute";
import DashboardLayout from "../../../components/DashboardLayout";
import { motion } from "framer-motion";
import { FilePlus2, ArrowLeft, Save, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { AnimatePresence } from "framer-motion";

export default function CreateForm() {
  const router = useRouter();
  const [formName, setFormName] = useState("");
  const [description, setDescription] = useState("");
  const isEditing = Boolean(router.query.id);

  useEffect(() => {
    if (router.query.id) {
      const saved = JSON.parse(localStorage.getItem("activity_forms") || "[]");
      const toEdit = saved.find((f) => f.id === router.query.id);
      if (toEdit) {
        setFormName(toEdit.title);
        setDescription(toEdit.description || "");
      }
    }
  }, [router.query.id]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [saveConfirmOpen, setSaveConfirmOpen] = useState(false);
  const [saveError, setSaveError] = useState("");

  const validateForm = () => {
      setFormError("");
      if (!formName.trim()) { setFormError("Form Name is required."); return false; }
      if (formName.length < 3) { setFormError("Form Name must be at least 3 characters."); return false; }
      if (!/^[a-zA-Z0-9\s\-]+$/.test(formName)) { setFormError("Form Name contains invalid characters."); return false; }
      return true;
  };

  const handleInitialSubmit = () => {
      if (validateForm()) {
          setSaveConfirmOpen(true);
      }
  };

  const confirmSave = async () => {
    if (!formName.trim()) return;
    
    setIsSubmitting(true);
    setSaveError("");

    try {
      const token = localStorage.getItem("authToken");
      const url = isEditing ? `/api/activity-forms?id=${router.query.id}` : "/api/activity-forms";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          form_name: formName,
          description: description,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save activity form");
      }

      router.push("/dashboard/activity-forms/all");
    } catch (error) {
      console.error("Error saving form:", error);
      setSaveError(error.message || "An error occurred while saving the form.");
    } finally {
      setIsSubmitting(false);
      if(!saveError) setSaveConfirmOpen(false);
    }
  };

  return (
    <ProtectedRoute allowedRole="super-admin">
      <DashboardLayout>
        <div className="max-w-3xl mx-auto space-y-6 p-4">

          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-tech-blue-600 to-tech-blue-700 flex items-center justify-center shadow-md shadow-tech-blue-500/20">
              <FilePlus2 size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{isEditing ? "Edit Activity Form" : "Create New Activity Form"}</h1>
              <p className="text-slate-500 text-sm font-medium">{isEditing ? "Modify an existing form for CRP activity reporting" : "Build a new form for CRP activity reporting"}</p>
            </div>
          </motion.header>

          {/* Main Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
          >
            {/* Card Header */}
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60">
              <h2 className="text-base font-bold text-slate-800">{isEditing ? "Edit Form Details" : "Create New Activity Form"}</h2>
            </div>

            {/* Card Body */}
            <div className="p-6 space-y-5">

              {/* Form Name */}
              <div className="w-full">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Form Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength={100}
                  value={formName}
                  onChange={(e) => {
                      const val = e.target.value.replace(/[^a-zA-Z0-9\s\-]/g, '');
                      setFormName(val);
                  }}
                  placeholder="e.g. Monthly Field Visit Report"
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all text-slate-700 font-medium ${formError && formError.includes('Form Name') ? 'border-red-400 focus:ring-2 focus:ring-red-400/20' : 'border-slate-300 focus:border-tech-blue-500 focus:ring-2 focus:ring-tech-blue-500/20'}`}
                />
              </div>

              {/* Description */}
              <div className="w-full">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of what this form is for"
                  className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-700 font-medium outline-none focus:border-tech-blue-500 focus:ring-2 focus:ring-tech-blue-500/20 transition-all resize-y"
                />
              </div>

              <AnimatePresence>
                  {formError && (
                      <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="w-full text-sm font-medium text-red-500 bg-red-50 p-2.5 rounded-lg border border-red-100"
                      >
                          {formError}
                      </motion.p>
                  )}
              </AnimatePresence>

            </div>

            {/* Card Footer — Buttons */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/40 flex items-center justify-end gap-3">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
              >
                 Cancel
              </button>
              <button
                onClick={handleInitialSubmit}
                disabled={!formName.trim() || isSubmitting}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-tech-blue-600 hover:bg-tech-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-sm transition-all shadow-tech-blue-500/20"
              >
                <Save size={15} /> {isEditing ? "Save Changes" : "Create Form"}
              </button>
            </div>
          </motion.div>

        </div>
      </DashboardLayout>

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
                          <p className="text-sm font-medium text-slate-500 mb-8 px-2">Are you sure you want to save these changes to the activity form?</p>

                          <AnimatePresence>
                              {saveError && (
                                  <motion.p
                                      initial={{ opacity: 0, y: -10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -10 }}
                                      className="w-full text-sm font-medium text-red-500 bg-red-50 p-2.5 rounded-lg border border-red-100 mb-4"
                                  >
                                      {saveError}
                                  </motion.p>
                              )}
                          </AnimatePresence>

                          <div className="flex gap-3 justify-center w-full">
                              <button disabled={isSubmitting} onClick={() => setSaveConfirmOpen(false)} className="flex-1 px-4 py-3 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50">
                                  Cancel
                              </button>
                              <button disabled={isSubmitting} onClick={confirmSave} className="flex-1 px-4 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-colors active:scale-95 disabled:opacity-50 flex justify-center items-center gap-2">
                                  {isSubmitting ? (
                                      <>
                                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                          Saving...
                                      </>
                                  ) : "Yes, Save"}
                              </button>
                          </div>
                      </div>
                  </motion.div>
              </div>
          )}
      </AnimatePresence>
    </ProtectedRoute>
  );
}
