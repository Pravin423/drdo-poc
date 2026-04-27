import React from "react";
import { Search, Filter, Eye, Edit, X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Universal DataTable Component
 * 
 * @param {Array} columns - Array of column definitions: { header: string, key: string, render?: function, align?: 'left'|'right'|'center', width?: string }
 * @param {Array} data - Array of data objects
 * @param {boolean} isLoading - Loading state
 * @param {Object} searchProps - { placeholder: string, value: string, onChange: function }
 * @param {Object} filterProps - { onClick: function, label: string, active: boolean }
 * @param {Array} actions - Array of action definitions: { icon: Icon, onClick: function, title: string, className: string }
 * @param {Object} footerProps - { totalRecords: number, showPagination: boolean, onPageChange: function }
 * @param {Object} emptyState - { icon: Icon, message: string }
 */
export default function DataTable({
    columns = [],
    data = [],
    isLoading = false,
    searchProps = null,
    filterProps = null,
    headerActions = null, // New: Allows passing custom components to the header
    actions = [],
    footerProps = {},
    emptyState = null,
    variant = "default",
}) {
    const { 
        totalRecords = 0, 
        showPagination = true, 
        onPageChange = () => { },
        currentPage = 1,
        totalPages = 1,
        startIndex = 0,
        endIndex = 0
    } = footerProps;

    // Helper to generate page numbers with ellipsis
    const getPageNumbers = () => {
        if (!totalPages || totalPages <= 1) return [];
        return Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
            .reduce((acc, p, idx, arr) => {
                if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                acc.push(p);
                return acc;
            }, []);
    };

    const pageNumbers = getPageNumbers();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px] flex flex-col"
        >
            {/* Header Controls */}
            {(searchProps || filterProps || headerActions) && (
                <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
                    {searchProps && (
                        <div className="relative group max-w-[320px] w-full">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search size={18} className="text-slate-400 group-focus-within:text-tech-blue-500 transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder={searchProps.placeholder || "Search..."}
                                value={searchProps.value}
                                onChange={(e) => searchProps.onChange(e.target.value)}
                                className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-tech-blue-500/10 focus:border-tech-blue-500 transition-all font-medium text-slate-700 shadow-sm"
                            />
                        </div>
                    )}
                    <div className="flex items-center gap-2 flex-wrap">
                        {headerActions}
                        {filterProps && (
                            <button 
                                onClick={filterProps.onClick}
                                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border rounded-xl transition-all shadow-sm ${
                                    filterProps.active 
                                    ? "bg-tech-blue-50 border-tech-blue-200 text-tech-blue-700" 
                                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                }`}
                            >
                                <Filter size={16} /> {filterProps.label || "Filters"}
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Table Area */}
            <div className="flex-1 overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/80 border-b border-slate-100">
                            {columns.map((col, idx) => (
                                <th
                                    key={idx}
                                    className={`px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-transparent ${
                                        col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"
                                    }`}
                                    style={{ width: col.width }}
                                >
                                    {col.header}
                                </th>
                            ))}
                            {actions.length > 0 && (
                                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 text-right bg-transparent">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {isLoading ? (
                            <tr>
                                <td colSpan={columns.length + (actions.length > 0 ? 1 : 0)} className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center justify-center text-slate-400">
                                        <Loader2 size={32} className="animate-spin mb-3 text-slate-500" />
                                        <p className="text-sm font-semibold">Loading data...</p>
                                    </div>
                                </td>
                            </tr>
                        ) : data.length > 0 ? (
                            data.map((row, rowIdx) => (
                                <tr
                                    key={row.id || rowIdx}
                                    className="hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
                                >
                                    {columns.map((col, colIdx) => (
                                        <td
                                            key={colIdx}
                                            className={`px-6 py-4 ${
                                                col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"
                                            }`}
                                        >
                                            {col.render ? col.render(row[col.key], row, rowIdx) : (
                                                <span className="text-sm text-slate-600 font-medium">{row[col.key]}</span>
                                            )}
                                        </td>
                                    ))}
                                    {actions.length > 0 && (
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {actions.map((action, actionIdx) => {
                                                    const Icon = action.icon;
                                                    const isVisible = typeof action.show === 'function' ? action.show(row) : action.show !== false;
                                                    if (!isVisible) return null;
                                                    
                                                    return (
                                                        <button
                                                            key={actionIdx}
                                                            onClick={() => action.onClick(row)}
                                                            className={`p-1.5 rounded-md transition-colors text-slate-400 ${action.className || "hover:text-slate-600 hover:bg-slate-100"}`}
                                                            title={action.title}
                                                        >
                                                            <Icon size={16} />
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length + (actions.length > 0 ? 1 : 0)} className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center justify-center text-slate-400">
                                        {emptyState?.icon ? <emptyState.icon size={32} className="mb-3 opacity-50" /> : <Search size={32} className="mb-3 opacity-50" />}
                                        <p className="text-sm font-semibold">{emptyState?.message || "No records found matching your criteria."}</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50 mt-auto border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
                <p className="text-xs font-semibold text-slate-500">
                    {startIndex && endIndex ? (
                        <>
                            Showing <span className="text-slate-900">{startIndex}</span> – <span className="text-slate-900">{endIndex}</span> of <span className="text-slate-900">{totalRecords}</span> records
                        </>
                    ) : (
                        <>
                            Showing all <span className="text-slate-900">{totalRecords || data.length}</span> records
                        </>
                    )}
                </p>
                {showPagination && (
                    <div className="flex items-center gap-1">
                        <button 
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="p-1.5 text-slate-500 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:text-slate-300 disabled:cursor-not-allowed transition-colors"
                        >
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
                        <button 
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="p-1.5 text-slate-500 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:text-slate-300 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
