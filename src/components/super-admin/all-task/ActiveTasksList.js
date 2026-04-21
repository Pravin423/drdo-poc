import { useState, useMemo, memo } from "react";
import { Plus } from "lucide-react";
import { StatusBadge, TaskTypeBadge, ActivityFormBadge } from "./Badges";

const ActiveTasksList = memo(function ActiveTasksList({ tasks, loading, onDeleteTask, onOpenAssignModal }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [localSearch, setLocalSearch] = useState("");

  const displayTasks = useMemo(() => {
    return tasks.filter(t =>
      (t.title || "").toLowerCase().includes(localSearch.toLowerCase()) ||
      (t.vertical || "").toLowerCase().includes(localSearch.toLowerCase())
    );
  }, [tasks, localSearch]);

  const totalPages = Math.max(1, Math.ceil(displayTasks.length / itemsPerPage));
  const paginatedTasks = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return displayTasks.slice(start, start + itemsPerPage);
  }, [displayTasks, currentPage, itemsPerPage]);

  return (
    <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden mt-6">
      {/* Header Panel */}
      <div className="px-6 py-5 bg-white border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
          <span>Show</span>
          <select
            className="border border-slate-200 bg-slate-50 text-slate-800 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span>entries</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-end gap-5 w-full lg:w-auto">
          <div className="relative group flex items-center gap-3">
            <span className="text-sm font-semibold text-slate-600">Search:</span>
            <input
              type="text"
              className="border border-slate-200 rounded-xl px-4 py-2 min-w-[240px] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all bg-slate-50/30 focus:bg-white"
              value={localSearch}
              onChange={(e) => {
                setLocalSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <button onClick={onOpenAssignModal} className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors whitespace-nowrap shadow-sm">
            <Plus size={16} /> Assign Task
          </button>
        </div>
      </div>

      {/* Main Table Layer */}
      <div className="w-full min-h-[400px]">
        <div className="overflow-x-auto overflow-y-visible" style={{ WebkitOverflowScrolling: 'touch', willChange: 'transform' }}>
          <table className="w-full min-w-[1000px] text-left border-collapse">
            <thead className="bg-[#fafcff]/60">
              <tr>
                <th className="px-6 py-5 text-[12px]  text-slate-500 uppercase tracking-widest w-20">ID</th>
                <th className="px-6 py-5 text-[12px]  text-slate-500 uppercase tracking-widest">Task Name</th>
                <th className="px-6 py-5 text-[12px]   text-slate-500 uppercase tracking-widest">Task Type</th>
                <th className="px-6 py-5 text-[12px]  text-slate-500 uppercase tracking-widest">Vertical</th>
                <th className="px-6 py-5 text-[12px]  text-slate-500 uppercase tracking-widest">Activity Form</th>
                <th className="px-6 py-5 text-[12px]  text-slate-500 uppercase tracking-widest">Assigned To</th>
                <th className="px-6 py-5 text-[12px]  text-slate-500 uppercase tracking-widest">Date Range</th>
                <th className="px-6 py-5 text-[12px]  text-slate-500 uppercase tracking-widest">Honorarium</th>
                <th className="px-6 py-5 text-[12px] text-slate-500 uppercase tracking-widest text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 9 }).map((__, j) => (
                      <td key={j} className="px-6 py-5">
                        <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : paginatedTasks.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-16 text-center text-slate-400 text-sm font-medium">No tasks found.</td>
                </tr>
              ) : (
                paginatedTasks.map((task, index) => {
                  const globalIndex = (currentPage - 1) * itemsPerPage + index + 1;
                  return (
                  <tr key={task.id} className="hover:bg-slate-50/70 transition-colors group">
                    <td className="px-6 py-6 text-[15px] font-bold text-slate-600 align-middle">
                      {globalIndex}
                    </td>

                    <td className="px-6 py-6 align-middle">
                      <div className="flex flex-col max-w-[240px]">
                        <span className="font-semibold text-slate-800 text-[14px]">{task.title}</span>
                        <span className="text-[11px] text-slate-400 font-medium mt-0.5">Task ID - {task.id}</span>
                      </div>
                    </td>

                    <td className="px-6 py-6 align-middle">
                      <TaskTypeBadge type={task.taskType} />
                    </td>

                    <td className="px-6 py-6 text-[14px] font-medium text-slate-500 max-w-[160px] break-words align-middle">
                      {task.vertical}
                    </td>

                    <td className="px-6 py-6 align-middle font-medium text-slate-800">
                      {task.activityForm ? <ActivityFormBadge formName={task.activityForm} /> : <span className="text-slate-300 font-bold">—</span>}
                    </td>

                    <td className="px-6 py-6 align-middle">
                      {task.assignedTo && task.assignedTo.length > 0 ? (
                        <div className="flex flex-col gap-1">
                          {task.assignedTo.map((a, i) => {
                            const name = typeof a === 'string' ? a : a.name;
                            return (
                              <div key={i} className="mb-0 flex items-center">
                                <span className="text-[14px] font-bold text-slate-700 leading-tight">{name}{i < task.assignedTo.length - 1 && ','}</span>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <span className="text-slate-300 font-bold">—</span>
                      )}
                    </td>

                    <td className="px-6 py-6 text-slate-600 whitespace-nowrap align-middle">
                      <div className="flex flex-col text-[13px] leading-tight font-medium">
                        <span className="text-slate-700 text-[14px]">{task.startDate}</span>
                        <span className="text-slate-400 mt-0.5">to {task.endDate}</span>
                      </div>
                    </td>

                    <td className="px-6 py-6 text-[15px] font-extrabold text-slate-700 align-middle">
                      {task.honorarium || ""}
                    </td>

                    <td className="px-6 py-6 text-center align-middle">
                      <StatusBadge status={task.status} />
                    </td>
                  </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Container */}
      {!displayTasks.length ? null : (
        <div className="px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white">
          <span className="text-sm text-slate-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, displayTasks.length)} of {displayTasks.length} entries
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded text-sm hover:bg-slate-50 disabled:opacity-50 transition-colors"
            >
              Previous
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded text-sm bg-blue-600 text-white font-medium">
              {currentPage}
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded text-sm hover:bg-slate-50 disabled:opacity-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

export default ActiveTasksList;
