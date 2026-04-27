import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  FileCheck,
  Map as MapIcon,
  Download,
  FileText
} from "lucide-react";
import { useRouter } from "next/router";

import ProtectedRoute from "../../components/ProtectedRoute";
import DashboardLayout from "../../components/DashboardLayout";
import GISMapTab from "../../components/dashboard/GISMapTab";

// Super Admin Components
import OverviewGrid from "../../components/super-admin/attendance/OverviewGrid";
import MusterRollTab from "../../components/super-admin/attendance/MusterRollTab";
import WorkReportTab from "../../components/super-admin/attendance/WorkReportTab";
import LeaveListTab from "../../components/super-admin/attendance/LeaveListTab";
import HolidaysTab from "../../components/super-admin/attendance/HolidaysTab";

export default function AttendanceManagement() {
  const router = useRouter();
  const isViewOnly = router.query.viewOnly === "true";

  const [activeTab, setActiveTab] = useState("masterRole");

  const tabs = [
    { id: "masterRole", label: "Attendance Report", icon: Users },
    { id: "workReport", label: "Employee Work Report", icon: FileCheck },
    { id: "leaveList", label: "Leave List", icon: FileText },
    { id: "holidays", label: "Holidays List", icon: MapIcon },
  ];

  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Global Fetch for Stats and Reports
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