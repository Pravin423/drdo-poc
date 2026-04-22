"use client";

import DataTable from "@/components/common/DataTable";
import { Edit, X } from "lucide-react";

export default function VillageMappingTable({
  paginatedMappings,
  filteredMappings,
  isLoading,
  currentPage,
  itemsPerPage,
  totalPages,
  setCurrentPage,
  onEdit,
}) {

  // ✅ Columns (NO Action column here)
  const columns = [
    {
      header: "ID",
      key: "id",
      render: (_, row, idx) =>
        (currentPage - 1) * itemsPerPage + idx + 1,
    },
    {
      header: "Name",
      key: "name",
      render: (val) => <span className="font-semibold text-slate-900">{val}</span>,
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
          className={`px-2 py-1 rounded text-xs rounded-2xl font-semibold ${
            val === "Active"
              ? "text-emerald-700 bg-emerald-50 border border-emerald-100"
              : "text-slate-600 bg-slate-100 border border-slate-200"
          }`}
        >
          {val}
        </span>
      ),
    },
  ];

  // ✅ Actions (THIS replaces Action column)
  const actions = [
    {
      icon: Edit,
      title: "Edit",
      onClick: onEdit,
 className: "hover:text-emerald-600 hover:bg-emerald-50"    },
    {
      icon: X,
      title: "Delete",
      onClick: (row) => console.log("Delete", row),
      className: "hover:text-red-600 hover:bg-red-50",
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={paginatedMappings}
      isLoading={isLoading}
      actions={actions}
      emptyState={{ message: "No mappings found" }}

      footerProps={{
        totalRecords: filteredMappings.length,
        showPagination: true,
        currentPage,
        totalPages,
        startIndex: (currentPage - 1) * itemsPerPage + 1,
        endIndex: Math.min(
          currentPage * itemsPerPage,
          filteredMappings.length
        ),
        onPageChange: setCurrentPage,
      }}
    />
  );
}