import { useState } from "react";
import { motion } from "framer-motion";
import { Filter, Download, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { ACTIVITIES, PriorityBadge } from "./utils/data";
import { exportToExcel } from "../../../lib/exportToExcel";

const ITEMS_PER_PAGE = 5;

// ─── Status dot helper ────────────────────────────────────────────────────────
function StatusCell({ status }) {
  const dotColor =
    status === "Completed" ? "bg-emerald-500" : "bg-amber-400";
  return (
    <div className="flex items-center gap-2">
      <div className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
      <span className="text-sm text-slate-600 font-medium">{status}</span>
    </div>
  );
}

// ─── ActivityTable ────────────────────────────────────────────────────────────
/**
 * Paginated table of system activities with Filter and Export controls.
 */
export default function ActivityTable() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages        = Math.ceil(ACTIVITIES.length / ITEMS_PER_PAGE);
  const paginatedActivities = ACTIVITIES.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleExport = () => {
    exportToExcel({
      title:    "Goa Super Admin — System Activities Log",
      headers:  ["ID", "Activity", "Description", "Status", "Priority", "Timestamp"],
      rows:     ACTIVITIES.map((a) => [a.id, a.title, a.desc, a.status, a.priority, a.time]),
      filename: "goa_admin_activity_log",
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      {/* ── Header ── */}
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Recent System Activities
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Latest administrative actions and alerts across all regions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            <Filter size={16} /> Filter
          </button>
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-all shadow-md shadow-slate-200"
          >
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              {["Activity", "State", "Status", "Priority", "Timestamp", ""].map((h) => (
                <th
                  key={h}
                  className={`px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500${h === "" ? " text-right" : ""}`}
                >
                  {h || "Actions"}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {paginatedActivities.map((item, idx) => (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group hover:bg-slate-50/80 transition-colors cursor-default"
              >
                {/* Activity */}
                <td className="px-6 py-5">
                  <div className="flex items-start gap-4">
                    <div className={`mt-1 p-2 rounded-lg bg-white border border-slate-100 shadow-sm ${item.color}`}>
                      <item.icon size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </td>

                {/* State */}
                <td className="px-6 py-5">
                  <span className="text-sm font-medium text-slate-700">{item.state ?? "—"}</span>
                </td>

                {/* Status */}
                <td className="px-6 py-5">
                  <StatusCell status={item.status} />
                </td>

                {/* Priority */}
                <td className="px-6 py-5">
                  <PriorityBadge priority={item.priority} />
                </td>

                {/* Timestamp */}
                <td className="px-6 py-5">
                  <span className="text-xs font-medium text-slate-500">{item.time}</span>
                </td>

                {/* Actions */}
                <td className="px-6 py-5 text-right">
                  <button className="p-1.5 rounded-lg border border-blue-100 bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors inline-flex items-center gap-1 text-xs font-semibold">
                    <Eye size={14} /> VIEW
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Pagination Footer ── */}
      <div className="px-6 py-4 bg-slate-50/30 border-t border-slate-100 flex items-center justify-between flex-wrap gap-4">
        <p className="text-xs font-medium text-slate-500">
          Showing{" "}
          <span className="text-slate-900 font-bold">{ITEMS_PER_PAGE}</span> of{" "}
          <span className="text-slate-900 font-bold">{ACTIVITIES.length}</span> activities
        </p>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 text-slate-400 hover:text-slate-600 disabled:opacity-30"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="flex items-center gap-1 mx-2">
            {Array.from({ length: totalPages }).map((_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                    currentPage === page
                      ? "bg-slate-900 text-white"
                      : "text-slate-500 hover:bg-white border border-transparent hover:border-slate-200"
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 text-slate-600 hover:bg-white hover:shadow-sm rounded-lg transition-all border border-transparent hover:border-slate-200 disabled:opacity-30"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
