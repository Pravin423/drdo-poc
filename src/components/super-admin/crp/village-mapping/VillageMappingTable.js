"use client";

import { Edit, X } from "lucide-react";

export default function VillageMappingTable({ filteredMappings, isLoading, onEdit }) {
  return (
    <div className="overflow-x-auto min-h-[400px]">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50/60 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-bold whitespace-nowrap">
          <tr>
            {["ID", "Name", "Email", "Mobile", "SHGs Name", "Village", "Taluka", "District", "Status", "Action"].map((h) => (
              <th
                key={h}
                className={`px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider ${h === "Action" ? "text-center" : "text-left"}`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {isLoading ? (
            <tr>
              <td colSpan="10" className="p-8 text-center text-slate-500">Loading mappings...</td>
            </tr>
          ) : filteredMappings.length > 0 ? (
            filteredMappings.map((mapping, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                <td className="p-4 text-sm text-slate-900">{mapping.id}</td>
                <td className="p-4 text-sm font-semibold text-slate-900 whitespace-nowrap">{mapping.name}</td>
                <td className="p-4 text-sm text-slate-600 whitespace-nowrap">{mapping.email}</td>
                <td className="p-4 text-sm text-slate-600">{mapping.mobile}</td>
                <td className="p-4 text-sm text-slate-600 whitespace-nowrap">{mapping.shgName}</td>
                <td className="p-4 text-sm text-slate-600 whitespace-nowrap">{mapping.village}</td>
                <td className="p-4 text-sm text-slate-600 whitespace-nowrap">{mapping.taluka}</td>
                <td className="p-4 text-sm text-slate-600 whitespace-nowrap">{mapping.district}</td>
                <td className="p-4 text-sm">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    mapping.status === "Active"
                      ? "text-emerald-700 bg-emerald-50 border border-emerald-100"
                      : "text-slate-600 bg-slate-100 border border-slate-200"
                  }`}>
                    {mapping.status}
                  </span>
                </td>
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
                      <X size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" className="p-8 text-center text-slate-500">No mappings found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
