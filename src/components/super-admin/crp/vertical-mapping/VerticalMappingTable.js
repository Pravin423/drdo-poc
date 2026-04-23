"use client";

import DataTable from "@/components/common/DataTable";
import { Edit, Trash2 } from "lucide-react";

export default function VerticalMappingTable({
  paginatedMappings,
  filteredMappings,
  isLoading,
  currentPage,
  itemsPerPage,
  totalPages,
  setCurrentPage,
  onEdit,
  isViewOnly,
}) {
  // ✅ Columns
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
      render: (val, row) => (
        <div>
          <p className="font-semibold text-slate-900">{val}</p>
          <p className="text-xs text-slate-500">Mapping ID: {row.id}</p>
        </div>
      ),
    },
    { header: "Email", key: "email" },
    { header: "Mobile", key: "mobile" },
    { header: "Task Type", key: "taskType" },
    { header: "Task Name", key: "taskName" },
    { header: "Vertical Name", key: "verticalName" },
    { header: "Vertical Code", key: "verticalCode" },
  ];

  // ✅ Actions
  const actions = [];
  
  if (!isViewOnly) {
    actions.push(
      {
        icon: Edit,
        title: "Edit",
        onClick: onEdit,
        className: "hover:text-emerald-600 hover:bg-emerald-50"
      },{
        icon: Trash2,
        title: "Delete",
        onClick: (row) => console.log("Delete", row),
        className: "hover:text-red-600 hover:bg-red-50",
      }
    );
  }

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