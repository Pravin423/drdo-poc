import React from "react";
import { Map, Eye, Edit, X, MapPin, ChevronDown, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DataTable from "../../../common/DataTable";

export default function TalukaTable({
    talukas,
    filteredTalukas,
    isLoading,
    searchQuery,
    onSearchChange,
    districts,
    selectedDistrict,
    onSelectDistrict,
    filterOpen,
    onToggleFilter,
    onView,
    onEdit,
    onDelete,
    footerProps,
}) {
    // Define columns for the universal table
    const columns = [
        {
            header: "ID",
            key: "id",
            render: (_, __, idx) => (
                <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                    {footerProps.startIndex + idx}
                </span>
            )
        },
        {
            header: "Name",
            key: "name",
            render: (name) => (
                <p className="text-sm font-semibold text-slate-800">{name}</p>
            )
        },
        {
            header: "Census Code",
            key: "censusCode",
            render: (code) => (
                <span className="text-sm text-slate-600">{code}</span>
            )
        },
        {
            header: "District Name",
            key: "districtName",
            render: (name) => (
                <span className="text-sm text-slate-600">{name}</span>
            )
        }
    ];

    // Define actions for the universal table
    const actions = [
        {
            icon: Eye,
            onClick: (taluka) => onView(taluka.id),
            title: "View Details",
            className: "hover:text-emerald-600 hover:bg-emerald-50"
        },
        {
            icon: Edit,
            onClick: onEdit,
            title: "Edit Taluka",
            className: "hover:text-blue-600 hover:bg-blue-50"
        },
        {
            icon: X,
            onClick: (taluka) => onDelete(taluka.id),
            title: "Delete Taluka",
            className: "hover:text-red-600 hover:bg-red-50"
        }
    ];

    // Custom header actions for TalukaTable (District Filter)
    const headerActions = (
        <>
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

            <div className="relative">
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
        </>
    );

    return (
        <DataTable
            columns={columns}
            data={filteredTalukas}
            isLoading={isLoading}
            searchProps={{
                placeholder: "Search talukas by name, code, or district...",
                value: searchQuery,
                onChange: onSearchChange
            }}
            headerActions={headerActions}
            actions={actions}
            footerProps={{
                ...footerProps,
                showPagination: true
            }}
            emptyState={{
                icon: Map,
                message: "No talukas found matching your search."
            }}
        />
    );
}
