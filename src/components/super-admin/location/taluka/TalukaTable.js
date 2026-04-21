import { Search, Filter, Map, Eye, Edit, X, ChevronLeft, ChevronRight, MapPin, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRef } from "react";

export default function TalukaTable({
    talukas,
    filteredTalukas,
    isLoading,
    searchQuery,
    onSearchChange,
    // District filter props
    districts,
    selectedDistrict,
    onSelectDistrict,
    filterOpen,
    onToggleFilter,
    // Row actions
    onView,
    onEdit,
    onDelete,
}) {
    const filterRef = useRef(null);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px] flex flex-col"
        >
            {/* Table Controls Header */}
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
                <div className="relative max-w-md w-full">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search talukas by name, code, or district..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-tech-blue-500/20 focus:border-tech-blue-500 transition-all font-medium"
                    />
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    {/* Active filter chip */}
                    {selectedDistrict && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-xs font-semibold"
                        >
                            <MapPin size={12} />
                            {selectedDistrict.name}
                            <button
                                onClick={() => onSelectDistrict(null)}
                                className="ml-0.5 text-blue-500 hover:text-blue-800 transition-colors"
                                title="Clear filter"
                            >
                                <X size={12} />
                            </button>
                        </motion.div>
                    )}

                    {/* Filter dropdown */}
                    <div ref={filterRef} className="relative">
                        <button
                            onClick={onToggleFilter}
                            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl border transition-all shadow-sm ${
                                selectedDistrict
                                    ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                            }`}
                        >
                            <Filter size={16} />
                            Filter by District
                            <ChevronDown
                                size={14}
                                className={`transition-transform duration-200 ${filterOpen ? "rotate-180" : ""}`}
                            />
                        </button>

                        <AnimatePresence>
                            {filterOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute right-0 top-full mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden"
                                >
                                    <button
                                        onClick={() => onSelectDistrict(null)}
                                        className={`w-full text-left px-4 py-3 text-sm font-semibold transition-colors flex items-center justify-between ${
                                            !selectedDistrict ? "bg-blue-50 text-blue-700" : "text-slate-700 hover:bg-slate-50"
                                        }`}
                                    >
                                        All Districts
                                        {!selectedDistrict && <span className="w-2 h-2 rounded-full bg-blue-500" />}
                                    </button>
                                    <div className="border-t border-slate-100" />
                                    {districts.length === 0 ? (
                                        <p className="px-4 py-3 text-xs text-slate-400 font-medium">Loading districts...</p>
                                    ) : (
                                        districts.map((district) => (
                                            <button
                                                key={district.id}
                                                onClick={() => onSelectDistrict(district)}
                                                className={`w-full text-left px-4 py-3 text-sm font-semibold transition-colors flex items-center justify-between ${
                                                    selectedDistrict?.id === district.id
                                                        ? "bg-blue-50 text-blue-700"
                                                        : "text-slate-700 hover:bg-slate-50"
                                                }`}
                                            >
                                                {district.name}
                                                {selectedDistrict?.id === district.id && (
                                                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                                                )}
                                            </button>
                                        ))
                                    )}
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
                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-transparent">Name</th>
                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-transparent">Census Code</th>
                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-transparent">District Name</th>
                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 text-right bg-transparent">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {isLoading ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center justify-center text-slate-400">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-500 mb-3" />
                                        <p className="text-sm font-semibold">Loading talukas...</p>
                                    </div>
                                </td>
                            </tr>
                        ) : filteredTalukas.length > 0 ? (
                            filteredTalukas.map((taluka) => (
                                <tr
                                    key={taluka.id}
                                    className="hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
                                >
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                                            {talukas.findIndex((t) => t.id === taluka.id) + 1}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-semibold text-slate-800">{taluka.name}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-slate-600">{taluka.censusCode}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-slate-600">{taluka.districtName}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => onView(taluka.id)}
                                                className="p-1.5 text-slate-400 cursor-pointer hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                                                title="View Details"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button
                                                onClick={() => onEdit(taluka)}
                                                className="p-1.5 text-slate-400 cursor-pointer hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                                title="Edit Taluka"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => onDelete(taluka.id)}
                                                className="p-1.5 text-slate-400 cursor-pointer hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                title="Delete Taluka"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center justify-center text-slate-400">
                                        <Map size={32} className="mb-3 opacity-50" />
                                        <p className="text-sm font-semibold">No talukas found matching your search.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Table Footer */}
            <div className="px-6 py-4 bg-slate-50 mt-auto border-t border-slate-100 flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-500">
                    Showing all <span className="text-slate-900">{filteredTalukas.length}</span> records
                </p>
                <div className="flex gap-2">
                    <button disabled className="p-1.5 text-slate-300 rounded-lg border border-slate-200 bg-white cursor-not-allowed">
                        <ChevronLeft size={16} />
                    </button>
                    <button disabled className="p-1.5 text-slate-300 rounded-lg border border-slate-200 bg-white cursor-not-allowed">
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
