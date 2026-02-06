"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
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
} from "lucide-react";

import ProtectedRoute from "../../components/ProtectedRoute";
import DashboardLayout from "../../components/DashboardLayout";

export default function AttendanceManagement() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "musterRoll", label: "Master Role", icon: Users },
    { id: "regularization", label: "Regularization", icon: FileCheck },
    { id: "gisMap", label: "GIS Map", icon: MapIcon },
  ];

  return (
    <ProtectedRoute allowedRole="super-admin">
      <DashboardLayout>
        <div className="min-h-screen  p-2 lg:p-3 xl:p-4">
          <div className="max-w-[1600px] mx-auto space-y-8">

            {/* --- Page Header --- */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                  Attendance <span className="bg-gradient-to-b from-[#3b52ab] to-[#1a2e7a] bg-clip-text text-transparent">Management</span>
                </h1>
                <p className="text-slate-500 font-medium">
                  Real-time tracking and geo-fencing validation across the hierarchy.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
                  <div className="bg-indigo-50 p-2 rounded-xl">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="pr-4 hidden md:block">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">Status Date</p>
                    <p className="text-sm font-bold text-slate-700">Feb 06, 2026</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* --- Navigation Tabs --- */}
            <div className="flex p-1.5 bg-slate-200/50 rounded-2xl w-fit backdrop-blur-sm border border-slate-200/50">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300
                      ${activeTab === tab.id
                        ? "bg-white text-[#1a2e7a] shadow-sm ring-1 ring-slate-200"
                        : "text-slate-500 hover:text-slate-700 hover:bg-white/40"
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
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
                {activeTab === "overview" ? (
                  <OverviewGrid />
                ) : (
                  <PlaceholderSection tabName={activeTab} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

// --- Sub-components ---

function OverviewGrid() {
  const stats = [
    {
      label: "Total CRPs",
      value: "248",
      delta: "12",
      isPositive: true,
      accent: "text-slate-600 bg-slate-50 border-slate-200",
      icon: Users,
      description: "Active CRPs across Goa"
    },
    {
      label: "Present Today",
      value: "232",
      subValue: "(93.5%)",
      delta: "5.2%",
      isPositive: true,
      accent: "text-emerald-600 bg-emerald-50 border-emerald-200",
      icon: CheckCircle2,
      description: "Attendance rate for 30-Jan-2026"
    },
    {
      label: "Absent Today",
      value: "16",
      subValue: "(6.5%)",
      delta: "2.1%",
      isPositive: false,
      accent: "text-rose-600 bg-rose-50 border-rose-200",
      icon: XCircle,
      description: "Including authorized leaves"
    },
    {
      label: "Exceptions",
      value: "8",
      delta: "3",
      isPositive: false,
      accent: "text-amber-600 bg-amber-50 border-amber-200",
      icon: AlertTriangle,
      description: "Geo-location & timing issues"
    },
    {
      label: "Pending Approvals",
      value: "24",
      delta: "8",
      isPositive: null,
      accent: "text-orange-600 bg-orange-50 border-orange-200",
      icon: Clock,
      description: "Awaiting supervisor action"
    },
    {
      label: "Avg Work Hours",
      value: "8.2h",
      delta: "0.3h",
      isPositive: true,
      accent: "text-blue-600 bg-blue-50 border-blue-200",
      icon: Timer,
      description: "Daily average this month"
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((card, index) => (
        <motion.section
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
          whileHover={{ y: -4 }}
          // Changed rounded-[2rem] to rounded-xl for a rectangular look
          className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300"
        >
          {/* --- Top Row --- */}
          <div className="flex justify-between items-start relative z-10">
            {/* Icon box made more rectangular with rounded-lg */}
            <div className={`p-2 rounded-lg ${card.accent} border transition-transform group-hover:scale-105 duration-500`}>
              <card.icon size={18} strokeWidth={2} />
            </div>
            
            {card.isPositive !== null && (
              <div className={`flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-md 
                ${card.isPositive ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'}`}>
                {card.isPositive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                {card.delta}
              </div>
            )}
          </div>

          {/* --- Content --- */}
          <div className="mt-5 space-y-0.5 relative z-10">
            <div className="flex items-baseline gap-2">
              <h4 className="text-2xl font-bold text-slate-900 tracking-tight">{card.value}</h4>
              {card.subValue && (
                <span className="text-xs font-semibold text-slate-400">{card.subValue}</span>
              )}
            </div>
            <p className="text-[13px] font-semibold text-slate-500 uppercase tracking-wider">{card.label}</p>
          </div>

          {/* --- Footer --- */}
          <div className="mt-4 pt-3 border-t border-slate-50 relative z-10">
            <p className="text-[11px] text-slate-400 font-medium">
              {card.description}
            </p>
          </div>

          {/* --- Background Decorative Icon (Adjusted for Rectangle) --- */}
          <div className="absolute -right-2 -bottom-2 opacity-[0.09] text-slate-900 transition-all duration-700 group-hover:scale-110 group-hover:opacity-[0.06] pointer-events-none">
            <card.icon size={100} strokeWidth={2} />
          </div>

          {/* Hover Glow Effect constrained to rounded-xl */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </motion.section>
      ))}
    </div>
  );
}

function PlaceholderSection({ tabName }) {
  return (
    <div className="bg-white border border-slate-200 rounded-[2.5rem] p-12 shadow-sm min-h-[500px] flex flex-col items-center justify-center text-center">
      <div className="bg-indigo-50 p-6 rounded-full mb-6">
        <Search className="w-12 h-12 text-indigo-200" />
      </div>
      <h3 className="text-2xl font-bold text-slate-800">
        Searching for {tabName.replace(/([A-Z])/g, ' $1')} Data...
      </h3>
      <p className="text-slate-500 max-w-sm mt-2 font-medium">
        We're syncing the latest records from the District server. Please wait a moment.
      </p>
      <div className="mt-8 flex gap-3">
        <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors">
          Refresh Node
        </button>
        <button className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors">
          Contact Admin
        </button>
      </div>
    </div>
  );
}