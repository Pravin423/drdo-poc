import React, { useState, useEffect, useMemo, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, Clock, Calendar, Calendar as CalendarIcon, 
  Search, Timer, ShieldCheck, RefreshCw 
} from "lucide-react";
import MonthlyAttendanceGrid from "./MonthlyAttendanceGrid";
import DataTable from "../../common/DataTable";

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

        if (result.status === 1 || result.success === true || Array.isArray(result?.data?.data) || Array.isArray(result?.data)) {
          let rawData = result?.data?.data || result?.data || result?.attendance || result?.records || [];

          if (!Array.isArray(rawData)) {
            rawData = [];
          }

          const mapped = rawData.map((item, idx) => {
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

  return (
    <div className="space-y-6">
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
            <CalendarIcon className="w-4 h-4 text-indigo-600" />
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
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-xl font-bold text-slate-900">Daily Attendance Record</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Attendance entries for {filters.date} ({attendanceEntries.length} total)
                </p>
              </div>

              <div className="p-6 border-b border-slate-200 bg-slate-50/50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
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

export default MusterRollTab;
