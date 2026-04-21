import { motion, AnimatePresence } from "framer-motion";
import { Save } from "lucide-react";

export default function ActivityFormCard({ 
  isEditing, 
  formName, 
  setFormName, 
  description, 
  setDescription, 
  formError, 
  handleInitialSubmit, 
  isSubmitting,
  router
}) {
  return (
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
            className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all text-slate-700 font-medium ${formError && formError.includes('Form Name') ? 'border-red-400 focus:ring-2 focus:ring-red-400/20' : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'}`}
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
            className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-700 font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-y"
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
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-sm transition-all shadow-blue-500/20"
        >
          <Save size={15} /> {isEditing ? "Save Changes" : "Create Form"}
        </button>
      </div>
    </motion.div>
  );
}
