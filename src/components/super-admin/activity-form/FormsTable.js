import { Eye, Edit, Trash2 } from "lucide-react";
import DataTable from "../../common/DataTable";

export default function FormsTable({ 
  search, 
  setSearch, 
  isLoading, 
  filtered, 
  forms, 
  router, 
  handleDeleteClick,
  onEditForm,
  footerProps,
  isViewOnly
}) {
  const columns = [
    {
      header: "#",
      key: "id",
      render: (_, __, idx) => (
        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
          {footerProps.startIndex + idx}
        </span>
      )
    },
    {
      header: "Form Title",
      key: "title",
      render: (title) => <p className="text-sm font-semibold text-slate-800">{title}</p>
    },
    {
      header: "Description",
      key: "description",
      render: (desc) => (
        <p className="text-sm text-slate-600 line-clamp-2 max-w-xs" title={desc}>
          {desc}
        </p>
      )
    },
    {
      header: "Fields",
      key: "fields",
      render: (fields) => <span className="text-sm text-slate-600">{fields} fields</span>
    },
    {
      header: "Created By",
      key: "createdBy",
      render: (createdBy) => <span className="text-sm font-semibold text-slate-700">{createdBy}</span>
    },
    {
      header: "Created At",
      key: "createdAt",
      render: (createdAt) => <span className="text-sm text-slate-500 whitespace-nowrap">{createdAt}</span>
    },
    {
      header: "Status",
      key: "status",
      render: (status) => (
        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-tight ${
          status === "Active"
            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
            : "bg-slate-100 text-slate-500 border border-slate-200"
        }`}>
          {status}
        </span>
      )
    }
  ];

  const actions = [
    {
      icon: Eye,
      title: "View",
      onClick: (form) => router.push(`/dashboard/activity-forms/view?id=${form.id}${isViewOnly ? '&viewOnly=true' : ''}`),
      className: "hover:text-blue-600 hover:bg-blue-50"
    },
    ...(!isViewOnly ? [
      {
        icon: Edit,
        title: "Edit",
        onClick: (form) => onEditForm(form.id),
        className: "hover:text-purple-600 hover:bg-purple-50"
      },
      {
        icon: Trash2,
        title: "Delete",
        onClick: (form) => handleDeleteClick(form.id),
        className: "hover:text-red-600 hover:bg-red-50"
      }
    ] : [])
  ];

  return (
    <DataTable
      columns={columns}
      data={filtered}
      isLoading={isLoading}
      searchProps={{
        placeholder: "Search forms by title...",
        value: search,
        onChange: setSearch
      }}
      actions={actions}
      footerProps={footerProps}
      emptyState={{
        message: "No activity forms found matching your search."
      }}
    />
  );
}
