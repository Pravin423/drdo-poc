import React from "react";
import { Edit, Eye, X, Layers, Hash, FileText, Calendar, User, Tag } from "lucide-react";
import DataTable from "../../common/DataTable";

function StatusBadge({ status }) {
    return (
        <span
            className={`px-3 py-1 rounded-full text-[11px] font-bold border ${status
                    ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                    : "bg-slate-50 text-slate-500 border-slate-200"
                }`}
        >
            {status ? "Active" : "Inactive"}
        </span>
    );
}

export default function VerticalTable({ isLoading, filteredData, onView, onEdit }) {
    // Define columns for the universal table
    const columns = [
        {
            header: "ID",
            key: "id",
            render: (_, __, idx) => (
                <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                    {idx + 1}
                </span>
            )
        },
        {
            header: "Vertical Name",
            key: "name",
            render: (name) => (
                <div className="flex items-center gap-2.5">
                    <p className="font-semibold text-slate-900 text-sm">{name}</p>
                </div>
            )
        },
        {
            header: "Code",
            key: "code",
            render: (code) => (
                <div className="flex items-center gap-2 text-slate-600">
                    <span className="text-sm font-medium">{code}</span>
                </div>
            )
        },
        {
            header: "Description",
            key: "desc",
            render: (desc) => (
                <div className="flex items-start gap-2 max-w-[200px] group">
                    <div className="text-sm  text-slate-600 truncate" title={desc}>
                        {desc}
                    </div>
                </div>
            )
        },
        {
            header: "Timeline",
            key: "start",
            render: (_, row) => (
                <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-700">{row.start}</span>
                    <span className="text-xs text-slate-400 font-medium uppercase tracking-tight">{row.end}</span>
                </div>
            )
        },
        {
            header: "Created By",
            key: "createdBy",
            render: (user) => (
                <div className="flex items-center gap-2 text-slate-700">
                    <span className="text-sm font-medium">{user}</span>
                </div>
            )
        },
        {
            header: "Status",
            key: "status",
            render: (status) => <StatusBadge status={status} />
        }
    ];

    // Define actions for the universal table
    const actions = [
        {
            icon: Eye,
            onClick: onView,
            title: "View Vertical",
            className: "hover:text-emerald-600 hover:bg-emerald-50"
        },
        {
            icon: Edit,
            onClick: onEdit,
            title: "Edit Vertical",
            className: "hover:text-blue-600 hover:bg-blue-50"
        },
        {
            icon: X,
            onClick: () => { /* Handle delete */ },
            title: "Delete Vertical",
            className: "hover:text-red-600 hover:bg-red-50"
        }
    ];

    return (
        <DataTable
            columns={columns}
            data={filteredData}
            isLoading={isLoading}
            actions={actions}
            emptyState={{
                icon: Layers,
                message: "No verticals found."
            }}
            footerProps={{
                totalRecords: filteredData.length,
                showPagination: false
            }}
        />
    );
}
