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
  const [fields, setFields] = useState([]);
  const isEditing = Boolean(router.query.id);

  useEffect(() => {
    const fetchFormDetails = async () => {
      if (!router.query.id) return;
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`/api/activity-form-details?id=${router.query.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const body = await response.json();
          if (body.data) {
            setFormName(body.data.form_name || "");
            setDescription(body.data.description || "");
          }
          if (body.fields) {
            setFields(body.fields);
          }
        }
      } catch (e) {
        console.error("Failed to fetch form details");
      }
    };
    fetchFormDetails();
  }, [router.query.id]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [saveConfirmOpen, setSaveConfirmOpen] = useState(false);
  const [saveError, setSaveError] = useState("");

  const [isFieldModalOpen, setIsFieldModalOpen] = useState(false);
  const [isAddingField, setIsAddingField] = useState(false);
  const [addFieldConfirmOpen, setAddFieldConfirmOpen] = useState(false);
  const [fieldError, setFieldError] = useState("");
  const [fieldData, setFieldData] = useState({
    label: "",
    name: "",
    type: "text",
    is_required: false,
    options: ""
  });

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
      const url = isEditing ? `/api/activity-form-update?id=${router.query.id}` : "/api/activity-forms";
      const method = "POST";

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
      if (!saveError) setSaveConfirmOpen(false);
    }
  };

  const initiateAddField = () => {
    setFieldError("");
    if (!fieldData.label.trim() || !fieldData.name.trim() || !fieldData.type) {
      setFieldError("Please fill out Label, Name, and Type.");
      return;
    }
    
    if ((fieldData.type === 'dropdown' || fieldData.type === 'radio') && (!fieldData.options || !fieldData.options.trim())) {
      setFieldError("Please provide options for Dropdown/Radio fields (comma separated).");
      return;
    }

    setAddFieldConfirmOpen(true);
  };

  const confirmAddField = async () => {
    setIsAddingField(true);
    setAddFieldConfirmOpen(false);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`/api/activity-form-add-field?id=${router.query.id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          label: fieldData.label,
          name: fieldData.name,
          type: fieldData.type,
          is_required: fieldData.is_required ? 1 : 0,
          options: fieldData.type === 'dropdown' || fieldData.type === 'radio' ? fieldData.options : ""
        })
      });

      if (!response.ok) throw new Error("Failed to add field");

      const addedField = await response.json();

      // Optimistically add to list (reloading details might be better, but this is faster)
      setFields(prev => [...prev, {
        ...fieldData,
        is_required: fieldData.is_required ? 1 : 0
      }]);

      setFieldData({ label: "", name: "", type: "text", is_required: false, options: "" });
      setIsFieldModalOpen(false);
    } catch (err) {
      console.error("Error adding field:", err);
      setFieldError("An error occurred while adding the field.");
    } finally {
      setIsAddingField(false);
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

          {/* Fields Section (Only visible when Edit mode & form exists) */}
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-800">Form Fields</h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Manage fields attached to this activity form</p>
                </div>
                <button
                  onClick={() => setIsFieldModalOpen(true)}
                  className="px-4 py-2 text-sm font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-xl transition-colors shadow-sm"
                >
                  + Add New Field
                </button>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {fields.length > 0 ? (
                    fields.map((field, idx) => {
                      const isReq = field.is_required === 1 || field.is_required === true;
                      return (
                        <div key={idx} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-slate-800 capitalize">{field.label || field.name}</span>
                              {isReq && <span className="text-xs font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded-md">Required</span>}
                              <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full border border-slate-200">{field.type}</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1.5 font-medium">Internal Name: <span className="text-slate-700">{field.name}</span></p>
                            {(field.options && field.options.length > 0) && (
                              <p className="text-xs text-slate-500 mt-0.5 font-medium">Options: <span className="text-slate-700">{Array.isArray(field.options) ? field.options.join(", ") : field.options}</span></p>
                            )}
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-center py-6 text-slate-400 text-sm font-medium">
                      No fields have been added yet
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

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

        {/* Add Field Modal */}
        {isFieldModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => !isAddingField && setIsFieldModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden z-10 border border-slate-200"
            >
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Add New Field</h3>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">Define a new property for this form</p>
                </div>
                <button onClick={() => !isAddingField && setIsFieldModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 transition-colors">
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">Label <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={fieldData.label}
                      onChange={(e) => setFieldData(p => ({ ...p, label: e.target.value, name: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '_') }))}
                      placeholder="e.g. Full Name"
                      className="w-full border border-slate-300 rounded-xl px-4 py-2 text-sm focus:border-tech-blue-500 focus:ring-2 focus:ring-tech-blue-500/20 transition-all font-medium text-slate-800 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">Internal Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={fieldData.name}
                      onChange={(e) => setFieldData(p => ({ ...p, name: e.target.value.replace(/[^a-z0-9_]/g, '') }))}
                      placeholder="e.g. full_name"
                      className="w-full border border-slate-300 rounded-xl px-4 py-2 text-sm focus:border-tech-blue-500 focus:ring-2 focus:ring-tech-blue-500/20 transition-all font-medium text-slate-800 outline-none bg-slate-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">Field Type <span className="text-red-500">*</span></label>
                    <select
                      value={fieldData.type}
                      onChange={(e) => setFieldData(p => ({ ...p, type: e.target.value }))}
                      className="w-full border border-slate-300 rounded-xl px-4 py-2 text-sm focus:border-tech-blue-500 focus:ring-2 focus:ring-tech-blue-500/20 transition-all font-medium text-slate-800 outline-none appearance-none"
                      style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right .5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                    >
                      <option value="text">Text (Short)</option>
                      <option value="textarea">Textarea (Long)</option>
                      <option value="number">Number</option>
                      <option value="date">Date</option>
                      <option value="dropdown">Dropdown Select</option>
                      <option value="radio">Radio Buttons</option>
                      <option value="checkbox">Checkbox</option>
                      <option value="file">File Upload</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">Required?</label>
                    <label className="flex items-center gap-2 mt-2.5 cursor-pointer">
                      <div className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${fieldData.is_required ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                        <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${fieldData.is_required ? 'translate-x-4' : 'translate-x-0'}`} />
                      </div>
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={fieldData.is_required}
                        onChange={(e) => setFieldData(p => ({ ...p, is_required: e.target.checked }))}
                      />
                      <span className="text-sm font-bold text-slate-600 select-none">{fieldData.is_required ? 'Yes' : 'No'}</span>
                    </label>
                  </div>
                </div>

                <AnimatePresence>
                  {(fieldData.type === 'dropdown' || fieldData.type === 'radio') && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">Options List</label>
                      <input
                        type="text"
                        value={fieldData.options}
                        onChange={(e) => setFieldData(p => ({ ...p, options: e.target.value }))}
                        placeholder="e.g. Option 1, Option 2, Option 3 (comma separated)"
                        className="w-full border border-slate-300 rounded-xl px-4 py-2 text-sm focus:border-tech-blue-500 focus:ring-2 focus:ring-tech-blue-500/20 transition-all font-medium text-slate-800 outline-none"
                      />
                      <p className="text-[11px] font-medium text-slate-400 mt-1">Separate options using commas.</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {fieldError && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="text-xs font-bold text-red-500 bg-red-50 p-2 rounded-lg border border-red-100"
                    >
                      {fieldError}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/40 flex items-center justify-end gap-3">
                <button
                  disabled={isAddingField}
                  onClick={() => setIsFieldModalOpen(false)}
                  className="px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  disabled={isAddingField}
                  onClick={initiateAddField}
                  className="px-4 py-2 text-sm font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-xl shadow-sm transition-all shadow-slate-900/10 disabled:opacity-50 flex items-center gap-2"
                >
                  {isAddingField ? (
                    <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Adding...</>
                  ) : "Add Field"}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Add Field Confirm Modal */}
        {addFieldConfirmOpen && (
          <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
              onClick={() => setAddFieldConfirmOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden z-10"
            >
              <div className="p-6 text-center flex flex-col items-center">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4">
                  <FilePlus2 size={28} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Add Field?</h3>
                <p className="text-sm font-medium text-slate-500 mb-6 px-2">Are you sure you want to add the field <span className="font-bold text-slate-700">"{fieldData.label}"</span> to this form?</p>

                <div className="flex gap-3 justify-center w-full">
                  <button disabled={isAddingField} onClick={() => setAddFieldConfirmOpen(false)} className="flex-1 px-4 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50">
                    Cancel
                  </button>
                  <button disabled={isAddingField} onClick={confirmAddField} className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-colors active:scale-95 disabled:opacity-50 flex justify-center items-center gap-2">
                    Confirm Add
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
