"use client";

import DataTable from "@/components/common/DataTable";
import { Edit, X } from "lucide-react";

export default function ShgMappingTable({ filteredMappings, isLoading, onEdit }) {
  const columns = [
    { header: "ID", key: "id" },
    {
      header: "Name",
      key: "name",
      render: (val) => <p className="font-semibold text-slate-900">{val}</p>,
    },
    { header: "Email", key: "email" },
    { header: "Mobile", key: "mobile" },
    { header: "SHGs Name", key: "shgName" },
    { header: "Village", key: "village" },
    { header: "Taluka", key: "taluka" },
    { header: "District", key: "district" },
    {
      header: "Status",
      key: "status",
      render: (val) => (
        <span
          className={`px-2 py-1 rounded rounded-2xl text-xs font-semibold ${val === "Active"
              ? "text-emerald-700 bg-emerald-50 border border-emerald-100"
              : "text-slate-600 bg-slate-100 border border-slate-200"
            }`}
        >
          {val}
        </span>
      ),
    },
  ];

  const actions = [
    {
      icon: Edit,
      title: "Edit",
      onClick: onEdit,
      className: "hover:text-emerald-600 hover:bg-emerald-50"
    },
    {
      icon: X,
      title: "Delete",
      onClick: (row) => console.log(row),
      className: "hover:text-red-600 hover:bg-red-50"
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={filteredMappings}
      isLoading={isLoading}
      actions={actions}
      emptyState={{ message: "No mappings found" }}
    />
  );
}