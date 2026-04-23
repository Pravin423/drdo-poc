"use client";

import { Eye, Edit, Trash2 } from "lucide-react";
import StatusBadge from "./StatusBadge";
import DataTable from "@/components/common/DataTable";

export default function CrpTable({ filteredCRPs, isLoadingCRPs, onView, onEdit, isViewOnly }) {
  const columns = [
    {
      header: "ID",
      key: "id",
    },
    {
      header: "Name",
      key: "name",
      render: (val) => <p className="font-semibold text-slate-900">{val}</p>,
    },
    {
      header: "Email",
      key: "email",
    },
    {
      header: "Mobile",
      key: "mobile",
    },
    {
      header: "Gender",
      key: "gender",
      render: (val) => <span className="capitalize">{val || "—"}</span>,
    },
    {
      header: "Status",
      key: "status",
      render: (val) => <StatusBadge status={val} />,
    },
    {
      header: "Signature Status",
      key: "signatureStatus",
      render: (val) => {
        const status = val || "Approved";
        const styles = {
          Pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
          Rejected: "bg-red-50 text-red-700 border-red-200",
          Approved: "bg-emerald-50 text-emerald-700 border-emerald-100",
        };
        return (
          <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${styles[status]}`}>
            {status}
          </span>
        );
      },
    },
  ];

  const actions = [
    {
      icon: Eye,
      title: "View",
      onClick: onView,
      className: "hover:text-emerald-600 hover:bg-emerald-50"
    }
  ];

  if (!isViewOnly) {
    actions.push(
      {
        icon: Edit,
        title: "Edit",
        onClick: onEdit,
        className: "hover:text-blue-600 hover:bg-blue-50"

      },
      {
        icon: Trash2,
        title: "Delete",
        onClick: (row) => console.log("Delete", row),
        className: "hover:text-red-600 hover:bg-red-50"
      }
    );
  }

  return (
    <DataTable
      columns={columns}
      data={filteredCRPs}
      isLoading={isLoadingCRPs}
      actions={actions}
      emptyState={{ message: "No CRP records found" }}
    />
  );
}