import { motion } from "framer-motion";
import { Download, Plus, Search } from "lucide-react";

export default function VerticalHeader({ searchQuery, setSearchQuery, onAddClick }) {
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
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all shadow-sm">
                        <Download size={16} /> Export CSV
                    </button>
                    <button
                        onClick={onAddClick}
                        className="flex items-center gap-2 px-4 py-2 bg-[#3b52ab] text-white rounded-xl text-sm font-semibold hover:bg-[#2e4085] transition-all shadow-sm"
                    >
                        <Plus size={16} /> Add Vertical
                    </button>
                </div>
            </motion.header>

            {/* Search Bar */}
            <div className="relative group w-full sm:w-[320px]">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search size={18} className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                    type="text"
                    placeholder="Search verticals..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full border border-slate-200 rounded-2xl pl-11 pr-4 py-2.5 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none bg-white font-medium text-slate-700"
                />
            </div>
        </>
    );
}
