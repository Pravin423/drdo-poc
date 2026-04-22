"use client";

import { Search, RefreshCw } from "lucide-react";

export default function VillageMappingFilterBar({ 
  search, 
  setSearch, 
  onRefresh,
  itemsPerPage,
  setItemsPerPage
}) {
  return (
    <div className="px-6 py-5 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <span>Show</span>
        <select
          className="border border-slate-200 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
          }}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <span>entries</span>
      </div>

      <div className="relative group w-full sm:w-[620px]">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search size={18} className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />
        </div>
        <input
          placeholder="Search CRP..."
          className="w-full border border-slate-200 rounded-2xl pl-11 pr-4 py-2.5 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none bg-white font-medium text-slate-700"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex gap-3 w-full sm:w-auto">
        <button
          onClick={onRefresh}
          className="px-5 py-2.5 border border-slate-200 text-slate-700 bg-white rounded-2xl text-sm font-semibold hover:bg-slate-50 flex items-center gap-2 transition-colors"
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>
    </div>
  );
}
