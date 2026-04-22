"use client";

import { useState, useEffect } from "react";
import DataTable from "@/components/common/DataTable";
import { Users, UserPlus, Eye, Edit } from "lucide-react";

const PAGE_SIZE = 10;

export default function ShgRepositoryTable({
  filteredSHGs = [],
  isLoading,
  onAddMember,
  onViewDetails,
  onEditSHG
}) {
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredSHGs]);

  // Pagination logic
  const totalRecords = filteredSHGs.length;
  const totalPages = Math.ceil(totalRecords / PAGE_SIZE);

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, totalRecords);

  const pageData = filteredSHGs.slice(startIndex, endIndex);

  // Columns
  const columns = [
    { header: "ID", key: "id" },
    { header: "SHG Name", key: "name" },
    { header: "Contact Person", key: "contactPerson" },
    { header: "Mobile", key: "mobile" },
    { header: "District", key: "district" },
    { header: "Taluka", key: "taluka" },
    { header: "Village", key: "village" },
    {
      header: "Members",
      key: "memberCount",
      render: (value) => (
        <div className="flex items-center gap-1.5">
          <Users size={14} className="text-blue-400" />
          <span className="text-sm font-bold text-slate-700">
            {value ?? 0}
          </span>
        </div>
      )
    },
    {
      header: "Status",
      key: "status",
      render: (value) => (
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
            value === "Active"
              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
              : "bg-slate-50 text-slate-600 border-slate-200"
          }`}
        >
          {value}
        </span>
      )
    }
  ];

  // Actions
  const actions = [
    {
      icon: UserPlus,
      title: "Add Member",
      onClick: onAddMember,
      className: "hover:text-blue-600 hover:bg-blue-50"},
    {
      icon: Eye,
      title: "View Details",
      onClick: onViewDetails,
      className: "hover:text-emerald-600 hover:bg-emerald-50"
    },
    {
      icon: Edit,
      title: "Edit SHG",
      onClick: onEditSHG,
      className: "hover:text-yellow-600 hover:bg-yellow-50"
    }
  ];

  return (
    <DataTable
      columns={columns}
      data={pageData}
      isLoading={isLoading}
      actions={actions}
      emptyState={{
        icon: Users,
        message: "No SHGs found"
      }}
      footerProps={{
        totalRecords,
        currentPage,
        totalPages,
        startIndex: totalRecords === 0 ? 0 : startIndex + 1,
        endIndex,
        onPageChange: (page) => {
          if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
          }
        }
      }}
    />
  );
}