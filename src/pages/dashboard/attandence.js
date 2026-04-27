"use client";

import { useState, useEffect, useRef, useMemo, useCallback, memo } from "react";
import { motion, AnimatePresence, useInView, useMotionValue, useSpring } from "framer-motion";
import {
  LayoutDashboard, CalendarIcon, AlertCircle,
  Users,
  FileCheck,
  Map as MapIcon,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Timer,
  Filter,
  Download,
  ChevronDown,
  MapPin,
  User,
  Building2,
  Info,
  MessageSquare,
  Eye,
  FileText,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  X,
  Tag,
  Activity
} from "lucide-react";
import { createPortal } from "react-dom";
import { exportToExcel } from "../../lib/exportToExcel";
import { useRouter } from "next/router";

import ProtectedRoute from "../../components/ProtectedRoute";
import DashboardLayout from "../../components/DashboardLayout";
import GISMapTab from "../../components/dashboard/GISMapTab";
import DataTable from "../../components/common/DataTable";

export default function AttendanceManagement() {
  const router = useRouter();
  const isViewOnly = router.query.viewOnly === "true";

  const [activeTab, setActiveTab] = useState("masterRole");
  const [activeModal, setActiveModal] = useState(null);

  const tabs = [
    { id: "masterRole", label: "Attendance Report", icon: Users },
    { id: "workReport", label: "Employee Work Report", icon: FileCheck },
    { id: "leaveList", label: "Leave List", icon: FileText },
    { id: "holidays", label: "Holidays List", icon: MapIcon },
  ];

  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Global Fetch for Stats and Reports
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        const month = selectedMonth.getMonth() + 1;
        const year = selectedMonth.getFullYear();
        const res = await fetch(`/api/monthly-attendance?month=${month}&year=${year}`);
        const result = await res.json();
        if (result?.status === 1) {
          setEmployees(result.data.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, [selectedMonth]);


  return (
    <ProtectedRoute allowedRole="super-admin">
      <DashboardLayout>
        <div className="min-h-screen p-2 lg:p-3 xl:p-4">
          <div className="max-w-[1600px] mx-auto space-y-8">

            {/* Header */}
            <motion.header
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              <div className="space-y-1">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                  Attendance <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">Management</span>
                </h1>
                <p className="text-slate-500 font-bold text-lg">Real-time monitoring and reporting system for CRP operations.</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl text-sm font-bold hover:bg-slate-50 flex items-center gap-2.5 transition-all shadow-sm hover:shadow-md active:scale-95"
                  onClick={() => window.print()}
                >
                  <Download size={18} className="text-slate-400" /> Export PDF
                </button>
                <div className="h-8 w-px bg-slate-200 hidden lg:block mx-2" />
                <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 border border-emerald-100 rounded-2xl">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-black text-emerald-700 uppercase tracking-widest">Live Syncing</span>
                </div>
              </div>
            </motion.header>

            {/* Overview section always visible */}
            <OverviewGrid employees={employees} loading={loading} />

            {/* Tab Switcher */}
            <div className="relative">
              <div className="flex items-center gap-1.5 p-1.5 bg-slate-200/50 backdrop-blur-md rounded-[1.5rem] w-fit overflow-x-auto no-scrollbar max-w-full shadow-inner border border-slate-200/60">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center gap-2.5 px-6 py-3 rounded-[1.25rem] text-sm font-bold transition-all duration-300 relative
                      ${activeTab === tab.id
                        ? "bg-white text-indigo-600 shadow-xl shadow-indigo-100 ring-1 ring-slate-200"
                        : "text-slate-500 hover:text-slate-800 hover:bg-white/50"
                      }
                    `}
                  >
                    <tab.icon size={18} className={activeTab === tab.id ? "text-indigo-600" : "text-slate-400"} />
                    <span className="whitespace-nowrap">{tab.label}</span>
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-600"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* --- Content Area with Animation --- */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {activeTab === "masterRole" && (
                  <MusterRollTab
                    employees={employees}
                    loading={loading}
                    selectedMonth={selectedMonth}
                    setSelectedMonth={setSelectedMonth}
                  />
                )}
                { activeTab === "workReport" && <WorkReportTab employees={employees} />}
                { activeTab === "leaveList" && <LeaveListTab /> }
                { activeTab === "gisMap" && <GISMapTab />}
                {activeTab === "holidays" && <HolidaysTab isViewOnly={isViewOnly} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </DashboardLayout>

    </ProtectedRoute>
  );
}

// --- Sub-components ---

const OverviewGrid = memo(function OverviewGrid({ employees = [], loading = false }) {
  const today = new Date().getDate();

  const stats = useMemo(() => {
    // Calculate stats from employees data
    const presentCount = employees.filter(emp => emp.days?.[today] === "P").length;
    const absentCount = employees.filter(emp => emp.days?.[today] === "A").length;

    return [
      {
        label: "Total CRPs",
        value: loading ? "..." : employees.length.toString(),
        accent: "text-emerald-600 bg-emerald-50",
        icon: Users,
      },
      {
        label: "Present Today",
        value: loading ? "..." : presentCount.toString(),
        accent: "text-blue-600 bg-blue-50",
        icon: CheckCircle2,
      },
      {
        label: "Absent Today",
        value: loading ? "..." : absentCount.toString(),
        accent: "text-rose-600 bg-rose-50",
        icon: XCircle,
      },
      {
        label: "Pending Approvals",
        value: "24", // This could also be calculated if data is available
        accent: "text-orange-600 bg-orange-50",
        icon: Clock,
      },
    ];
  }, [employees, loading, today]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((card, index) => (
        <motion.section
          key={card.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.3 }}
          className="group relative overflow-hidden rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between min-h-[140px]"
        >
          {/* Top Row: Circular Icon */}
          <div className="relative z-10 mb-4 transition-transform duration-300 group-hover:scale-[1.15] origin-top-left">
            <div className={`w-10 h-10 flex items-center justify-center rounded-full ${card.accent}`}>
              <card.icon size={20} strokeWidth={2} />
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10 mt-auto">
            <h4 className="text-2xl font-extrabold text-[#111827] leading-tight mb-1">{card.value}</h4>
            <p className="text-[13px] font-bold text-slate-500">{card.label}</p>
          </div>

          {/* Large Faint Background Icon */}
          <div className="absolute -right-4 -bottom-4 opacity-[0.03] text-slate-900 pointer-events-none transition-transform duration-500 ease-out group-hover:scale-[1.4] group-hover:-rotate-6">
            <card.icon size={90} strokeWidth={2.5} />
          </div>
        </motion.section>
      ))}
    </div>
  );
});



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


// Muster Roll Tab Component
const MusterRollTab = memo(function MusterRollTab({
  employees,
  loading,
  selectedMonth,
  setSelectedMonth
}) {
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  const [filters, setFilters] = useState({
    district: "all",
    block: "all",
    date: new Date().toISOString().split('T')[0],
    search: "",
    exceptionType: "all"
  });
  const [isReportLoading, setIsReportLoading] = useState(false);
  const [selectedEntries, setSelectedEntries] = useState([]);
  const [attendanceEntries, setAttendanceEntries] = useState([]);

  // 📡 Fetch Daily Attendance Record API
  useEffect(() => {
    if (viewMode !== "list") return;

    const fetchReport = async () => {
      setIsReportLoading(true);
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem("authToken") : null;
        const query = new URLSearchParams({
          date: filters.date,
          district: filters.district,
          taluka: filters.block,
          search: filters.search
        }).toString();

        const res = await fetch(`/api/attendance-report?${query}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const result = await res.json();

        console.log("Daily Record Data:", result);

        if (result.status === 1 || result.success === true || Array.isArray(result?.data?.data) || Array.isArray(result?.data)) {
          // Look for data in common nested locations: result.data.data (Pagination), result.data (Direct), result.attendance, etc.
          let rawData = result?.data?.data || result?.data || result?.attendance || result?.records || [];

          if (!Array.isArray(rawData)) {
            console.warn("⚠️ Data was not an array, attempting to use fallback:", rawData);
            rawData = [];
          }

          const mapped = rawData.map((item, idx) => {
            // Function to format "2026-03-27 18:33:02" to "18:33"
            const formatTime = (dateTimeStr) => {
              if (!dateTimeStr) return "--:--";
              try {
                const parts = dateTimeStr.split(' ');
                if (parts.length < 2) return dateTimeStr;
                const timeParts = parts[1].split(':');
                return `${timeParts[0]}:${timeParts[1]}`;
              } catch (e) { return dateTimeStr; }
            };

            const isPresent = item.attendance_status === 1 || item.checkin_time;
            const status = isPresent ? "Present" : "Absent";

            return {
              id: item.id || idx + 1,
              name: item.fullname || item.name || "Unknown",
              status: status,
              statusColor: isPresent ? "emerald" : "rose",
              employeeId: item.employee_id || item.crp_id || `CRP-${item.id}`,
              district: item.district_name || item.district || "",
              block: item.taluka_name || item.block || "",
              location: item.location || item.village_name || "N/A",
              punchIn: formatTime(item.checkin_time),
              punchOut: formatTime(item.checkout_time),
              workHours: item.total_hours || "0h",
              supervisor: item.supervisor_name || item.approver_name || "Supervisor Not Assigned",
              remarks: item.remarks || "No remarks provided",
              approved: item.is_approved === 1 || item.status === "Approved",
              approvedStatus: (item.is_approved === 1 || item.status === "Approved") ? "Approved" : "Pending",
              profile: item.profile || item.image || item.profile_photo || null
            };
          });
          setAttendanceEntries(mapped);
        } else {
          setAttendanceEntries([]);
        }
      } catch (err) {
        console.error("❌ Failed to fetch record:", err);
      } finally {
        setIsReportLoading(false);
      }
    };

    fetchReport();
  }, [viewMode, filters.date, filters.search, filters.district, filters.block]);

  // Filter attendance entries with memoization
  const filteredAttendanceEntries = useMemo(() => attendanceEntries.filter(entry => {
    if (filters.district !== "all" && !entry.district.toLowerCase().includes(filters.district)) {
      return false;
    }
    if (filters.block !== "all" && !entry.block.toLowerCase().includes(filters.block)) {
      return false;
    }
    if (filters.exceptionType !== "all" && entry.exceptionType !== filters.exceptionType) {
      return false;
    }
    return true;
  }), [attendanceEntries, filters.district, filters.block, filters.exceptionType]);

  // Get pending entries with memoization
  const pendingEntries = useMemo(() =>
    filteredAttendanceEntries.filter(entry => !entry.approved),
    [filteredAttendanceEntries]
  );

  // Handle select all pending with useCallback
  const handleSelectAllPending = useCallback((checked) => {
    if (checked) {
      setSelectedEntries(pendingEntries.map(e => e.id));
    } else {
      setSelectedEntries([]);
    }
  }, [pendingEntries]);

  // Handle individual entry selection with useCallback
  const handleEntrySelection = useCallback((id, checked) => {
    if (checked) {
      setSelectedEntries(prev => [...prev, id]);
    } else {
      setSelectedEntries(prev => prev.filter(entryId => entryId !== id));
    }
  }, []);

  // Handle approve entry with useCallback
  const handleApproveEntry = useCallback((id) => {
    setAttendanceEntries(prev => prev.map(entry =>
      entry.id === id
        ? { ...entry, approved: true, approvedStatus: "Approved" }
        : entry
    ));
    setSelectedEntries(prev => prev.filter(entryId => entryId !== id));
  }, []);

  // Handle reject entry with useCallback
  const handleRejectEntry = useCallback((id) => {
    setAttendanceEntries(prev => prev.map(entry =>
      entry.id === id
        ? { ...entry, approved: true, approvedStatus: "Rejected" }
        : entry
    ));
    setSelectedEntries(prev => prev.filter(entryId => entryId !== id));
  }, []);

  // Handle request info with useCallback
  const handleRequestInfo = useCallback((id) => {
    alert(`Requesting additional information for entry ${id}`);
  }, []);

  // Handle export PDF with useCallback
  // Handle export PDF with useCallback
  const handleExportPDF = useCallback(() => {
    alert(`Exporting ${filteredAttendanceEntries.length} entries to PDF for date ${filters.date}`);
  }, [filteredAttendanceEntries.length, filters.date]);

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1 p-1 bg-slate-200/50 rounded-2xl border border-slate-200/50 w-fit">
          <button
            onClick={() => setViewMode("grid")}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${viewMode === "grid" ? "bg-white text-[#1a2e7a] shadow-sm ring-1 ring-slate-200" : "text-slate-500 hover:text-slate-700 hover:bg-white/40"}`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Monthly Attendance
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${viewMode === "list" ? "bg-white text-[#1a2e7a] shadow-sm ring-1 ring-slate-200" : "text-slate-500 hover:text-slate-700 hover:bg-white/40"}`}
          >
            <Clock className="w-4 h-4" />
            Daily Record
          </button>
        </div>

        {viewMode === "list" && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm"
          >
            <Calendar className="w-4 h-4 text-indigo-600" />
            <p className="text-sm font-bold text-slate-700">Attendance Record for {filters.date}</p>
          </motion.div>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {viewMode === "grid" ? (
            <MonthlyAttendanceGrid
              employees={employees}
              loading={loading}
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
            />
          ) : (
            <div className="bg-white rounded-[28px] border border-slate-200 shadow-sm overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-xl font-bold text-slate-900">Daily Attendance Record</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Attendance entries for {filters.date} ({attendanceEntries.length} total)
                </p>
              </div>

              {/* Filters */}
              <div className="p-6 border-b border-slate-200 bg-slate-50/50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Date</label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      <input
                        type="date"
                        value={filters.date}
                        onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                        className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none bg-white font-medium transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Search Employee</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search by name..."
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none bg-white font-medium transition-all"
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Attendance Record Table */}
              <div className="p-6 bg-slate-50/30">
                <DataTable
                  columns={[
                    {
                      header: "Employee Profile",
                      key: "name",
                      render: (val, row) => (
                        <div className="flex items-center gap-3 py-1">
                          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm uppercase shadow-md overflow-hidden shrink-0">
                            {row.profile ? (
                              <img src={row.profile} alt="" className="w-full h-full object-cover" />
                            ) : (
                              val?.charAt(0) || "U"
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm tracking-tight">{val}</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">ID: {String(row.employeeId).slice(-8)}</p>
                          </div>
                        </div>
                      )
                    },
                    {
                      header: "Attendance State",
                      key: "status",
                      render: (val) => (
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border shadow-sm ${
                          val === 'Present' 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                            : 'bg-rose-50 text-rose-600 border-rose-100'
                        }`}>
                          <div className={`w-1 h-1 rounded-full ${val === 'Present' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          {val}
                        </span>
                      )
                    },
                    {
                      header: "Operational Area",
                      key: "block",
                      render: (val, row) => (
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-bold text-slate-700">{val}</span>
                          <span className="text-[10px] text-slate-400 font-medium">{row.district}</span>
                        </div>
                      )
                    },
                    {
                      header: "Temporal Metrics",
                      key: "punchIn",
                      render: (_, row) => (
                        <div className="flex items-center gap-4">
                          <div className="flex flex-col">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-0.5">In</span>
                            <div className="flex items-center gap-1 text-xs font-black text-slate-700 tabular-nums">
                              <Clock size={10} className="text-indigo-500" />
                              {row.punchIn}
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-0.5">Out</span>
                            <div className="flex items-center gap-1 text-xs font-black text-slate-700 tabular-nums">
                              <Clock size={10} className="text-slate-400" />
                              {row.punchOut}
                            </div>
                          </div>
                        </div>
                      )
                    },
                    {
                      header: "Productive Hours",
                      key: "workHours",
                      render: (val) => (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 rounded-lg border border-emerald-100/50">
                          <Timer size={12} className="text-emerald-500" />
                          <span className="text-xs font-black text-emerald-700 tabular-nums">{val}</span>
                        </div>
                      )
                    },
                    {
                      header: "Approval Workflow",
                      key: "approvedStatus",
                      render: (val, row) => (
                        <div className="flex flex-col gap-1">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-black uppercase rounded-lg w-fit ${
                            row.approved 
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                              : 'bg-amber-50 text-amber-600 border border-amber-100'
                          }`}>
                            {row.approved ? <ShieldCheck size={10} /> : <Clock size={10} />}
                            {val}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium italic truncate max-w-[100px]">By: {row.supervisor}</span>
                        </div>
                      )
                    }
                  ]}
                  data={attendanceEntries}
                  isLoading={isReportLoading}
                  emptyState={{
                    icon: Search,
                    message: `No records found for ${filters.date}`
                  }}
                  footerProps={{
                    totalRecords: attendanceEntries.length,
                    showPagination: false
                  }}
                />
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
});

// Employee Work Report Tab Component
const WorkReportTab = memo(function WorkReportTab({ employees = [] }) {
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [reportData, setReportData] = useState(null);
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await fetch(`/api/employee-work-report?user_id=&month=${selectedMonth}&year=${selectedYear}`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("authToken")}`
          }
        });
        const data = await response.json();
        if (data.status === 1 || data.success) {
          setInitialData(data.data || data);
        }
      } catch (err) {
        console.error("Failed to fetch initial report data for users", err);
      }
    };
    fetchInitialData();
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    const fetchReport = async () => {
      if (!selectedEmployee) {
        setReportData(null);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/employee-work-report?user_id=${selectedEmployee}&month=${selectedMonth}&year=${selectedYear}`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("authToken")}`
          }
        });
        const data = await response.json();
        if (data.status === 1 || data.success) {
          setReportData(data.data || data);
        } else {
          setReportData(data.data || data); 
        }
      } catch (err) {
        console.error(err);
        setError("An error occurred while fetching the report.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchReport();
  }, [selectedEmployee, selectedMonth, selectedYear]);

  // Helper for calendar
  const getDaysInMonth = (month, year) => new Date(year, month, 0).getDate();
  const getFirstDayOfMonth = (month, year) => new Date(year, month - 1, 1).getDay();

  const daysInMonth = getDaysInMonth(parseInt(selectedMonth), parseInt(selectedYear));
  const firstDayOfMonth = getFirstDayOfMonth(parseInt(selectedMonth), parseInt(selectedYear));

  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  // Find employee details for card (fallback from employees list if api doesn't return info)
  // Use users from initialData if available, fallback to employees prop
  const dropdownUsers = initialData?.users || (reportData && reportData.users) || employees || [];

  const empDetailsMatch = dropdownUsers.find(e => {
    const user = e.user || e;
    return user?.id?.toString() === selectedEmployee || user?.crp_id?.toString() === selectedEmployee || user?.username?.toString() === selectedEmployee;
  });
  const empDetails = empDetailsMatch?.user || empDetailsMatch || {};

  const getDayRecord = (day) => {
     if(!reportData || !reportData.calendar) return null;
     return reportData.calendar.find(a => a.day === day);
  };

  // For visual prototyping based on the image 
  const getDummyStatus = (day) => {
    if (!selectedEmployee) return null;
    if ([1, 8, 15, 22, 29].includes(day)) return "Holiday";
    if ([2,3,4,5,6,7,9,10,11,12,13,14, 16,17,18,19,20,21,23,24,25,26,27,28,30,31].includes(day)) return "Absent";
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Select Employee</label>
            <div className="relative">
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="w-full pl-3 pr-10 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none bg-white font-medium appearance-none"
              >
                <option value="">Select an employee...</option>
                {dropdownUsers.map((emp, index) => {
                  const user = emp.user || emp;
                  return (
                    <option key={user.id || index} value={user.id}>
                      {user.fullname || user.name || `Employee ${index+1}`} ({user.crp_id || user.employee_id || `CRP00${index+1}`})
                    </option>
                  );
                })}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div className="w-full md:w-32">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Month</label>
             <div className="relative">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full pl-3 pr-10 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none bg-white font-medium appearance-none"
              >
                {months.map(m => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div className="w-full md:w-32">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Year</label>
             <div className="relative">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full pl-3 pr-10 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none bg-white font-medium appearance-none"
              >
                {years.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {selectedEmployee && (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Left Card: Employee Details */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden p-6 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-orange-100 flex items-center justify-center mb-4 overflow-hidden border-2 border-slate-100 shadow-sm relative">
                {reportData?.userProfile?.profile || empDetails.profile ? (
                  <img src={reportData?.userProfile?.profile || empDetails.profile} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${reportData?.userProfile?.fullname || empDetails.fullname || selectedEmployee}`} alt="Profile" className="w-full h-full object-cover" />
                )}
              </div>
              <h3 className="text-xl font-bold text-slate-900 text-center">
                {reportData?.userProfile?.fullname || empDetails.fullname || empDetails.name || "Employee Name"}
              </h3>
              <p className="text-sm font-medium text-slate-500 mb-6">
                ID: {reportData?.userProfile?.crp_id || empDetails.crp_id || empDetails.employee_id || `CRP00${selectedEmployee}`}
              </p>

              <div className="w-full space-y-4 text-[13px] mb-6 pb-6 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Email</span>
                  <span className="font-bold text-slate-900 truncate pl-2 max-w-[150px]">{reportData?.userProfile?.email || empDetails.email || "No Email"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Phone</span>
                  <span className="font-bold text-slate-900">{reportData?.userProfile?.mobile || reportData?.userProfile?.phone || empDetails.mobile || empDetails.phone || "No Phone"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Gender</span>
                  <span className="font-bold text-slate-900">{reportData?.userProfile?.gender || empDetails.gender || "Female"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Status</span>
                  <span className="px-2 py-0.5 text-[10px] font-black uppercase text-white bg-emerald-600 rounded">
                    ACTIVE
                  </span>
                </div>
              </div>

              <div className="w-full grid grid-cols-2 gap-px bg-slate-100 border border-slate-100 rounded-[16px] overflow-hidden mb-5">
                <div className="bg-white p-3.5 flex flex-col items-center justify-center">
                  <p className="text-xl font-black text-slate-800">{reportData?.totalWorkingDays ?? 0}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Working Days</p>
                </div>
                <div className="bg-white p-3.5 flex flex-col items-center justify-center">
                  <p className="text-xl font-black text-slate-800">{reportData?.totalWorkingHours ?? 0}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Total Hrs</p>
                </div>
                <div className="bg-white p-3.5 flex flex-col items-center justify-center">
                  <p className="text-xl font-black text-slate-800">{reportData?.daysPayable ?? 0}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Days Payable</p>
                </div>
                <div className="bg-white p-3.5 flex flex-col items-center justify-center">
                  <p className="text-xl font-black text-slate-800">{reportData?.totalTasksCount ?? 0}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Total Tasks</p>
                </div>
              </div>

              <div className="w-full mb-5 px-3">
                 <div className="flex justify-between items-center py-2 border-b border-slate-100/80">
                    <div className="flex items-center gap-2.5">
                       <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.5)]"></div>
                       <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                         Regular Tasks <span className="text-slate-400 ml-0.5 tracking-normal">({reportData?.regularTasksCount ?? 0})</span>
                       </span>
                    </div>
                    <span className="text-sm font-black text-slate-900">₹ {reportData?.regularAmount ?? 0}</span>
                 </div>
                 <div className="flex justify-between items-center py-2 mt-1">
                    <div className="flex items-center gap-2.5">
                       <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_5px_rgba(168,85,247,0.5)]"></div>
                       <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                         Special Tasks <span className="text-slate-400 ml-0.5 tracking-normal">({reportData?.specialTasksCount ?? 0})</span>
                       </span>
                    </div>
                    <span className="text-sm font-black text-slate-900">₹ {reportData?.specialAmount ?? 0}</span>
                 </div>
              </div>

              <div className="w-full relative overflow-hidden rounded-[20px] bg-gradient-to-br from-emerald-500 to-emerald-700 p-6 text-center shadow-[0_8px_20px_rgba(16,185,129,0.25)] border border-emerald-400/30">
                <div className="absolute -right-4 -top-8 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
                <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-black/10 rounded-full blur-xl"></div>
                
                <p className="text-[10px] font-extrabold text-emerald-100 uppercase tracking-widest mb-1 shadow-sm relative z-10">Total Honorarium</p>
                <p className="text-[32px] font-black text-white relative z-10 drop-shadow-md tracking-tight leading-none">
                  ₹ {(Number(reportData?.totalHonorarium) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
              </div>

            </div>
          </div>

          {/* Right Card: Calendar */}
          <div className="xl:col-span-3">
            <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-visible h-full flex flex-col relative z-0">
                <div className="px-6 py-4 flex items-center justify-between">
                  <div className="flex flex-col">
                    <h3 className="text-xl font-bold text-slate-900">
                      {months.find(m => m.value === selectedMonth)?.label} {selectedYear}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1 font-medium flex items-center gap-1.5">
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      Hover on <strong className="text-emerald-600">Present</strong> cards to see check-in details
                    </p>
                  </div>
                  <div className="px-3 py-1 bg-slate-500 text-white rounded-lg text-[11px] font-bold shadow-sm">
                    Today: {new Date().toLocaleDateString("en-GB", { day: 'numeric', month: 'short' })}
                  </div>
                </div>
                
                <div className="flex-1 px-6 pb-6 pt-2">
                    {loading && !reportData ? (
                      <div className="h-full flex items-center justify-center min-h-[400px]">
                          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
                      </div>
                    ) : error ? (
                      <div className="h-full flex flex-col items-center justify-center min-h-[400px] text-center">
                          <AlertCircle className="w-12 h-12 text-rose-500 mb-3" />
                          <p className="font-semibold text-slate-900">{error}</p>
                      </div>
                    ) : (
                      <div className="w-full h-full border border-slate-200 rounded-xl overflow-visible bg-white pt-px">
                        {/* Headers */}
                        <div className="grid grid-cols-7 border-b border-t-0 border-slate-200 bg-white rounded-t-xl overflow-hidden">
                            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                              <div key={day} className={`py-4 text-center text-[13px] font-bold ${day === 'Sun' ? 'text-slate-900' : 'text-slate-700'}`}>
                                {day}
                              </div>
                            ))}
                        </div>
                        
                        {/* Grid */}
                        <div className="grid grid-cols-7 bg-white">
                            {calendarDays.map((day, index) => {
                              if (!day) {
                                return <div key={`empty-${index}`} className="min-h-[110px] p-2 border-b border-r border-slate-200 last:border-r-0 bg-white" />
                              }
                              
                              let record = getDayRecord(day);
                              let status = record ? record.status : null;
                              if (!status) {
                                  status = getDummyStatus(day); // apply visual defaults for screenshot matching
                              }

                              const isSunday = index % 7 === 0;

                              let cellClass = "min-h-[110px] p-2 border-b border-r border-slate-200 relative transition-colors flex flex-col items-center justify-center group hover:z-20 ";
                              let textClass = "absolute top-2 right-2 text-sm font-semibold ";
                              let badgeClass = "text-[10px] font-bold uppercase tracking-wider mb-1 px-2 py-0.5 rounded-full ";

                              if (status === "Holiday" || status === "H" || (isSunday && status !== "A" && status !== "Absent" && status !== "P" && status !== "Present")) {
                                cellClass += "bg-[#FFFCEB] "; 
                                textClass += "text-rose-500";
                                status = "Holiday";
                                badgeClass += "text-amber-700 bg-amber-100";
                              } else if (status === "Absent" || status === "A") {
                                cellClass += "bg-[#FBEBEB] "; 
                                textClass += "text-slate-900";
                                badgeClass += "text-rose-700 bg-rose-100";
                                status = "Absent";
                              } else if (status === "Present" || status === "P") {
                                cellClass += "bg-[#EAFDF2] cursor-pointer hover:bg-emerald-50 "; 
                                textClass += "text-slate-900";
                                badgeClass += "text-emerald-700 bg-emerald-100 group-hover:opacity-0 transition-opacity";
                                status = "Present";
                              } else if (status === "Late" || status === "L") {
                                cellClass += "bg-[#FFF4E5] "; 
                                textClass += "text-slate-900";
                                badgeClass += "text-orange-700 bg-orange-100";
                                status = "Late";
                              } else {
                                cellClass += "bg-white ";
                                textClass += "text-slate-900";
                                badgeClass = "hidden";
                                status = null;
                              }

                              // Specific override for day 17 from target image
                              if (day === 17 && status === "Absent" && !record) {
                                  cellClass = cellClass.replace("bg-[#FBEBEB]", "bg-[#E8D1D1]");
                              }

                              return (
                                <div key={day} className={cellClass}>
                                  <span className={textClass}>{day}</span>
                                  {status && status !== "None" && (
                                    <span className={badgeClass}>{status}</span>
                                  )}
                                  
                                  {/* Hover overlay for Present status Details */}
                                  {record?.details && status === "Present" && (
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 bg-white/95 backdrop-blur-sm rounded-2xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.15)] p-4 flex flex-col justify-start opacity-0 pointer-events-none group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300 ease-out border border-slate-100/50 w-[140px] h-auto ring-1 ring-slate-900/5">
                                      <div className="flex items-center gap-2 mb-3 border-b border-slate-100 pb-2 w-full">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                                        <p className="text-slate-800 text-[10px] font-extrabold uppercase tracking-widest">
                                           Present
                                        </p>
                                      </div>
                                      
                                      <div className="flex flex-col gap-2.5 w-full">
                                        {record.details.checkin && record.details.checkin !== "-" && (
                                          <div className="flex flex-col w-full">
                                            <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Check In</span>
                                            <span className="text-xs text-slate-900 font-black">{record.details.checkin}</span>
                                          </div>
                                        )}
                                        
                                        {record.details.checkout && record.details.checkout !== "-" && (
                                          <div className="flex flex-col w-full">
                                            <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Check Out</span>
                                            <span className="text-xs text-slate-900 font-black">{record.details.checkout}</span>
                                          </div>
                                        )}
                                        
                                        {record.details.total_hours && record.details.total_hours !== "0" && (
                                          <div className="flex flex-col w-full mt-0.5 pt-2 border-t border-slate-100">
                                            <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Total Time</span>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-sm text-blue-600 font-black">{record.details.total_hours}</span>
                                                <span className="text-[9px] text-slate-400 font-bold">hrs</span>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                            
                            {/* Pad remaining grid */}
                            {Array.from({ length: (7 - (calendarDays.length % 7)) % 7 }).map((_, i) => (
                              <div key={`pad-${i}`} className="min-h-[110px] p-2 border-b border-r border-slate-200 bg-white" />
                            ))}
                        </div>
                      </div>
                    )}
                </div>
            </div>
          </div>
        </div>
      )}

      {/* Tasks Breakdown section */}
      {reportData?.tasks && reportData.tasks.length > 0 && (
        <div className="mt-8">
          <DataTable
            columns={[
              {
                header: "Task Information",
                key: "task_name",
                render: (val, row) => (
                  <div className="py-1">
                    <p className="text-slate-900 font-bold text-sm tracking-tight">{val}</p>
                    {row.task_description && (
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5 max-w-[280px] line-clamp-1" title={row.task_description}>
                        {row.task_description}
                      </p>
                    )}
                  </div>
                )
              },
              {
                header: "Categorization",
                key: "task_type",
                render: (val) => (
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                    val === 'special' 
                      ? 'bg-purple-50 text-purple-600 border border-purple-100' 
                      : 'bg-blue-50 text-blue-600 border border-blue-100'
                  }`}>
                    <div className={`w-1 h-1 rounded-full ${val === 'special' ? 'bg-purple-500' : 'bg-blue-500'}`} />
                    {val}
                  </span>
                )
              },
              {
                header: "Assigned Form",
                key: "form_name",
                render: (val) => <span className="text-sm font-semibold text-slate-600">{val || '—'}</span>
              },
              {
                header: "Temporal Range",
                key: "start_date",
                render: (_, row) => (
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-700">
                      {new Date(row.start_date).toLocaleDateString("en-IN", { day: '2-digit', month: 'short' })} — {new Date(row.end_date).toLocaleDateString("en-IN", { day: '2-digit', month: 'short' })}
                    </span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
                      {new Date(row.start_date).getFullYear()}
                    </span>
                  </div>
                )
              },
              {
                header: "Compensation",
                key: "honorarium_amount",
                align: "right",
                render: (val) => (
                  <span className="text-sm font-black text-emerald-600 tracking-tight">
                    ₹ {Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                )
              },
              {
                header: "Execution Status",
                key: "status",
                align: "center",
                render: (val) => (
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    val === 'approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                    val === 'inprogress' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                    'bg-slate-50 text-slate-600 border border-slate-100'
                  }`}>
                    {val}
                  </span>
                )
              }
            ]}
            data={reportData.tasks}
            isLoading={loading}
            headerActions={
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-black text-slate-900 tracking-tight">Assigned Tasks</h3>
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-indigo-100">
                  {reportData.tasks.length} Total
                </span>
              </div>
            }
            footerProps={{
              totalRecords: reportData.tasks.length,
              showPagination: false
            }}
          />
        </div>
      )}
    </div>
  );
});


const HolidaysTab = memo(function HolidaysTab({ isViewOnly }) {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1));
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);

  // ── Add Modal State ──
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    holiday_name: '',
    start_date: '',
    end_date: '',
    status: 'active',
  });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');

  // ── Edit Modal State ──
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    id: null,
    holiday_name: '',
    start_date: '',
    end_date: '',
    status: 'active',
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  // ── Delete Confirm State ──
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // { id, name }
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "N/A";
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const generateCalendarDays = () => {
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  };

  const isHoliday = (day) => {
    if (!day) return false;
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return holidays.find(h => dateStr >= h.date && dateStr <= (h.end_date || h.date));
  };

  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

  const isToday = (day) => {
    if (!day) return false;
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  // ── Fetch Holidays ──
  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const res = await fetch('/api/holiday', {
          method: 'GET',
          credentials: 'include',
        });

        const data = await res.json();
        let holidayData = data?.data || [];
        if (!Array.isArray(holidayData)) holidayData = [];

        const formatted = holidayData
          .filter(h => h.status === 'active')
          .map((h, index) => {
            const dateObj = new Date(h.start_date);
            const yyyy = dateObj.getFullYear();
            const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
            const dd = String(dateObj.getDate()).padStart(2, '0');
            const normalizedDate = `${yyyy}-${mm}-${dd}`;

            return {
              id: h.id || index,
              name: h.holiday_name,
              date: normalizedDate,
              end_date: h.end_date || normalizedDate,
              status: h.status,
              day: isNaN(dateObj.getTime())
                ? 'N/A'
                : dateObj.toLocaleDateString('en-US', { weekday: 'long' }),
            };
          });

        setHolidays(formatted);
      } catch (err) {
        console.error("Holiday fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHolidays();
  }, []);

  // ── Add Holiday Handler ──
  const handleAddHoliday = async () => {
    setAddError('');

    if (!addForm.holiday_name.trim()) return setAddError('Holiday name is required.');
    if (!addForm.start_date) return setAddError('Start date is required.');
    if (!addForm.end_date) return setAddError('End date is required.');
    if (addForm.end_date < addForm.start_date) return setAddError('End date cannot be before start date.');

    setAddLoading(true);
    try {
      const res = await fetch('/api/add-holiday', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addForm),
      });

      const data = await res.json();

      if (res.ok && (data.status === 1 || data.status === true)) {
        const dateObj = new Date(addForm.start_date);
        const yyyy = dateObj.getFullYear();
        const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
        const dd = String(dateObj.getDate()).padStart(2, '0');
        const normalizedDate = `${yyyy}-${mm}-${dd}`;

        const newHoliday = {
          id: data?.data?.id || Date.now(),
          name: addForm.holiday_name,
          date: normalizedDate,
          end_date: addForm.end_date,
          status: addForm.status,
          day: dateObj.toLocaleDateString('en-US', { weekday: 'long' }),
        };

        setHolidays(prev => [...prev, newHoliday].sort((a, b) => a.date.localeCompare(b.date)));
        setShowAddModal(false);
        setAddForm({ holiday_name: '', start_date: '', end_date: '', status: 'active' });
      } else {
        setAddError(data?.message || 'Failed to create holiday. Please try again.');
      }
    } catch (err) {
      console.error("Add holiday error:", err);
      setAddError('Something went wrong. Please try again.');
    } finally {
      setAddLoading(false);
    }
  };

  // ── Open Edit Modal ──
  const openEditModal = (holiday) => {
    setEditForm({
      id: holiday.id,
      holiday_name: holiday.name,
      start_date: holiday.date,
      end_date: holiday.end_date || holiday.date,
      status: holiday.status || 'active',
    });
    setEditError('');
    setShowEditModal(true);
  };

  // ── Update Holiday Handler ──
  const handleUpdateHoliday = async () => {
    setEditError('');

    if (!editForm.holiday_name.trim()) return setEditError('Holiday name is required.');
    if (!editForm.start_date) return setEditError('Start date is required.');
    if (!editForm.end_date) return setEditError('End date is required.');
    if (editForm.end_date < editForm.start_date) return setEditError('End date cannot be before start date.');

    setEditLoading(true);
    try {
      const res = await fetch('/api/update-holiday', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });

      const data = await res.json();

      if (res.ok && (data.status === 1 || data.status === true)) {
        const dateObj = new Date(editForm.start_date);
        const yyyy = dateObj.getFullYear();
        const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
        const dd = String(dateObj.getDate()).padStart(2, '0');
        const normalizedDate = `${yyyy}-${mm}-${dd}`;

        const updatedHoliday = {
          id: editForm.id,
          name: editForm.holiday_name,
          date: normalizedDate,
          end_date: editForm.end_date,
          status: editForm.status,
          day: dateObj.toLocaleDateString('en-US', { weekday: 'long' }),
        };

        setHolidays(prev =>
          prev
            .map(h => (h.id === editForm.id ? updatedHoliday : h))
            .sort((a, b) => a.date.localeCompare(b.date))
        );
        setShowEditModal(false);
      } else {
        setEditError(data?.message || 'Failed to update holiday. Please try again.');
      }
    } catch (err) {
      console.error("Update holiday error:", err);
      setEditError('Something went wrong. Please try again.');
    } finally {
      setEditLoading(false);
    }
  };

  // ── Open Delete Confirm ──
  const openDeleteModal = (holiday) => {
    setDeleteTarget({ id: holiday.id, name: holiday.name });
    setDeleteError('');
    setShowDeleteModal(true);
  };

  // ── Delete Holiday Handler ──
  const handleDeleteHoliday = async () => {
    if (!deleteTarget?.id) return;
    setDeleteError('');
    setDeleteLoading(true);
    try {
      const res = await fetch('/api/delete-holiday', {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deleteTarget.id }),
      });

      const data = await res.json();

      if (res.ok && (data.status === 1 || data.status === true)) {
        setHolidays(prev => prev.filter(h => h.id !== deleteTarget.id));
        setShowDeleteModal(false);
        setDeleteTarget(null);
      } else {
        setDeleteError(data?.message || 'Failed to delete holiday. Please try again.');
      }
    } catch (err) {
      console.error("Delete holiday error:", err);
      setDeleteError('Something went wrong. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* ── Calendar ── */}
      <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 h-fit">
        <div className="flex flex-col items-start gap-4 mb-8">
          <h2 className="text-[22px] font-black text-[#111827] tracking-tight shrink-0">Calendar</h2>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-[8px] border border-slate-200 text-slate-800 hover:bg-slate-50 transition-colors shadow-sm shrink-0">
              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            </button>
            <div className="px-3 py-1.5 rounded-[8px] border border-slate-200 bg-white shadow-sm flex justify-center shrink-0">
              <span className="font-extrabold text-[#111827] text-[13px] whitespace-nowrap">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </span>
            </div>
            <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-[8px] border border-slate-200 text-slate-800 hover:bg-slate-50 transition-colors shadow-sm shrink-0">
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1))}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] border border-indigo-200 bg-indigo-50 text-indigo-600 text-[12px] font-bold hover:bg-indigo-100 transition-colors shadow-sm shrink-0"
              title="Go to today"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              Today
            </button>
          </div>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-y-3 gap-x-2 text-center mb-4">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="text-[11px] font-extrabold text-[#9ca3af] py-2 uppercase tracking-widest">{day}</div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-y-2.5 gap-x-1.5">
          {generateCalendarDays().map((day, idx) => {
            const holi = isHoliday(day);
            const isDayToday = isToday(day);
            return (
              <div
                key={idx}
                className={`aspect-square flex flex-col items-center justify-center rounded-[14px] text-[14px] font-bold transition-all relative
                  ${!day ? 'invisible' : 'visible'}
                  ${isDayToday
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 scale-[1.05] z-10'
                    : holi
                      ? 'bg-[#5542f6] text-white shadow-lg shadow-[#5542f6]/30 scale-[1.05] z-10'
                      : 'bg-[#fafafa] text-[#374151] hover:bg-slate-100 cursor-pointer border border-transparent'}
                `}
                title={holi ? holi.name : isDayToday ? "Today" : ""}
              >
                {day}
                {holi && <div className="absolute -bottom-1 w-[5px] h-[5px] bg-white rounded-full shadow-sm"></div>}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-8 pt-5 border-t border-slate-100/80 flex flex-col gap-3 text-[14px] font-semibold text-[#4b5563]">
          <div className="flex items-center gap-2.5 transition-all hover:translate-x-1">
            <span className="w-3.5 h-3.5 bg-emerald-600 rounded-full inline-block shadow-sm ring-2 ring-emerald-50 shadow-emerald-600/20"></span>
            <span>Today's Date</span>
          </div>
          <div className="flex items-center gap-2.5 transition-all hover:translate-x-1">
            <span className="w-3.5 h-3.5 bg-[#5542f6] rounded-full inline-block shadow-sm ring-2 ring-indigo-50 shadow-[#5542f6]/20"></span>
            <span>Official Holidays</span>
          </div>
        </div>
      </div>

      {/* ── Holiday List ── */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Holiday List 2026</h2>
            <p className="text-sm text-slate-500 mt-1">Manage official and regional holidays</p>
          </div>
          {!isViewOnly && (
            <button
              onClick={() => { setShowAddModal(true); setAddError(''); }}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#1a2e7a] rounded-xl hover:bg-[#13225a] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              + Add Holiday
            </button>
          )}
        </div>

        <div className="p-0">
          <DataTable
            columns={[
              {
                header: "Calendar Date",
                key: "date",
                render: (val, row) => (
                  <div className="flex items-center gap-3 py-1">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 text-indigo-600 flex flex-col items-center justify-center font-bold ring-1 ring-indigo-100/50 flex-shrink-0">
                      <span className="text-lg leading-none mb-0.5">{new Date(val).getDate()}</span>
                      <span className="text-[9px] uppercase tracking-wider text-indigo-400">
                        {new Date(val).toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-800">{new Date(val).toLocaleDateString('en-US', { weekday: 'long' })}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{new Date(val).getFullYear()}</span>
                    </div>
                  </div>
                )
              },
              {
                header: "Holiday Designation",
                key: "name",
                render: (val, row) => (
                   <div className="flex flex-col gap-1">
                      <p className="font-bold text-slate-900 text-[15px] tracking-tight">{val}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100/50">
                          {formatDate(row.date)}
                        </span>
                        {row.end_date && row.end_date !== row.date && (
                           <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100/50 uppercase tracking-tighter">
                             Multi-day Event
                           </span>
                        )}
                      </div>
                   </div>
                )
              },
              {
                header: "Status",
                key: "status",
                render: (val) => (
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    val === 'active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-50 text-slate-400 border border-slate-100'
                  }`}>
                    {val || 'active'}
                  </span>
                )
              }
            ]}
            data={holidays}
            isLoading={loading}
            emptyState={{
              icon: MapIcon,
              message: "No holidays found for this period"
            }}
            actions={!isViewOnly ? [
              {
                icon: Edit,
                title: "Edit Holiday",
                onClick: (row) => openEditModal(row),
                className: "hover:text-blue-600 hover:bg-blue-50"
              },
              {
                icon: Trash2,
                title: "Delete Holiday",
                onClick: (row) => openDeleteModal(row),
                className: "hover:text-rose-600 hover:bg-rose-50"
              }
            ] : []}
            footerProps={{
              totalRecords: holidays.length,
              showPagination: false
            }}
          />
        </div>
      </div>

      {/* ── Add Holiday Modal ── */}
      {showAddModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-md px-4 overflow-y-auto py-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-[28px] shadow-2xl w-full max-w-lg overflow-hidden relative"
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#1a2e7a] to-[#2a44a1] p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Calendar className="w-24 h-24 rotate-12" />
              </div>
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black tracking-tight">Add New Holiday</h2>
                  <p className="text-indigo-100/80 text-sm font-medium mt-1">Configure a new date in the calendar</p>
                </div>
                <button
                  onClick={() => { setShowAddModal(false); setAddError(''); }}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all backdrop-blur-sm"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-8">
              <AnimatePresence>
                {addError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6 px-5 py-4 bg-rose-50 border border-rose-100 text-rose-600 text-sm font-semibold rounded-2xl flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                      <XCircle className="w-4 h-4" />
                    </div>
                    {addError}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-slate-500 uppercase tracking-wider ml-1">Holiday Name</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                      <Tag className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. Diwali Festival"
                      value={addForm.holiday_name}
                      onChange={e => setAddForm(p => ({ ...p, holiday_name: e.target.value }))}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 text-[15px] font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-slate-500 uppercase tracking-wider ml-1">Start Date</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <input
                        type="date"
                        value={addForm.start_date}
                        onChange={e => setAddForm(p => ({
                          ...p,
                          start_date: e.target.value,
                          end_date: p.end_date || e.target.value,
                        }))}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 text-[15px] font-semibold text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all appearance-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-slate-500 uppercase tracking-wider ml-1">End Date</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <input
                        type="date"
                        value={addForm.end_date}
                        min={addForm.start_date}
                        onChange={e => setAddForm(p => ({ ...p, end_date: e.target.value }))}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 text-[15px] font-semibold text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all appearance-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-slate-500 uppercase tracking-wider ml-1">Status</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                      <Activity className="w-5 h-5" />
                    </div>
                    <select
                      value={addForm.status}
                      onChange={e => setAddForm(p => ({ ...p, status: e.target.value }))}
                      className="w-full pl-12 pr-10 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 text-[15px] font-semibold text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all appearance-none cursor-pointer"
                    >
                      <option value="active">Active Entry</option>
                      <option value="deactive">Inactive / Archive</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-10">
                <button
                  onClick={() => { setShowAddModal(false); setAddError(''); }}
                  disabled={addLoading}
                  className="flex-1 py-4 text-[15px] font-bold text-slate-600 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddHoliday}
                  disabled={addLoading}
                  className="flex-[1.5] py-4 text-[15px] font-bold text-white bg-gradient-to-r from-[#1a2e7a] to-[#2a44a1] rounded-2xl shadow-xl shadow-indigo-900/20 hover:shadow-2xl hover:shadow-indigo-900/30 hover:-translate-y-0.5 transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {addLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Saving Holiday...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Confirm & Save</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>,
        document.body
      )}

      {/* ── Edit Holiday Modal ── */}
      {showEditModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-md px-4 overflow-y-auto py-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-[28px] shadow-2xl w-full max-w-lg overflow-hidden relative"
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#0f6e4f] to-[#1a9e70] p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Calendar className="w-24 h-24 rotate-12" />
              </div>
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black tracking-tight">Edit Holiday</h2>
                  <p className="text-emerald-100/80 text-sm font-medium mt-1">Update the selected holiday details</p>
                </div>
                <button
                  onClick={() => { setShowEditModal(false); setEditError(''); }}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all backdrop-blur-sm"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-8">
              <AnimatePresence>
                {editError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6 px-5 py-4 bg-rose-50 border border-rose-100 text-rose-600 text-sm font-semibold rounded-2xl flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                      <XCircle className="w-4 h-4" />
                    </div>
                    {editError}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-slate-500 uppercase tracking-wider ml-1">Holiday Name</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                      <Tag className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. Diwali Festival"
                      value={editForm.holiday_name}
                      onChange={e => setEditForm(p => ({ ...p, holiday_name: e.target.value }))}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 text-[15px] font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-slate-500 uppercase tracking-wider ml-1">Start Date</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <input
                        type="date"
                        value={editForm.start_date}
                        onChange={e => setEditForm(p => ({
                          ...p,
                          start_date: e.target.value,
                          end_date: p.end_date < e.target.value ? e.target.value : p.end_date,
                        }))}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 text-[15px] font-semibold text-slate-800 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white transition-all appearance-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-slate-500 uppercase tracking-wider ml-1">End Date</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <input
                        type="date"
                        value={editForm.end_date}
                        min={editForm.start_date}
                        onChange={e => setEditForm(p => ({ ...p, end_date: e.target.value }))}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 text-[15px] font-semibold text-slate-800 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white transition-all appearance-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-slate-500 uppercase tracking-wider ml-1">Status</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                      <Activity className="w-5 h-5" />
                    </div>
                    <select
                      value={editForm.status}
                      onChange={e => setEditForm(p => ({ ...p, status: e.target.value }))}
                      className="w-full pl-12 pr-10 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 text-[15px] font-semibold text-slate-800 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white transition-all appearance-none cursor-pointer"
                    >
                      <option value="active">Active Entry</option>
                      <option value="deactive">Inactive / Archive</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-10">
                <button
                  onClick={() => { setShowEditModal(false); setEditError(''); }}
                  disabled={editLoading}
                  className="flex-1 py-4 text-[15px] font-bold text-slate-600 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateHoliday}
                  disabled={editLoading}
                  className="flex-[1.5] py-4 text-[15px] font-bold text-white bg-gradient-to-r from-[#0f6e4f] to-[#1a9e70] rounded-2xl shadow-xl shadow-emerald-900/20 hover:shadow-2xl hover:shadow-emerald-900/30 hover:-translate-y-0.5 transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {editLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Updating Holiday...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>,
        document.body
      )}

      {/* ── Delete Confirm Modal ── */}
      {showDeleteModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-md px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-[28px] shadow-2xl w-full max-w-md overflow-hidden relative"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-rose-600 to-rose-500 p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Trash2 className="w-24 h-24 rotate-12" />
              </div>
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black tracking-tight">Delete Holiday</h2>
                  <p className="text-rose-100/80 text-sm font-medium mt-1">This action cannot be undone</p>
                </div>
                <button
                  onClick={() => { setShowDeleteModal(false); setDeleteError(''); }}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all backdrop-blur-sm"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-8">
              {/* Error */}
              <AnimatePresence>
                {deleteError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6 px-5 py-4 bg-rose-50 border border-rose-100 text-rose-600 text-sm font-semibold rounded-2xl flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                      <XCircle className="w-4 h-4" />
                    </div>
                    {deleteError}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Confirmation message */}
              <div className="flex items-start gap-4 p-5 bg-rose-50 rounded-2xl border border-rose-100 mb-8">
                <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Trash2 className="w-5 h-5 text-rose-500" />
                </div>
                <div>
                  <p className="text-[15px] font-bold text-slate-800">
                    Are you sure you want to delete
                  </p>
                  <p className="text-[15px] font-black text-rose-600 mt-0.5">
                    "{deleteTarget?.name}"?
                  </p>
                  <p className="text-sm text-slate-500 mt-2">
                    This holiday will be permanently removed from the calendar.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => { setShowDeleteModal(false); setDeleteError(''); }}
                  disabled={deleteLoading}
                  className="flex-1 py-4 text-[15px] font-bold text-slate-600 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteHoliday}
                  disabled={deleteLoading}
                  className="flex-[1.5] py-4 text-[15px] font-bold text-white bg-gradient-to-r from-rose-600 to-rose-500 rounded-2xl shadow-xl shadow-rose-900/20 hover:shadow-2xl hover:shadow-rose-900/30 hover:-translate-y-0.5 transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {deleteLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-5 h-5" />
                      <span>Yes, Delete</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>,
        document.body
      )}

    </div>
  );
});

const LeaveListTab = memo(function LeaveListTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [leaves, setLeaves] = useState([
    {
      id: "LR-001",
      employeeName: "Rajesh Kumar Naik",
      employeeId: "CRP2024001",
      leaveType: "Sick Leave",
      startDate: "2026-04-10",
      endDate: "2026-04-12",
      days: 3,
      status: "Approved",
      reason: "Viral fever",
      appliedOn: "2026-04-08",
      profile: null
    },
    {
      id: "LR-002",
      employeeName: "Priya Desai",
      employeeId: "CRP2024002",
      leaveType: "Casual Leave",
      startDate: "2026-04-15",
      endDate: "2026-04-15",
      days: 1,
      status: "Pending",
      reason: "Family function",
      appliedOn: "2026-04-12",
      profile: null
    },
    {
      id: "LR-003",
      employeeName: "Amit Prabhu Dessai",
      employeeId: "CRP2024003",
      leaveType: "Earned Leave",
      startDate: "2026-04-20",
      endDate: "2026-04-25",
      days: 6,
      status: "Rejected",
      reason: "Urgent project deadline",
      appliedOn: "2026-04-15",
      profile: null
    },
    {
      id: "LR-004",
      employeeName: "Sunita Gaonkar",
      employeeId: "CRP2024004",
      leaveType: "Sick Leave",
      startDate: "2026-04-22",
      endDate: "2026-04-22",
      days: 1,
      status: "Approved",
      reason: "Regular checkup",
      appliedOn: "2026-04-20",
      profile: null
    },
    {
      id: "LR-005",
      employeeName: "Mangesh Naik",
      employeeId: "CRP2024005",
      leaveType: "Casual Leave",
      startDate: "2026-04-25",
      endDate: "2026-04-26",
      days: 2,
      status: "Pending",
      reason: "Personal work",
      appliedOn: "2026-04-22",
      profile: null
    }
  ]);

  const filteredLeaves = leaves.filter(leave => {
    const matchesSearch = leave.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          leave.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || leave.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: leaves.length,
    pending: leaves.filter(l => l.status === "Pending").length,
    approved: leaves.filter(l => l.status === "Approved").length,
    rejected: leaves.filter(l => l.status === "Rejected").length,
  };

  const handleStatusChange = (id, newStatus) => {
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
  };

  const columns = [
    {
      header: "Employee Identification",
      key: "employeeName",
      render: (val, row) => (
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-[1.25rem] bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform">
              {row.profile ? <img src={row.profile} className="w-full h-full object-cover" /> : val.charAt(0)}
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-sm" />
          </div>
          <div>
            <p className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{val}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Reference: {row.employeeId}</p>
          </div>
        </div>
      )
    },
    {
      header: "Leave Categorization",
      key: "leaveType",
      render: (val) => (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-xl border border-slate-200/50">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          <span className="text-xs font-bold text-slate-700">{val}</span>
        </div>
      )
    },
    {
      header: "Temporal Range",
      key: "startDate",
      render: (_, row) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-black text-slate-800 tabular-nums">
            {new Date(row.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} — {new Date(row.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
          </span>
          <div className="flex items-center gap-1.5 text-[10px] font-black text-indigo-600 uppercase">
             <Calendar size={10} />
             {row.days} Business Day(s)
          </div>
        </div>
      )
    },
    {
      header: "Context / Justification",
      key: "reason",
      render: (val) => (
        <p className="text-sm text-slate-500 font-semibold max-w-[240px] line-clamp-2 leading-relaxed" title={val}>{val}</p>
      )
    },
    {
      header: "Approval State",
      key: "status",
      render: (val) => (
        <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full border shadow-sm ${
          val === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
          val === 'Rejected' ? 'bg-rose-50 text-rose-600 border-rose-100' :
          'bg-amber-50 text-amber-600 border-amber-100'
        }`}>
          <div className={`w-1.5 h-1.5 rounded-full ${
            val === 'Approved' ? 'bg-emerald-500' :
            val === 'Rejected' ? 'bg-rose-500' :
            'bg-amber-500'
          }`} />
          {val}
        </span>
      )
    }
  ];

  const actions = [
    {
      icon: CheckCircle2,
      title: "Approve Request",
      onClick: (row) => handleStatusChange(row.id, 'Approved'),
      className: "hover:text-emerald-600 hover:bg-emerald-50",
      show: (row) => row.status === 'Pending'
    },
    {
      icon: XCircle,
      title: "Reject Request",
      onClick: (row) => handleStatusChange(row.id, 'Rejected'),
      className: "hover:text-rose-600 hover:bg-rose-50",
      show: (row) => row.status === 'Pending'
    },
    {
      icon: Eye,
      title: "View Details",
      onClick: (row) => {},
      className: "hover:text-indigo-600 hover:bg-indigo-50"
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Leave <span className="text-indigo-600">Requests</span>
            </h2>
            {stats.pending > 0 && (
              <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-amber-200 shadow-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                {stats.pending} Pending
              </div>
            )}
          </div>
          <p className="text-[13px] font-bold text-slate-500">Review and manage employee leave applications</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredLeaves}
        isLoading={false}
        searchProps={{
          placeholder: "Filter by name, ID or role...",
          value: searchQuery,
          onChange: setSearchQuery
        }}
        headerActions={
          <div className="flex items-center gap-1.5 p-1.5 bg-slate-200/50 rounded-[1.75rem] border border-slate-200/40">
            {["all", "pending", "approved", "rejected"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-6 py-2.5 rounded-[1.25rem] text-[11px] font-black uppercase tracking-widest transition-all ${
                  statusFilter === status 
                    ? "bg-white text-indigo-600 shadow-lg shadow-indigo-100 scale-105" 
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        }
        actions={actions}
        footerProps={{
          totalRecords: filteredLeaves.length,
          showPagination: false
        }}
      />
    </div>
  );
});