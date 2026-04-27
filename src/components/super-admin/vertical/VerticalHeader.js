import { motion } from "framer-motion";
import { Download, Plus, Search } from "lucide-react";

export default function VerticalHeader({ searchQuery, setSearchQuery, onAddClick, onExport, isViewOnly }) {
    return (
        <>
            {/* Page Title + Actions */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
                        Vertical{" "}
                        <span className="bg-gradient-to-b from-[#3b52ab] to-[#1a2e7a] bg-clip-text text-transparent">
                            Management
                        </span>
                    </h1>
                    <p className="text-slate-500 font-medium">
                        Manage operational verticals and domains for DRDA schemes.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={onExport}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                    >
                        <Download size={16} /> Export CSV
                    </button>
                    {!isViewOnly && (
                        <button
                            onClick={onAddClick}
                            className="flex items-center gap-2 px-4 py-2 bg-[#3b52ab] text-white rounded-xl text-sm font-semibold hover:bg-[#2e4085] transition-all shadow-sm"
                        >
                            <Plus size={16} /> Add Vertical
                        </button>
                    )}
                </div>
            </motion.header>

           
        </>
    );
}
