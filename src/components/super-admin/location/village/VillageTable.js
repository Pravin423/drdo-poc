import React from "react";
import { Home, Eye, Edit, X, MapPin, Map, ChevronDown, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DataTable from "../../../common/DataTable";

const ROWS_PER_PAGE = 10;

export default function VillageTable({
    villages,
    filteredVillages,
    isLoading,
    searchQuery,
    onSearchChange,
    currentPage,
    onPageChange,
    districts,
    talukasOptions,
    selectedDistrict,
    selectedTaluka,
    onSelectDistrict,
    onSelectTaluka,
    filterOpen,
    onToggleFilter,
    onView,
    onEdit,
    onDelete,
}) {
    const totalPages = Math.ceil(filteredVillages.length / ROWS_PER_PAGE);
    const paginatedVillages = filteredVillages.slice(
        (currentPage - 1) * ROWS_PER_PAGE,
        currentPage * ROWS_PER_PAGE
    );

    // Define columns for the universal table
    const columns = [
        {
            header: "ID",
            key: "id",
            render: (_, village) => (
                <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                    {villages.findIndex((v) => v.id === village.id) + 1}
                </span>
            )
        },
        {
            header: "Village Name",
            key: "name",
            render: (name) => (
                <p className="text-sm font-semibold text-slate-800">{name}</p>
            )
        },
        {
            header: "Taluka Name",
            key: "talukaName",
            render: (name) => (
                <span className="text-sm text-slate-600">{name}</span>
            )
        },
        {
            header: "District Name",
            key: "districtName",
            render: (name) => (
                <span className="text-sm text-slate-600">{name}</span>
            )
        },
        {
            header: "Census Code",
            key: "censusCode",
            render: (code) => (
                <span className="text-sm font-mono text-slate-600">{code}</span>
            )
        }
    ];

    // Define actions for the universal table
    const actions = [
        {
            icon: Eye,
            onClick: (village) => onView(village.id),
            title: "View Details",
            className: "hover:text-emerald-600 hover:bg-emerald-50"
        },
        {
            icon: Edit,
            onClick: onEdit,
            title: "Edit Village",
            className: "hover:text-blue-600 hover:bg-blue-50"
        },
        {
            icon: X,
            onClick: (village) => onDelete(village.id),
            title: "Delete Village",
            className: "hover:text-red-600 hover:bg-red-50"
        }
    ];

    // Custom header actions for VillageTable (Complex Filter)
    const headerActions = (
        <>
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

            <div className="relative z-10">
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
                                <div className="space-y-1 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
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
                                <div className="space-y-1 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
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
        </>
    );

    return (
        <DataTable
            columns={columns}
            data={paginatedVillages}
            isLoading={isLoading}
            searchProps={{
                placeholder: "Search villages by name, taluka, district, or code...",
                value: searchQuery,
                onChange: onSearchChange
            }}
            headerActions={headerActions}
            actions={actions}
            footerProps={{
                totalRecords: filteredVillages.length,
                showPagination: true,
                onPageChange: onPageChange,
                currentPage: currentPage,
                totalPages: totalPages,
                startIndex: Math.min((currentPage - 1) * ROWS_PER_PAGE + 1, filteredVillages.length),
                endIndex: Math.min(currentPage * ROWS_PER_PAGE, filteredVillages.length)
            }}
            emptyState={{
                icon: Home,
                message: "No villages found matching your search."
            }}
        />
    );
}
