import ProtectedRoute from "../../../components/ProtectedRoute";
import DashboardLayout from "../../../components/DashboardLayout";
import { motion } from "framer-motion";
import { FilePlus2, Type, ToggleLeft, List, Hash, AlignLeft, ArrowLeft, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const FIELD_TYPES = [
  { type: "text",     label: "Short Text",   icon: Type },
  { type: "textarea", label: "Long Text",    icon: AlignLeft },
  { type: "number",   label: "Number",       icon: Hash },
  { type: "select",   label: "Dropdown",     icon: List },
  { type: "checkbox", label: "Checkbox",     icon: ToggleLeft },
];

export default function CreateForm() {
  const router = useRouter();
  const [formName, setFormName] = useState("");
  const [description, setDescription] = useState("");
  const [fields, setFields] = useState([]);
  const isEditing = Boolean(router.query.id);

  useEffect(() => {
    if (router.query.id) {
      const saved = JSON.parse(localStorage.getItem("activity_forms") || "[]");
      const toEdit = saved.find((f) => f.id === router.query.id);
      if (toEdit) {
        setFormName(toEdit.title);
        setDescription(toEdit.description || "");
        setFields(toEdit.customFields || []);
      }
    }
  }, [router.query.id]);

  const addField = (type) => {
    setFields((prev) => [
      ...prev,
      { id: Date.now(), type, label: "", placeholder: "", required: false },
    ]);
  };

  const updateField = (id, key, value) => {
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [key]: value } : f))
    );
  };

  const removeField = (id) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
  };

  const handleSubmit = () => {
    if (!formName.trim()) return;
    
    const saved = JSON.parse(localStorage.getItem("activity_forms") || "[]");
    
    if (isEditing) {
      const updated = saved.map(f => {
        if (f.id === router.query.id) {
          return { ...f, title: formName, description, customFields: fields, fields: fields.length };
        }
        return f;
      });
      localStorage.setItem("activity_forms", JSON.stringify(updated));
    } else {
      const newForm = {
        id: Date.now().toString(),
        title: formName,
        description,
        customFields: fields,
        fields: fields.length,
        submissions: 0,
        createdAt: new Date().toISOString().split("T")[0],
        status: "Active"
      };
      localStorage.setItem("activity_forms", JSON.stringify([newForm, ...saved]));
    }
    
    router.push("/dashboard/activity-forms/all");
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
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Form Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Monthly Field Visit Report"
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of what this form is for"
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all resize-y"
                />
              </div>

            </div>

            {/* Card Footer — Buttons */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/40 flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-slate-600 hover:bg-slate-700 rounded-lg transition-all"
              >
                <ArrowLeft size={15} /> Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={!formName.trim()}
                className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all"
              >
                <Save size={15} /> {isEditing ? "Save Changes" : "Create Form"}
              </button>
            </div>
          </motion.div>

          {/* Field Type Picker */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
          >
            <p className="text-sm font-semibold text-slate-700 mb-4">Add Fields to Form</p>
            <div className="flex flex-wrap gap-2">
              {FIELD_TYPES.map(({ type, label, icon: Icon }) => (
                <button
                  key={type}
                  onClick={() => addField(type)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-tech-blue-700 bg-tech-blue-50 border border-tech-blue-100 rounded-xl hover:bg-tech-blue-100 transition-all"
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Dynamic Fields */}
          {fields.length > 0 && (
            <div className="space-y-3">
              {fields.map((field, idx) => (
                <motion.div
                  key={field.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Field {idx + 1} — {field.type}
                    </span>
                    <button
                      onClick={() => removeField(field.id)}
                      className="text-xs font-semibold text-red-500 hover:text-red-700 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Label</label>
                      <input
                        type="text"
                        value={field.label}
                        onChange={(e) => updateField(field.id, "label", e.target.value)}
                        placeholder="Field label"
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/30 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Placeholder</label>
                      <input
                        type="text"
                        value={field.placeholder}
                        onChange={(e) => updateField(field.id, "placeholder", e.target.value)}
                        placeholder="Hint text"
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/30 transition-all"
                      />
                    </div>
                  </div>
                  <label className="flex items-center gap-2 mt-3 text-xs font-semibold text-slate-600 cursor-pointer w-fit">
                    <input
                      type="checkbox"
                      checked={field.required}
                      onChange={(e) => updateField(field.id, "required", e.target.checked)}
                      className="accent-blue-600"
                    />
                    Required field
                  </label>
                </motion.div>
              ))}
            </div>
          )}

        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
