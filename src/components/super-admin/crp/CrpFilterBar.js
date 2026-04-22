"use client";

import { Search, RefreshCw, ChevronDown, UploadCloud } from "lucide-react";

export default function CrpFilterBar({
  search, setSearch,
  status, setStatus,
  onClear,
  onExport,
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Filter Records</h3>
      </div>

      <div className="p-6">
        <div className="flex flex-col md:flex-row items-end gap-5">

          {/* Search */}
          <div className="flex-1 w-full md:w-auto">
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 ml-1">Search</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search size={16} className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                placeholder="Name, Aadhaar, mobile..."
                className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none bg-slate-50/30 focus:bg-white"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Status */}
          <div className="w-full md:w-48 relative">
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 ml-1">Status</label>
            <div className="relative">
              <select
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none appearance-none bg-slate-50/30 focus:bg-white cursor-pointer transition-all"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {["All Status", "Active", "Inactive", "Deleted"].map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                <ChevronDown size={14} />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
            <button
              onClick={onClear}
              className="w-full sm:w-auto text-slate-500 border border-slate-200 hover:text-slate-800 hover:bg-slate-50 rounded-xl px-5 py-2.5 text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <RefreshCw size={16} />
              Clear All
            </button>

            <button
              onClick={onExport}
              className="w-full sm:w-auto px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
            >
              <UploadCloud size={16} />
              Export CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
