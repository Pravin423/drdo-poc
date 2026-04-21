import { motion } from "framer-motion";

export default function FieldsList({ fields }) {
  return (
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
        {fields && fields.length > 0 ? (
          fields.map((field, idx) => {
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
  );
}
