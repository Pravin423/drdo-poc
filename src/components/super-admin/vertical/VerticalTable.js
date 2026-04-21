import { motion } from "framer-motion";
import { Edit, Eye, Search, X } from "lucide-react";

function StatusBadge({ status }) {
    return (
        <span
            className={`px-3 py-1 rounded-full text-[11px] font-bold border ${
                status
                    ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                    : "bg-slate-50 text-slate-500 border-slate-200"
            }`}
        >
            {status ? "Active" : "Inactive"}
        </span>
    );
}

const TABLE_HEADERS = [
    "ID",
    "Vertical Name",
    "Vertical Code",
    "Description",
    "Start Date",
    "End Date",
    "Created By",
    "Status",
    "Action",
];

export default function VerticalTable({ isLoading, filteredData, onView, onEdit }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px] flex flex-col"
        >
            <div className="overflow-x-auto min-h-[400px]">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50/60 border-b border-t border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-bold whitespace-nowrap">
                        <tr>
                            {TABLE_HEADERS.map((h) => (
                                <th
                                    key={h}
                                    className={`px-4 py-4 ${h === "Action" ? "text-right" : "text-left"}`}
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {isLoading ? (
                            <tr>
                                <td colSpan="9" className="px-4 py-16 text-center">
                                    <div className="flex flex-col items-center gap-3 text-slate-400">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-3" />
                                        <p className="text-sm font-semibold">Loading verticals...</p>
                                    </div>
                                </td>
                            </tr>
                        ) : filteredData.length === 0 ? (
                            <tr>
                                <td colSpan="9" className="px-4 py-16 text-center">
                                    <div className="flex flex-col items-center gap-3 text-slate-400">
                                        <Search size={36} className="opacity-30" />
                                        <p className="text-sm font-semibold">No records found</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredData.map((v, i) => (
                                <motion.tr
                                    key={v.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="hover:bg-slate-50/70 transition-colors"
                                >
                                    <td className="px-4 py-4 text-sm font-bold text-slate-500 whitespace-nowrap">
                                        {i + 1}
                                    </td>
                                    <td className="px-4 py-4">
                                        <p className="font-semibold text-slate-900 text-sm">{v.name}</p>
                                    </td>
                                    <td className="px-4 py-4 text-sm font-medium text-slate-600 whitespace-nowrap">
                                        {v.code}
                                    </td>
                                    <td
                                        className="px-4 py-4 text-sm text-slate-600 max-w-sm truncate"
                                        title={v.desc}
                                    >
                                        {v.desc}
                                    </td>
                                    <td className="px-4 py-4 text-sm font-medium text-slate-600 whitespace-nowrap">
                                        {v.start}
                                    </td>
                                    <td className="px-4 py-4 text-sm font-medium text-slate-600 whitespace-nowrap">
                                        {v.end}
                                    </td>
                                    <td className="px-4 py-4 text-sm text-slate-700 font-medium whitespace-nowrap">
                                        {v.createdBy}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <StatusBadge status={v.status} />
                                    </td>
                                    <td className="px-4 py-4 text-right whitespace-nowrap">
                                        <div className="inline-flex gap-2 items-center">
                                            <button
                                                onClick={() => onView(v)}
                                                className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                                title="View Vertical"
                                            >
                                                <Eye size={14} />
                                            </button>
                                            <button
                                                onClick={() => onEdit(v)}
                                                className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-200 transition-colors"
                                                title="Edit Vertical"
                                            >
                                                <Edit size={14} />
                                            </button>
                                            <button
                                                className="p-1.5 rounded-lg border border-red-100 bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                                                title="Delete Vertical"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
}
