import { Map, Eye, Edit, X, Filter, Hash, RefreshCw, CheckCircle2, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DataTable from "../../../common/DataTable";
import React from "react";
export default function DistrictTable({
    districts,
    filteredDistricts,
    isLoading,
    searchQuery,
    onSearchChange,
    filterData,
    onFilterChange,
    onApplyFilter,
    onResetFilter,
    isFilterActive,
    onView,
    onEdit,
    onDelete,
    footerProps,
    isViewOnly,
}) {
    const [filterOpen, setFilterOpen] = React.useState(false);
    const filterRef = React.useRef(null);

    // Close dropdown on outside click
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setFilterOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
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
            header: "District Name",
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
        }
    ];

    // Define actions for the universal table
    const actions = [
        {
            icon: Eye,
            onClick: onView,
            title: "View Details",
            className: "hover:text-emerald-600 hover:bg-emerald-50"
        }
    ];

    if (!isViewOnly) {
        actions.push(
            {
                icon: Edit,
                onClick: onEdit,
                title: "Edit District",
                className: "hover:text-blue-600 hover:bg-blue-50"
            },
            {
                icon: X,
                onClick: (district) => onDelete(district.id),
                title: "Delete District",
                className: "hover:text-red-600 hover:bg-red-50"
            }
        );
    }

    // Custom header actions for DistrictTable (Census Code Range Filter)
    const headerActions = (
        <div className="relative" ref={filterRef}>
            <button
                onClick={() => setFilterOpen(!filterOpen)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl border transition-all shadow-sm ${
                    isFilterActive
                        ? "bg-tech-blue-600 text-white border-tech-blue-600 hover:bg-tech-blue-700 shadow-md shadow-tech-blue-500/20"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
            >
                <Filter size={16} />
                Filters
                <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${filterOpen ? "rotate-180" : ""}`}
                />
            </button>

            <AnimatePresence>
                {filterOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full mt-3 w-80 bg-white border border-slate-200 rounded-[24px] shadow-2xl z-[100] p-6"
                    >
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                    <Hash className="w-4 h-4 text-tech-blue-500" />
                                    Census Code Range
                                </h3>
                                {isFilterActive && (
                                    <span className="flex h-2 w-2 rounded-full bg-tech-blue-500 animate-pulse" />
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <span className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-wider">Min Code</span>
                                    <input
                                        type="text"
                                        placeholder="Min"
                                        value={filterData.minCensusCode}
                                        onChange={(e) => onFilterChange({ ...filterData, minCensusCode: e.target.value.replace(/\D/g, "") })}
                                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-tech-blue-500/10 focus:border-tech-blue-500 transition-all"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <span className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-wider">Max Code</span>
                                    <input
                                        type="text"
                                        placeholder="Max"
                                        value={filterData.maxCensusCode}
                                        onChange={(e) => onFilterChange({ ...filterData, maxCensusCode: e.target.value.replace(/\D/g, "") })}
                                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-tech-blue-500/10 focus:border-tech-blue-500 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <button
                                    onClick={() => {
                                        onResetFilter();
                                        setFilterOpen(false);
                                    }}
                                    className="flex-1 py-2.5 text-xs font-bold text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                                >
                                    <RefreshCw className="w-3.5 h-3.5" />
                                    Reset
                                </button>
                                <button
                                    onClick={() => {
                                        onApplyFilter();
                                        setFilterOpen(false);
                                    }}
                                    className="flex-[1.5] py-2.5 text-xs font-bold text-white bg-tech-blue-600 rounded-xl shadow-lg shadow-tech-blue-500/20 hover:bg-tech-blue-700 transition-all flex items-center justify-center gap-2"
                                >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    Apply
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );

    return (
        <DataTable
            columns={columns}
            data={filteredDistricts}
            isLoading={isLoading}
            searchProps={{
                placeholder: "Search districts by name or census code...",
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
                message: "No districts found matching your search."
            }}
        />
    );
}
