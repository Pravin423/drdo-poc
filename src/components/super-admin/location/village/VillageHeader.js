import { Download, Plus, UploadCloud } from "lucide-react";
import { motion } from "framer-motion";

export default function VillageHeader({ onExport, onImportClick, onAddClick, isViewOnly }) {
    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
            <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
                    Village{" "}
                    <span className="bg-gradient-to-br from-[#3b52ab] via-[#1a2e7a] to-[#0f172a] bg-clip-text text-transparent">
                        Management
                    </span>
                </h1>
                <p className="text-slate-500 font-medium text-[15px]">
                    Manage and monitor villages across all Goa talukas.
                </p>
            </div>

            <div className="flex items-center gap-3">
                {!isViewOnly && (
                    <button
                        onClick={onImportClick}
                        className="flex items-center gap-2.5 px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-2xl text-sm font-bold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm active:scale-95 group"
                    >
                        <UploadCloud size={16} className="text-indigo-500 group-hover:scale-110 transition-transform" /> 
                        Bulk Import
                    </button>
                )}
                <button
                    onClick={onExport}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-2xl text-sm font-bold hover:bg-slate-50 hover:text-slate-800 transition-all shadow-sm"
                >
                    <Download size={16} /> Export
                </button>
                {!isViewOnly && (
                    <button
                        onClick={onAddClick}
                        className="flex items-center gap-2.5 px-6 py-2.5 bg-gradient-to-r from-[#1a2e7a] to-[#2a44a1] text-white rounded-2xl text-sm font-bold hover:shadow-xl hover:shadow-indigo-900/20 transition-all active:scale-[0.98] group"
                    >
                        <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" /> 
                        Add Village
                    </button>
                )}
            </div>
        </motion.header>
    );
}

