"use client";

import { motion } from "framer-motion";
import { Users, Eye, Edit, X } from "lucide-react";
import StatusBadge from "./StatusBadge";

export default function CrpTable({ filteredCRPs, isLoadingCRPs, onView, onEdit }) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-slate-50/60">
            <tr>
              {[
                "ID", "Name", "Email", "Mobile", "Gender",
                "Role Name", "Status", "Signature Status", "Action",
              ].map((h) => (
                <th
                  key={h}
                  className={`px-4 py-3 text-xs font-bold text-slate-500 uppercase ${
                    h === "Action" ? "text-right" : "text-left"
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {isLoadingCRPs ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {Array.from({ length: 9 }).map((_, j) => (
                    <td key={j} className="px-4 py-4">
                      <div
                        className="h-4 bg-slate-100 rounded-lg"
                        style={{ width: j === 1 ? "120px" : j === 2 ? "160px" : "80px" }}
                      />
                    </td>
                  ))}
                </tr>
              ))
            ) : filteredCRPs.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center gap-3 text-slate-400">
                    <Users size={36} className="opacity-30" />
                    <p className="text-sm font-semibold">No CRP records found</p>
                    <p className="text-xs">Try adjusting your search or filters</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredCRPs.map((crp, idx) => (
                <motion.tr
                  key={crp.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-slate-50/70"
                >
                  <td className="px-4 py-3 text-sm font-bold text-slate-500">{crp.id}</td>

                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-900 text-sm">{crp.name}</p>
                  </td>

                  <td className="px-4 py-3 text-sm text-slate-600">{crp.email}</td>

                  <td className="px-4 py-3 text-sm text-slate-700 font-medium">{crp.mobile}</td>

                  <td className="px-4 py-3 text-sm text-slate-600 capitalize">
                    {crp.gender || "—"}
                  </td>

                  <td className="px-4 py-3 text-sm text-slate-600">Community Resource Person</td>

                  <td className="px-4 py-3">
                    <StatusBadge status={crp.status} />
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-bold border ${
                        (crp.signatureStatus || "Approved") === "Pending"
                          ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                          : crp.signatureStatus === "Rejected"
                          ? "bg-red-50 text-red-700 border-red-200"
                          : "bg-emerald-50 text-emerald-700 border-emerald-100"
                      }`}
                    >
                      {crp.signatureStatus || "Approved"}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-2 items-center">
                      <button
                        onClick={() => onView(crp)}
                        className="p-1.5 rounded-lg border border-blue-100 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => onEdit(crp)}
                        className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100 transition-colors"
                      >
                        <Edit size={14} />
                      </button>
                      <button className="p-1.5 rounded-lg border border-red-100 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors">
                        <X size={14} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
