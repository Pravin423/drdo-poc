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
  isViewOnly,
}) {

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
    { header: "Village", key: "village" },
    { header: "Taluka", key: "taluka" },
    { header: "District", key: "district" },
  ];

  // ✅ Actions (THIS replaces Action column)
  const actions = [];
  
  if (!isViewOnly) {
    actions.push(
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