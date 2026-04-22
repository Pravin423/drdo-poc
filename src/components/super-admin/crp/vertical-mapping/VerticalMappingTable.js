"use client";

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
}) {
  return (
    <>
      {/* Table */}
      <div className="w-full min-h-[400px]">
        <div
          className="overflow-x-auto overflow-y-visible"
          style={{ WebkitOverflowScrolling: "touch", willChange: "transform" }}
        >
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/60 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-bold whitespace-nowrap">
              <tr>
                {["ID", "Name", "Email", "Mobile", "Task Type", "Task Name", "Vertical Name", "Vertical Code", "Action"].map(
                  (h) => (
                    <th
                      key={h}
                      className={`px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider ${
                        h === "Action" ? "text-center" : "text-left"
                      }`}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan="9" className="p-8 text-center text-slate-500">
                    Loading mappings...
                  </td>
                </tr>
              ) : paginatedMappings.length > 0 ? (
                paginatedMappings.map((mapping, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-4 text-sm text-slate-900">
                      {(currentPage - 1) * itemsPerPage + idx + 1}
                    </td>
                    <td className="p-4 text-sm font-semibold text-slate-900 whitespace-nowrap">
                      {mapping.name}
                      <div className="text-xs text-slate-500 font-normal mt-0.5" title="Mapping ID">
                        Mapping ID: {mapping.id}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-600 whitespace-nowrap">{mapping.email}</td>
                    <td className="p-4 text-sm text-slate-600">{mapping.mobile}</td>
                    <td className="p-4 text-sm text-slate-600 whitespace-nowrap">{mapping.taskType}</td>
                    <td className="p-4 text-sm text-slate-600 whitespace-nowrap">{mapping.taskName}</td>
                    <td className="p-4 text-sm text-slate-600 whitespace-nowrap">{mapping.verticalName}</td>
                    <td className="p-4 text-sm text-slate-600 whitespace-nowrap">{mapping.verticalCode}</td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onEdit(mapping)}
                          className="p-1.5 text-blue-500 bg-white border border-blue-200 rounded hover:bg-blue-50 transition-colors shadow-sm"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="p-1.5 rounded-lg border border-red-100 bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="p-8 text-center text-slate-500">
                    No mappings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {!isLoading && filteredMappings.length > 0 && (
        <div className="px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm text-slate-500 font-medium">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredMappings.length)} of{" "}
            {filteredMappings.length} entries
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => Math.abs(page - currentPage) <= 2 || page === 1 || page === totalPages)
                .map((page, index, array) => (
                  <span key={page} className="flex items-center">
                    {index > 0 && page - array[index - 1] > 1 && (
                      <span className="px-2 text-slate-400">...</span>
                    )}
                    <button
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                        currentPage === page
                          ? "bg-blue-500 text-white"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {page}
                    </button>
                  </span>
                ))}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
}
