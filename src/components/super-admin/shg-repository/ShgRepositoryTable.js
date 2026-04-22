"use client";

import { motion } from "framer-motion";
import { Users, UserPlus, Eye, Edit } from "lucide-react";

export default function ShgRepositoryTable({
  filteredSHGs,
  isLoading,
  onAddMember,
  onViewDetails,
  onEditSHG
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-slate-50/60">
            <tr>
              {["ID", "SHG Name", "Contact Person", "Mobile", "District", "Taluka", "Village", "Members", "Status", "Action"].map((h) => (
                <th key={h} className={`px-4 py-3 text-xs font-bold text-slate-500 uppercase ${h === "Action" ? "text-center" : "text-left"}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {Array.from({ length: 10 }).map((_, j) => (
                    <td key={j} className="px-4 py-4">
                      <div className="h-4 bg-slate-100 rounded-lg w-3/4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : filteredSHGs.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center gap-3 text-slate-400">
                    <Users size={36} className="opacity-30" />
                    <p className="text-sm font-semibold">No SHGs found</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredSHGs.map((shg, idx) => (
                <motion.tr
                  key={shg.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-slate-50/70 transition-colors"
                >
                  <td className="px-4 py-3 text-sm font-bold text-slate-500">{shg.id}</td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-900 text-sm">{shg.name}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700 font-medium">{shg.contactPerson}</td>
                  <td className="px-4 py-3 text-sm text-slate-700 font-medium">{shg.mobile}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{shg.district}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{shg.taluka}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{shg.village}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Users size={14} className="text-slate-400 shrink-0" />
                      <span className="text-sm font-bold text-slate-700">{shg.memberCount ?? 0}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${shg.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                      {shg.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => onAddMember(shg)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Add Member">
                        <UserPlus size={16} />
                      </button>
                      <button onClick={() => onViewDetails(shg)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Details">
                        <Eye size={16} />
                      </button>
                      <button onClick={() => onEditSHG(shg)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit SHG">
                        <Edit size={16} />
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
