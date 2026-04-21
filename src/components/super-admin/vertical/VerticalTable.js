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
                <div className="relative pl-6 py-1 border-l-2 border-slate-100 flex flex-col gap-3">
                    <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    </div>
                    <div className="absolute -left-[5px] bottom-1.5 w-2 h-2 rounded-full bg-slate-200" />
                    
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest leading-none mb-1">Launch</span>
                        <span className="text-[13px] font-bold text-slate-800 leading-none">{row.start}</span>
                    </div>
                    
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Expires</span>
                        <span className="text-[11px] font-bold text-slate-500 leading-none">{row.end}</span>
                    </div>
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
