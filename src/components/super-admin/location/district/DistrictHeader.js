import { Download, Plus } from "lucide-react";
import { motion } from "framer-motion";

export default function DistrictHeader({ onExport, onAddClick }) {
    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
            <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
                    District{" "}
                    <span className="bg-gradient-to-b from-[#3b52ab] to-[#1a2e7a] bg-clip-text text-transparent">
                        Management
                    </span>
                </h1>
                <p className="text-slate-500 font-medium">
                    Manage and monitor administrative districts across Goa.
                </p>
            </div>

            <div className="flex items-center gap-3">
                <button
                    onClick={onExport}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all shadow-sm"
                >
                    <Download size={16} /> Export
                </button>
                <button
                    onClick={onAddClick}
                    className="flex items-center gap-2 px-4 py-2 bg-tech-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-tech-blue-700 transition-all shadow-md shadow-tech-blue-500/20 active:scale-95"
                >
                    <Plus size={16} /> Add District
                </button>
            </div>
        </motion.header>
    );
}
