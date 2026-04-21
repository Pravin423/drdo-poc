import { motion } from "framer-motion";

export default function FormStats({ form, toggleStatus, isUpdatingStatus }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.4 }}
      className="grid grid-cols-3 gap-4 pb-2"
    >
       <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col justify-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Status</p>
          <div className="flex items-center gap-3">
              <button 
                  onClick={toggleStatus} 
                  disabled={isUpdatingStatus}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${form.status === 1 ? 'bg-emerald-500' : 'bg-slate-300'} ${isUpdatingStatus ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                  <span 
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.status === 1 ? 'translate-x-6' : 'translate-x-1'}`} 
                  />
              </button>
              <p className={`text-sm font-semibold tracking-wide ${form.status === 1 ? 'text-emerald-700' : 'text-slate-600'} ${isUpdatingStatus ? 'opacity-50' : ''}`}>
                  {form.status === 1 ? 'Active' : 'Inactive'}
              </p>
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
  );
}
