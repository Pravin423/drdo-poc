import { Search, Filter, Map, Eye, Edit, X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function DistrictTable({
    districts,
    filteredDistricts,
    isLoading,
    searchQuery,
    onSearchChange,
    onView,
    onEdit,
    onDelete,
}) {
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
                        placeholder="Search districts by name or census code..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-tech-blue-500/20 focus:border-tech-blue-500 transition-all font-medium"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm">
                        <Filter size={16} /> Filters
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/80 border-b border-slate-100">
                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-transparent">ID</th>
                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-transparent">District Name</th>
                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-transparent">Census Code</th>
                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 text-right bg-transparent">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {isLoading ? (
                            <tr>
                                <td colSpan="4" className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center justify-center text-slate-400">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-500 mb-3" />
                                        <p className="text-sm font-semibold">Loading districts...</p>
                                    </div>
                                </td>
                            </tr>
                        ) : filteredDistricts.length > 0 ? (
                            filteredDistricts.map((district) => (
                                <tr
                                    key={district.id}
                                    className="hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
                                >
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                                            {districts.findIndex((d) => d.id === district.id) + 1}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-semibold text-slate-800">{district.name}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-slate-600">{district.censusCode}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => onView(district)}
                                                className="p-1.5 text-slate-400 cursor-pointer hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                                                title="View Details"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button
                                                onClick={() => onEdit(district)}
                                                className="p-1.5 text-slate-400 cursor-pointer hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                                title="Edit District"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => onDelete(district.id)}
                                                className="p-1.5 text-slate-400 cursor-pointer hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                title="Delete District"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center justify-center text-slate-400">
                                        <Map size={32} className="mb-3 opacity-50" />
                                        <p className="text-sm font-semibold">No districts found matching your search.</p>
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
                    Showing all <span className="text-slate-900">{filteredDistricts.length}</span> records
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
