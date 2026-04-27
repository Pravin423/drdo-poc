import { motion } from "framer-motion";
import { Download, Plus } from "lucide-react";

export default function AllFormsHeader({ onOpenCreateModal, onExport, isViewOnly }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
          Activity Form{" "}
          <span className="bg-gradient-to-b from-[#3b52ab] to-[#2c4191] bg-clip-text text-transparent">
            Management
          </span>
        </h1>
        <p className="text-slate-500 font-medium">
          Design, view, and manage all dynamic data collection forms.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={onExport}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all shadow-sm"
        >
          <Download size={16} /> Export CSV
        </button>
        {!isViewOnly && (
          <button
            onClick={onOpenCreateModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-b from-[#3b52ab] to-[#1a2e7a] text-white rounded-xl text-sm font-bold hover:opacity-90 transition-all shadow-md active:scale-95 border-0"
          >
            <Plus size={18} /> Create New Form
          </button>
        )}
      </div>
    </motion.header>
  );
}
