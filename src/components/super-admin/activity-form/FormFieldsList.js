import { motion } from "framer-motion";
import { X } from "lucide-react";

export default function FormFieldsList({ 
  isEditing, 
  fields, 
  setIsFieldModalOpen, 
  initiateDeleteField 
}) {
  if (!isEditing) return null;

  return (
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
                <div key={idx} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between group">
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
                  {field.id && (
                    <button
                      onClick={() => initiateDeleteField(field)}
                      className="w-9 h-9 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                      title="Delete Field"
                    >
                      <X size={18} />
                    </button>
                  )}
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
  );
}
