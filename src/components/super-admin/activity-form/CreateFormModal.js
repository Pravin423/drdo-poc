import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, FilePlus2, Trash2, Plus, Edit2, AlertCircle } from "lucide-react";

export default function CreateFormModal({ isOpen, onClose, formId, onSaveSuccess }) {
  const [formName, setFormName] = useState("");
  const [description, setDescription] = useState("");
  const [fields, setFields] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  // Field state
  const [isAddingField, setIsAddingField] = useState(false);
  const [fieldError, setFieldError] = useState("");
  const [fieldData, setFieldData] = useState({
    label: "",
    name: "",
    type: "text",
    is_required: false,
    options: ""
  });

  const isEditing = Boolean(formId);

  useEffect(() => {
    if (isOpen && formId) {
      fetchFormDetails();
    } else if (isOpen && !formId) {
      // Reset for new form
      setFormName("");
      setDescription("");
      setFields([]);
      setFormError("");
    }
  }, [isOpen, formId]);

  const fetchFormDetails = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`/api/activity-form-details?id=${formId}`, {
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
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    setFormError("");
    if (!formName.trim()) { setFormError("Form Name is required."); return false; }
    if (formName.length < 3) { setFormError("Form Name must be at least 3 characters."); return false; }
    return true;
  };

  const handleSaveForm = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("authToken");
      const url = isEditing ? `/api/activity-form-update?id=${formId}` : "/api/activity-forms";
      
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          form_name: formName,
          description: description,
        }),
      });

      if (!response.ok) throw new Error("Failed to save form");

      const result = await response.json();
      
      // If it's a new form, we might want to stay in the modal to add fields
      // but the API usually returns the new ID.
      if (!isEditing && result.data?.id) {
        // Option 1: Close and refresh
        // Option 2: Stay and switch to editing mode
        onSaveSuccess(result.data.id);
      } else {
        onSaveSuccess(formId);
      }
      
      if (!isEditing) onClose(); // For now, close on create. User can edit later to add fields.
    } catch (error) {
      setFormError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmAddField = async () => {
    if (!fieldData.label.trim() || !fieldData.name.trim()) {
      setFieldError("Label and Name are required");
      return;
    }
    
    setIsAddingField(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`/api/activity-form-add-field?id=${formId}`, {
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
          options: fieldData.options
        })
      });

      if (!response.ok) throw new Error("Failed to add field");

      const addedField = await response.json();
      setFields(prev => [...prev, { id: addedField.data?.id || Math.random(), ...fieldData }]);
      setFieldData({ label: "", name: "", type: "text", is_required: false, options: "" });
      setFieldError("");
    } catch (err) {
      setFieldError(err.message);
    } finally {
      setIsAddingField(false);
    }
  };

  const handleDeleteField = async (fieldId) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`/api/activity-form-field-delete?id=${fieldId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        setFields(prev => prev.filter(f => f.id !== fieldId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <FilePlus2 size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">{isEditing ? "Edit Activity Form" : "Create New Activity Form"}</h3>
              <p className="text-xs text-slate-500 font-medium">{isEditing ? "Modify form details and manage fields" : "Define a new form for reporting"}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-8">
          
          {/* Section 1: Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <h4 className="text-sm font-bold text-slate-800">Basic Information</h4>
              <p className="text-xs text-slate-500 mt-1">Core details about the activity form.</p>
            </div>
            <div className="md:col-span-2 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Form Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Monthly Field Visit"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What is this form used for?"
                  rows={3}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none"
                />
              </div>
              {formError && (
                <div className="flex items-center gap-2 text-xs font-bold text-red-500 bg-red-50 p-2.5 rounded-lg border border-red-100">
                  <AlertCircle size={14} />
                  {formError}
                </div>
              )}
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section 2: Fields (Only if Editing or Saved) */}
          {isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <h4 className="text-sm font-bold text-slate-800">Form Fields</h4>
                <p className="text-xs text-slate-500 mt-1">Define the specific data points to be collected.</p>
              </div>
              <div className="md:col-span-2 space-y-6">
                
                {/* Existing Fields List */}
                <div className="space-y-3">
                  {fields.map((field, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs">
                          {idx + 1}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{field.label}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{field.type} {field.is_required ? "• Required" : ""}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDeleteField(field.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  {fields.length === 0 && (
                    <div className="text-center py-6 border-2 border-dashed border-slate-100 rounded-2xl">
                      <p className="text-xs font-bold text-slate-400">No fields added yet</p>
                    </div>
                  )}
                </div>

                {/* Add New Field Form */}
                <div className="bg-slate-50/50 border border-slate-200 rounded-2xl p-4 space-y-4">
                  <h5 className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">Add New Field</h5>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Label (e.g. Full Name)"
                      value={fieldData.label}
                      onChange={(e) => setFieldData(p => ({ ...p, label: e.target.value, name: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '_') }))}
                      className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                    />
                    <select
                      value={fieldData.type}
                      onChange={(e) => setFieldData(p => ({ ...p, type: e.target.value }))}
                      className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 bg-white"
                    >
                      <option value="text">Text</option>
                      <option value="number">Number</option>
                      <option value="date">Date</option>
                      <option value="dropdown">Dropdown</option>
                      <option value="file">File Upload</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={fieldData.is_required}
                        onChange={(e) => setFieldData(p => ({ ...p, is_required: e.target.checked }))}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                      />
                      <span className="text-xs font-bold text-slate-600">Mark as Required</span>
                    </label>
                    <button 
                      onClick={confirmAddField}
                      disabled={isAddingField}
                      className="px-4 py-1.5 bg-slate-800 text-white text-xs font-bold rounded-lg hover:bg-slate-900 transition-colors flex items-center gap-2"
                    >
                      <Plus size={14} /> Add Field
                    </button>
                  </div>
                  {fieldError && <p className="text-[10px] font-bold text-red-500">{fieldError}</p>}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-blue-50 rounded-2xl p-6 text-center border border-blue-100">
              <p className="text-sm font-bold text-blue-700">First, save the basic information to start adding fields to this form.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-white">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSaveForm}
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
          >
            {isSubmitting ? "Saving..." : <><Save size={16} /> {isEditing ? "Save Changes" : "Create Form"}</>}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
