"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Map, Filter, ChevronDown, X } from "lucide-react";
import { useEffect, useRef } from "react";

export default function ShgRepositoryFilterBar({
  search,
  setSearch,
  selectedDistrict,
  setSelectedDistrict,
  selectedTaluka,
  setSelectedTaluka,
  districts,
  talukasOptions,
  filterOpen,
  setFilterOpen
}) {
  const filterRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [setFilterOpen]);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm relative z-20">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center rounded-t-2xl">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Filter Records</h3>
      </div>
      <div className="p-6">
        <div className="flex flex-col md:flex-row items-end gap-5">
          <div className="flex-1 w-full md:w-auto">
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 ml-1">Search</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search size={16} className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                placeholder="Search Name or Contact Person..."
                className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none bg-slate-50/30 focus:bg-white"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {selectedDistrict && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-xs font-semibold"
              >
                <MapPin size={12} />
                {selectedDistrict.name}
                <button
                  onClick={() => { setSelectedDistrict(null); setSelectedTaluka(null); }}
                  className="ml-0.5 text-blue-500 hover:text-blue-800 transition-colors"
                  title="Clear district filter"
                >
                  <X size={12} />
                </button>
              </motion.div>
            )}

            {selectedTaluka && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-xs font-semibold"
              >
                <Map size={12} />
                {selectedTaluka.name}
                <button
                  onClick={() => setSelectedTaluka(null)}
                  className="ml-0.5 text-emerald-500 hover:text-emerald-800 transition-colors"
                  title="Clear taluka filter"
                >
                  <X size={12} />
                </button>
              </motion.div>
            )}

            <div ref={filterRef} className="relative z-10 ml-auto sm:ml-0">
              <button
                onClick={() => setFilterOpen(prev => !prev)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl border transition-all shadow-sm ${selectedDistrict || selectedTaluka
                  ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
              >
                <Filter size={16} />
                Filters
                <ChevronDown size={14} className={`transition-transform duration-200 ${filterOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {filterOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-[520px] bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden p-4 grid grid-cols-2 gap-4 origin-top-right z-50"
                  >
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 px-2">1. Select District</h4>
                      <div className="space-y-1 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                        <button
                          onClick={() => { setSelectedDistrict(null); setSelectedTaluka(null); setFilterOpen(false); }}
                          className={`w-full text-left px-3 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center justify-between ${!selectedDistrict
                            ? "bg-blue-50 text-blue-700"
                            : "text-slate-700 hover:bg-slate-50"
                            }`}
                        >
                          All Districts
                          {!selectedDistrict && <span className="w-2 h-2 rounded-full bg-blue-500"></span>}
                        </button>
                        {districts.map(district => (
                          <button
                            key={district.id}
                            onClick={() => { setSelectedDistrict(district); setSelectedTaluka(null); }}
                            className={`w-full text-left px-3 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center justify-between ${selectedDistrict?.id === district.id
                              ? "bg-blue-50 text-blue-700"
                              : "text-slate-700 hover:bg-slate-50"
                              }`}
                          >
                            {district.name}
                            {selectedDistrict?.id === district.id && <span className="w-2 h-2 rounded-full bg-blue-500"></span>}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="border-l border-slate-100 pl-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 px-2">2. Select Taluka</h4>
                      <div className="space-y-1 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                        <button
                          onClick={() => { setSelectedTaluka(null); setFilterOpen(false); }}
                          className={`w-full text-left px-3 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center justify-between ${!selectedTaluka
                            ? "bg-emerald-50 text-emerald-700"
                            : "text-slate-700 hover:bg-slate-50"
                            }`}
                        >
                          All Talukas
                          {!selectedTaluka && <span className="w-2 h-2 rounded-full bg-emerald-500"></span>}
                        </button>
                        {talukasOptions
                          .map(taluka => (
                            <button
                              key={taluka.id}
                              onClick={() => { setSelectedTaluka(taluka); setFilterOpen(false); }}
                              className={`w-full text-left px-3 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center justify-between ${selectedTaluka?.id === taluka.id
                                ? "bg-emerald-50 text-emerald-700"
                                : "text-slate-700 hover:bg-slate-50"
                                }`}
                            >
                              {taluka.name}
                              {selectedTaluka?.id === taluka.id && <span className="w-2 h-2 rounded-full bg-emerald-500"></span>}
                            </button>
                          ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
