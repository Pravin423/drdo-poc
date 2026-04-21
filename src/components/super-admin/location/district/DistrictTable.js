import React from "react";
import { Map, Eye, Edit, X } from "lucide-react";
import DataTable from "../../../common/DataTable";

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
    // Define columns for the universal table
    const columns = [
        {
            header: "ID",
            key: "id",
            render: (_, district) => (
                <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                    {districts.findIndex((d) => d.id === district.id) + 1}
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
        },
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
    ];

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
            filterProps={{
                label: "Filters",
                onClick: () => { /* Handle filters */ },
                active: false
            }}
            actions={actions}
            footerProps={{
                totalRecords: filteredDistricts.length,
                showPagination: true,
                onPageChange: (dir) => console.log("Page change", dir)
            }}
            emptyState={{
                icon: Map,
                message: "No districts found matching your search."
            }}
        />
    );
}
