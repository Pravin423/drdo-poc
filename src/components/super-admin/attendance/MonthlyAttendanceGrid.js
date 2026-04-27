import React, { useState, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Download, Search, ChevronLeft, ChevronRight, Calendar, 
  CheckCircle2, X, RefreshCw, ChevronDown, Users 
} from "lucide-react";
import { createPortal } from "react-dom";
import { exportToExcel } from "../../../lib/exportToExcel";

const MonthlyAttendanceGrid = memo(function MonthlyAttendanceGrid({
  employees = [],
  loading = false,
  selectedMonth,
  setSelectedMonth
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportMonth, setExportMonth] = useState(String(selectedMonth.getMonth() + 1).padStart(2, '0'));
  const [exportYear, setExportYear] = useState(String(selectedMonth.getFullYear()));
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem("authToken") : null;
      // Fetch as raw data (CSV text) first
      const res = await fetch(`/api/attendance-month-export?month=${exportMonth}&year=${exportYear}&type=excel&format=raw`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error("Export failed");

      const text = await res.text();
      const lines = text.split('\n').filter(l => l.trim());
      if (lines.length === 0) throw new Error("No data returned");

      const headers = lines[0].split(',').map(h => h.trim());
      const rows = lines.slice(1).map(l => l.split(',').map(cell => cell.trim()));

      // Use the fancy Excel exporter
      exportToExcel({
        title: `Monthly Attendance Report — ${new Date(exportYear, exportMonth - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}`,
        headers: headers,
        rows: rows,
        filename: `attendance_report_${exportMonth}_${exportYear}`
      });

      setIsExportModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to export attendance report");
    } finally {
      setIsExporting(false);
    }
  };

  // 📅 Days Calculation
  const monthDays = useMemo(() => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    const days = new Date(year, month + 1, 0).getDate();

    return Array.from({ length: days }, (_, i) => {
      const d = new Date(year, month, i + 1);
      return {
        day: i + 1,
        dayName: d.toLocaleDateString("en-US", { weekday: "short" }),
        isWeekend: d.getDay() === 0 || d.getDay() === 6,
      };
    });
  }, [selectedMonth]);

  const renderStatus = (status) => {
    const baseClass = "w-8 h-8 flex items-center justify-center rounded-lg text-[11px] font-bold transition-all";

    switch (status) {
      case "P":
        return <div className={`${baseClass} bg-emerald-50 text-emerald-600 border border-emerald-100`}><CheckCircle2 size={14} /></div>;
      case "A":
        return <div className={`${baseClass} bg-rose-50 text-rose-600 border border-rose-100`}><X size={14} /></div>;
      case "L":
        return <div className={`${baseClass} bg-amber-50 text-amber-600 border border-amber-100`}>L</div>;
      case "H":
        return <div className={`${baseClass} bg-blue-50 text-blue-600 border border-blue-100`}>H</div>;
      default:
        return <div className="text-slate-200">-</div>;
    }
  };

  return (
    <div className="bg-slate-50 rounded-3xl p-4 md:p-8 font-sans antialiased text-slate-900 border border-slate-200">
      <div className="max-w-[1600px] mx-auto space-y-4">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-800">Attendance Dashboard</h1>
            <p className="text-slate-500 text-sm font-medium">Detailed monthly tracking and summaries</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
            >
              <Download size={16} /> Export CSV
            </button>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden flex flex-col h-[750px]">

          {/* Toolbar */}
          <div className="p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search employee..."
                  className="pl-11 pr-4 py-2.5 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500/20 w-72 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex items-center bg-slate-100 p-1 rounded-2xl">
                <button
                  onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1, 1))}
                  className="p-2 hover:bg-white hover:shadow-sm rounded-xl text-slate-600 transition-all"
                >
                  <ChevronLeft size={18} />
                </button>
                <div className="flex items-center gap-2 px-4 min-w-[140px] justify-center">
                  <Calendar size={14} className="text-indigo-500" />
                  <span className="text-sm font-bold text-slate-700 tabular-nums">
                    {selectedMonth.toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 1))}
                  className="p-2 hover:bg-white hover:shadow-sm rounded-xl text-slate-600 transition-all"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-6 px-5 py-2 bg-slate-50 rounded-2xl border border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Present</div>
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-rose-500" /> Absent</div>
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500" /> Late</div>
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500" /> Holiday</div>

            </div>
          </div>

          {/* Table Container */}
          <div className="flex-1 overflow-auto relative custom-scrollbar">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-50">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm font-bold text-slate-500">Syncing Data...</p>
                </div>
              </div>
            ) : null}

            <table className="w-full border-separate border-spacing-0">
              <thead className="sticky top-0 z-40">
                <tr className="bg-white/95 backdrop-blur-md">
                  <th className="sticky left-0 z-50 bg-white p-5 text-left border-b border-r border-slate-100 min-w-[240px] shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Employee Profile</span>
                  </th>
                  {['P', 'A', 'L', 'H'].map((type) => (
                    <th key={type} className="p-4 border-b border-slate-100 bg-slate-50/50 text-[10px] font-black text-slate-400 w-12 text-center">{type}</th>
                  ))}
                  {monthDays.map((d) => (
                    <th key={d.day} className={`p-3 border-b border-slate-100 min-w-[50px] transition-colors ${d.isWeekend ? 'bg-rose-50/30' : ''}`}>
                      <div className="flex flex-col items-center">
                        <span className={`text-[9px] font-bold uppercase ${d.isWeekend ? 'text-rose-400' : 'text-slate-400'}`}>{d.dayName}</span>
                        <span className="text-sm font-black text-slate-700">{d.day}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {employees
                  .filter((emp) => emp.user.fullname.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((emp) => (
                    <tr key={emp.user.id} className="group hover:bg-indigo-50/30 transition-colors">
                      <td className="sticky left-0 z-30 bg-white group-hover:bg-indigo-50/50 p-4 border-r border-slate-100 transition-colors shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xs uppercase shadow-md shadow-indigo-200 overflow-hidden">
                            {emp.user.profile || emp.user.profile_photo || emp.user.image ? (
                              <img
                                src={emp.user.profile || emp.user.profile_photo || emp.user.image}
                                alt=""
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              emp.user.fullname?.charAt(0) || "U"
                            )}
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-sm font-bold text-slate-800 truncate">{emp.user.fullname}</p>
                            <p className="text-[10px] font-medium text-slate-400">ID: {String(emp.user.id).slice(-6)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center tabular-nums text-xs font-bold text-emerald-600 bg-emerald-50/10 border-b border-slate-50">{emp.counts?.P || 0}</td>
                      <td className="p-4 text-center tabular-nums text-xs font-bold text-rose-500 bg-rose-50/10 border-b border-slate-50">{emp.counts?.A || 0}</td>
                      <td className="p-4 text-center tabular-nums text-xs font-bold text-amber-600 bg-amber-50/10 border-b border-slate-50">{emp.counts?.L || 0}</td>
                      <td className="p-4 text-center tabular-nums text-xs font-bold text-blue-600 bg-blue-50/10 border-b border-slate-50">{emp.counts?.H || 0}</td>

                      {monthDays.map((d) => (
                        <td key={d.day} className={`p-2 border-b border-slate-50 transition-colors ${d.isWeekend ? 'bg-slate-50/40' : ''}`}>
                          <div className="flex justify-center scale-90 hover:scale-110 transition-transform">
                            {renderStatus(emp.days?.[d.day])}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Footer Info */}
          <div className="px-6 py-4 bg-white border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
              <Users size={14} className="text-slate-400" />
              Total Records: {employees.length}
            </div>
            <div className="text-[10px] font-medium text-slate-400 italic">
              Use horizontal scroll to view full month history
            </div>
          </div>
        </div>
      </div>

      {/* Export Modal - Rendered outside DashboardLayout using Portal */}
      {typeof window !== 'undefined' && createPortal(
        <AnimatePresence>
          {isExportModalOpen && (
            <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsExportModalOpen(false)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-white rounded-[32px] shadow-2xl border border-slate-200/50 w-full max-w-md overflow-hidden"
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div className="space-y-1">
                      <h3 className="text-2xl font-bold text-slate-900 font-sans tracking-tight">Export Report</h3>
                      <p className="text-sm text-slate-500 font-medium">Select period for attendance export</p>
                    </div>
                    <button
                      onClick={() => setIsExportModalOpen(false)}
                      className="p-2.5 hover:bg-slate-100/80 rounded-full transition-all active:scale-95 group"
                    >
                      <X className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-5">
                      <div className="space-y-2.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Month</label>
                        <div className="relative group">
                          <select
                            value={exportMonth}
                            onChange={(e) => setExportMonth(e.target.value)}
                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all appearance-none cursor-pointer pr-10 hover:bg-white"
                          >
                            {Array.from({ length: 12 }, (_, i) => (
                              <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                                {new Date(0, i).toLocaleString('default', { month: 'long' })}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none transition-transform group-hover:translate-y-[-40%]" />
                        </div>
                      </div>
                      <div className="space-y-2.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Year</label>
                        <div className="relative group">
                          <select
                            value={exportYear}
                            onChange={(e) => setExportYear(e.target.value)}
                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all appearance-none cursor-pointer pr-10 hover:bg-white"
                          >
                            {[2024, 2025, 2026, 2027].map(y => (
                              <option key={y} value={String(y)}>{y}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none transition-transform group-hover:translate-y-[-40%]" />
                        </div>
                      </div>
                    </div>

                    <div className="pt-6">
                      <button
                        onClick={handleExport}
                        disabled={isExporting}
                        className="w-full py-4.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-2xl font-black text-[13px] uppercase tracking-wider shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] hover:shadow-indigo-200 active:scale-[0.98] border border-indigo-500/20"
                      >
                        {isExporting ? (
                          <>
                            <RefreshCw className="w-5 h-5 animate-spin" />
                            Preparing...
                          </>
                        ) : (
                          <>
                            <Download className="w-5 h-5" />
                            Generate & Download
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>, document.body)}
    </div>
  );
});

export default MonthlyAttendanceGrid;
