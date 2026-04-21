import { useState, useMemo, memo, useEffect } from "react";
import { Plus } from "lucide-react";
import { StatusBadge, TaskTypeBadge, ActivityFormBadge } from "./Badges";
import DataTable from "../../common/DataTable";

const ActiveTasksList = memo(function ActiveTasksList({ tasks, loading, onDeleteTask, onOpenAssignModal }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(t =>
      (t.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.vertical || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tasks, searchQuery]);

  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredTasks.length);
  const paginatedTasks = filteredTasks.slice(startIndex, startIndex + itemsPerPage);

  const columns = [
    {
      header: "ID",
      key: "id",
      render: (_, __, idx) => (
        <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
          {startIndex + idx + 1}
        </span>
      )
    },
    {
      header: "Task Name",
      key: "title",
      render: (title, task) => (
        <div className="flex flex-col max-w-[240px]">
          <span className="font-semibold text-slate-800 text-[14px]">{title}</span>
          <span className="text-[11px] text-slate-400 font-medium mt-0.5">Task ID - {task.id}</span>
        </div>
      )
    },
    {
      header: "Task Type",
      key: "taskType",
      render: (type) => <TaskTypeBadge type={type} />
    },
    {
      header: "Vertical",
      key: "vertical",
      render: (vertical) => (
        <span className="text-[14px] font-medium text-slate-500 max-w-[160px] break-words">
          {vertical}
        </span>
      )
    },
    {
      header: "Activity Form",
      key: "activityForm",
      render: (form) => form ? <ActivityFormBadge formName={form} /> : <span className="text-slate-300 font-bold">—</span>
    },
    {
      header: "Assigned To",
      key: "assignedTo",
      render: (assignedTo) => (
        assignedTo && assignedTo.length > 0 ? (
          <div className="flex flex-col gap-1">
            {assignedTo.map((a, i) => {
              const name = typeof a === 'string' ? a : a.name;
              return (
                <div key={i} className="mb-0 flex items-center">
                  <span className="text-[14px] font-bold text-slate-700 leading-tight">{name}{i < assignedTo.length - 1 && ','}</span>
                </div>
              );
            })}
          </div>
        ) : <span className="text-slate-300 font-bold">—</span>
      )
    },
    {
      header: "Date Range",
      key: "startDate",
      render: (start, task) => (
        <div className="flex flex-col text-[13px] leading-tight font-medium">
          <span className="text-slate-700 text-[14px]">{start}</span>
          <span className="text-slate-400 mt-0.5">to {task.endDate}</span>
        </div>
      )
    },
    {
      header: "Honorarium",
      key: "honorarium",
      render: (val) => <span className="text-[15px] font-extrabold text-slate-700">{val || ""}</span>
    },
    {
      header: "Status",
      key: "status",
      render: (status) => <StatusBadge status={status} />,
      headerClassName: "text-center",
      className: "text-center"
    }
  ];

  const headerActions = (
    <button onClick={onOpenAssignModal} className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors whitespace-nowrap shadow-sm">
      <Plus size={16} /> Assign Task
    </button>
  );

  return (
    <div className="mt-6">
      <DataTable
        columns={columns}
        data={paginatedTasks}
        isLoading={loading}
        searchProps={{
          placeholder: "Search tasks by name or vertical...",
          value: searchQuery,
          onChange: setSearchQuery
        }}
        headerActions={headerActions}
        footerProps={{
          totalRecords: filteredTasks.length,
          currentPage,
          totalPages,
          startIndex: startIndex + 1,
          endIndex,
          onPageChange: setCurrentPage,
          showPagination: true
        }}
        emptyState={{
          message: "No tasks found matching your search."
        }}
      />
    </div>
  );
});

export default ActiveTasksList;
