import React from "react";
import { Search, ChevronDown, RefreshCw } from "lucide-react";

export default function HonFilterPanel({ 
  search, setSearch, 
  selectedMonth, setSelectedMonth, 
  statusFilter, setStatusFilter 
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Filter Records</h3>
      </div>
      <div className="p-6">
        <div className="flex flex-col md:flex-row items-end gap-5">
          {/* Search */}
          <div className="flex-1 w-full">
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 ml-1">Search</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search size={15} className="text-slate-400 group-focus-within:text-slate-600 transition-colors" />
              </div>
              <input
                placeholder="CRP name or code..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-4 focus:ring-slate-200 focus:border-slate-400 transition-all outline-none bg-slate-50/30 focus:bg-white"
              />
            </div>
          </div>

          {/* Month */}
          <div className="w-full md:w-44">
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 ml-1">Month</label>
            <div className="relative">
              <select
                value={selectedMonth}
                onChange={e => setSelectedMonth(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-4 focus:ring-slate-200 focus:border-slate-400 outline-none appearance-none bg-slate-50/30 focus:bg-white cursor-pointer"
              >
                <option>January 2026</option>
                <option>February 2026</option>
                <option>March 2026</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Status */}
          <div className="w-full md:w-44">
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 ml-1">Status</label>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-4 focus:ring-slate-200 focus:border-slate-400 outline-none appearance-none bg-slate-50/30 focus:bg-white cursor-pointer"
              >
                {["All Status", "Paid", "Pending", "Failed", "Processing"].map(o => <option key={o}>{o}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Clear */}
          <button
            onClick={() => { setSearch(""); setStatusFilter("All Status"); }}
            className="w-full md:w-auto text-slate-500 border border-slate-200 hover:text-slate-800 hover:bg-slate-50 rounded-xl px-5 py-2.5 text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <RefreshCw size={14} /> Clear
          </button>
        </div>
      </div>
    </div>
  );
}
