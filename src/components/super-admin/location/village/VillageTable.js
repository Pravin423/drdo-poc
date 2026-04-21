import { Search, Filter, Home, Eye, Edit, X, ChevronLeft, ChevronRight, MapPin, Map, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRef } from "react";

const ROWS_PER_PAGE = 10;

export default function VillageTable({
    villages,
    filteredVillages,
    isLoading,
    searchQuery,
    onSearchChange,
    // Pagination
    currentPage,
    onPageChange,
    // Filters
    districts,
    talukasOptions,
    selectedDistrict,
    selectedTaluka,
    onSelectDistrict,
    onSelectTaluka,
    filterOpen,
    onToggleFilter,
    // Row actions
    onView,
    onEdit,
    onDelete,
}) {
    const filterRef = useRef(null);

    const totalPages = Math.ceil(filteredVillages.length / ROWS_PER_PAGE);
    const paginatedVillages = filteredVillages.slice(
        (currentPage - 1) * ROWS_PER_PAGE,
        currentPage * ROWS_PER_PAGE
    );

    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)
        .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
        .reduce((acc, p, idx, arr) => {
            if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
            acc.push(p);
            return acc;
        }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px] flex flex-col"
        >
            {/* Controls Header */}
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
                <div className="relative max-w-md w-full">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search villages by name, taluka, district, or code..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-tech-blue-500/20 focus:border-tech-blue-500 transition-all font-medium"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    {/* Active filter chips */}
                    {selectedDistrict && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-xs font-semibold"
                        >
                            <MapPin size={12} />
                            {selectedDistrict.name}
                            <button onClick={() => { onSelectDistrict(null); onSelectTaluka(null); }} className="ml-0.5 text-blue-500 hover:text-blue-800 transition-colors" title="Clear district filter">
                                <X size={12} />
                            </button>
                        </motion.div>
                    )}
                    {selectedTaluka && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-xs font-semibold"
                        >
                            <Map size={12} />
                            {selectedTaluka.name}
                            <button onClick={() => onSelectTaluka(null)} className="ml-0.5 text-emerald-500 hover:text-emerald-800 transition-colors" title="Clear taluka filter">
                                <X size={12} />
                            </button>
                        </motion.div>
                    )}

                    {/* Dual filter dropdown */}
                    <div ref={filterRef} className="relative z-10 ml-auto sm:ml-0">
                        <button
                            onClick={onToggleFilter}
                            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl border transition-all shadow-sm ${
                                selectedDistrict || selectedTaluka
                                    ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                            }`}
                        >
                            <Filter size={16} />
                            Filters
                            <ChevronDown size={14} className={`transition-transform duration-200 ${filterOpen ? "rotate-180" : ""}`} />
                        </button>

                        <AnimatePresence>
                            {filterOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute right-0 top-full mt-2 w-[520px] bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden p-4 grid grid-cols-2 gap-4 origin-top-right z-50"
                                >
                                    {/* District column */}
                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 px-2">1. Select District</h4>
                                        <div className="space-y-1 max-h-48 overflow-y-auto pr-2">
                                            <button
                                                onClick={() => { onSelectDistrict(null); onSelectTaluka(null); onToggleFilter(); }}
                                                className={`w-full text-left px-3 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center justify-between ${!selectedDistrict ? "bg-blue-50 text-blue-700" : "text-slate-700 hover:bg-slate-50"}`}
                                            >
                                                All Districts
                                                {!selectedDistrict && <span className="w-2 h-2 rounded-full bg-blue-500" />}
                                            </button>
                                            {districts.map((district) => (
                                                <button
                                                    key={district.id}
                                                    onClick={() => { onSelectDistrict(district); onSelectTaluka(null); }}
                                                    className={`w-full text-left px-3 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center justify-between ${selectedDistrict?.id === district.id ? "bg-blue-50 text-blue-700" : "text-slate-700 hover:bg-slate-50"}`}
                                                >
                                                    {district.name}
                                                    {selectedDistrict?.id === district.id && <span className="w-2 h-2 rounded-full bg-blue-500" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Taluka column */}
                                    <div className="border-l border-slate-100 pl-4">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 px-2">2. Select Taluka</h4>
                                        <div className="space-y-1 max-h-48 overflow-y-auto pr-2">
                                            <button
                                                onClick={() => { onSelectTaluka(null); onToggleFilter(); }}
                                                className={`w-full text-left px-3 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center justify-between ${!selectedTaluka ? "bg-emerald-50 text-emerald-700" : "text-slate-700 hover:bg-slate-50"}`}
                                            >
                                                All Talukas
                                                {!selectedTaluka && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
                                            </button>
                                            {talukasOptions.map((taluka) => (
                                                <button
                                                    key={taluka.id}
                                                    onClick={() => { onSelectTaluka(taluka); onToggleFilter(); }}
                                                    className={`w-full text-left px-3 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center justify-between ${selectedTaluka?.id === taluka.id ? "bg-emerald-50 text-emerald-700" : "text-slate-700 hover:bg-slate-50"}`}
                                                >
                                                    {taluka.name}
                                                    {selectedTaluka?.id === taluka.id && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/80 border-b border-slate-100">
                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-transparent">ID</th>
                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-transparent">Village Name</th>
                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-transparent">Taluka Name</th>
                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-transparent">District Name</th>
                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-transparent">Census Code</th>
                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 text-right bg-transparent">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {isLoading ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center justify-center text-slate-400">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-500 mb-3" />
                                        <p className="text-sm font-semibold">Loading villages...</p>
                                    </div>
                                </td>
                            </tr>
                        ) : paginatedVillages.length > 0 ? (
                            paginatedVillages.map((village) => (
                                <tr key={village.id} className="hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0">
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                                            {villages.findIndex((v) => v.id === village.id) + 1}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4"><p className="text-sm font-semibold text-slate-800">{village.name}</p></td>
                                    <td className="px-6 py-4"><span className="text-sm text-slate-600">{village.talukaName}</span></td>
                                    <td className="px-6 py-4"><span className="text-sm text-slate-600">{village.districtName}</span></td>
                                    <td className="px-6 py-4"><span className="text-sm font-mono text-slate-600">{village.censusCode}</span></td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => onView(village.id)} className="p-1.5 text-slate-400 cursor-pointer hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors" title="View Details"><Eye size={16} /></button>
                                            <button onClick={() => onEdit(village)} className="p-1.5 text-slate-400 cursor-pointer hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Edit Village"><Edit size={16} /></button>
                                            <button onClick={() => onDelete(village.id)} className="p-1.5 text-slate-400 cursor-pointer hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Delete Village"><X size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center justify-center text-slate-400">
                                        <Home size={32} className="mb-3 opacity-50" />
                                        <p className="text-sm font-semibold">No villages found matching your search.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Footer */}
            <div className="px-6 py-4 bg-slate-50 mt-auto border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
                <p className="text-xs font-semibold text-slate-500">
                    Showing{" "}
                    <span className="text-slate-900">{Math.min((currentPage - 1) * ROWS_PER_PAGE + 1, filteredVillages.length)}</span>
                    {" "}–{" "}
                    <span className="text-slate-900">{Math.min(currentPage * ROWS_PER_PAGE, filteredVillages.length)}</span>
                    {" "}of{" "}
                    <span className="text-slate-900">{filteredVillages.length}</span> records
                </p>
                <div className="flex items-center gap-1">
                    <button onClick={() => onPageChange((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-1.5 text-slate-500 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:text-slate-300 disabled:cursor-not-allowed transition-colors">
                        <ChevronLeft size={16} />
                    </button>
                    {pageNumbers.map((item, idx) =>
                        item === "..." ? (
                            <span key={`ellipsis-${idx}`} className="px-2 text-xs text-slate-400 font-bold">…</span>
                        ) : (
                            <button
                                key={item}
                                onClick={() => onPageChange(item)}
                                className={`min-w-[32px] h-8 px-2 text-xs font-bold rounded-lg border transition-colors ${currentPage === item ? "bg-tech-blue-600 text-white border-tech-blue-600 shadow-sm" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"}`}
                            >
                                {item}
                            </button>
                        )
                    )}
                    <button onClick={() => onPageChange((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0} className="p-1.5 text-slate-500 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:text-slate-300 disabled:cursor-not-allowed transition-colors">
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
