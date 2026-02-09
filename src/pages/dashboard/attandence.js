"use client";

import { useState, useEffect, useRef, useMemo, useCallback, memo } from "react";
import { motion, AnimatePresence, useInView, useMotionValue, useSpring } from "framer-motion";
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
} from "lucide-react";

import ProtectedRoute from "../../components/ProtectedRoute";
import DashboardLayout from "../../components/DashboardLayout";
import QuickActions, { QuickActionsModals } from "../../components/dashboard/QuickActions";
import GISMapTab from "../../components/dashboard/GISMapTab";

export default function AttendanceManagement() {
  const [activeTab, setActiveTab] = useState("overview");
  const [activeModal, setActiveModal] = useState(null);

  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "masterRole", label: "Master Role", icon: Users },
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

            {/* --- Quick Actions --- */}
            <QuickActions onActionClick={setActiveModal} />

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
                {activeTab === "overview" && <OverviewGrid />}
                {activeTab === "masterRole" && <MusterRollTab />}
                {activeTab === "regularization" && <RegularizationTab />}
                {activeTab === "gisMap" && <GISMapTab />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </DashboardLayout>
      
      {/* Modals rendered outside layout */}
      <QuickActionsModals 
        activeModal={activeModal} 
        onClose={() => setActiveModal(null)} 
      />
    </ProtectedRoute>
  );
}

// --- Sub-components ---

const OverviewGrid = memo(function OverviewGrid() {
  const stats = useMemo(() => [
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
      accent: "text-indigo-600 bg-indigo-50 border-indigo-200",
      icon: Timer,
      description: "Average shift duration"
    }
  ], []);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((card, index) => (
          <motion.section
            key={card.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-200"
          >
            {/* --- Top Row --- */}
            <div className="flex justify-between items-start relative z-10">
              {/* Icon box made more rectangular with rounded-lg */}
              <div className={`p-2 rounded-lg ${card.accent} border`}>
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
            <div className="absolute -right-2 -bottom-2 opacity-[0.06] text-slate-900 pointer-events-none">
              <card.icon size={100} strokeWidth={2} />
            </div>
          </motion.section>
        ))}
      </div>

      {/* District-wise Breakdown Section */}
      <DistrictBreakdown />

      {/* Daily Muster Roll and Regularization Requests Section */}
      <DailyMusterRollAndRegularization />
    </>
      
  );
});

const DistrictBreakdown = memo(function DistrictBreakdown() {
  const districts = useMemo(() => [
    { name: "North Goa", totalCRPs: 142, present: 134, absent: 8, exceptions: 5, attendance: 94.4 },
    { name: "South Goa", totalCRPs: 106, present: 98, absent: 8, exceptions: 3, attendance: 92.5 }
  ], []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 overflow-hidden relative"
    >
      <div className="mb-8 relative">
        <h2 className="text-2xl font-bold text-slate-900">District-wise Breakdown</h2>
        <p className="text-sm text-slate-500 mt-1">Attendance comparison across districts</p>
      </div>
      <div className="space-y-6 relative">
        {districts.map((district, index) => (
          <DistrictCard key={district.name} district={district} index={index} />
        ))}
      </div>
    </motion.div>
  );
});

const DistrictCard = memo(function DistrictCard({ district, index }) {
  const { name, totalCRPs, present, absent, exceptions, attendance } = district;
  const presentPercent = (present / totalCRPs) * 100;
  const absentPercent = (absent / totalCRPs) * 100;
  const exceptionsPercent = (exceptions / totalCRPs) * 100;

  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ 
        delay: 0.1 + index * 0.1, 
        duration: 0.4
      }}
      className="group relative bg-gradient-to-br from-white to-slate-50/30 rounded-2xl p-7 border border-slate-200/80 hover:border-blue-300 hover:shadow-lg transition-all duration-200 overflow-hidden"
    >
      {/* Simplified gradient overlay on hover */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-transparent to-purple-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
      />

      <div className="relative flex items-start justify-between mb-7">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 inline-block">
            Regional Unit
          </span>
          <h3 className="text-xl font-extrabold text-slate-900 leading-tight mt-1 tracking-tight">
            {name}
          </h3>
          <p className="text-sm font-medium text-slate-500 mt-2.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            <AnimatedCounter value={totalCRPs} delay={0.2 + index * 0.1} /> Total CRPs
          </p>
        </div>
        
        <div className="text-right">
          <div className="text-4xl font-black bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent tracking-tight">
            <AnimatedCounter value={attendance} decimals={1} delay={0.3 + index * 0.1} />%
          </div>
          <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wide mt-1">attendance</p>
        </div>
      </div>

      <div className="relative grid grid-cols-3 gap-3 mb-6 bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-slate-100 shadow-sm">
        <StatBlock label="Present" value={present} color="text-emerald-600" bgColor="bg-emerald-50" delay={0.3 + index * 0.1} inView={isInView} />
        <StatBlock label="Absent" value={absent} color="text-rose-600" bgColor="bg-rose-50" delay={0.35 + index * 0.1} inView={isInView} />
        <StatBlock label="Exceptions" value={exceptions} color="text-amber-600" bgColor="bg-amber-50" delay={0.4 + index * 0.1} inView={isInView} />
      </div>

      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex shadow-inner relative">
        <motion.div 
          initial={{ width: 0 }} 
          animate={isInView ? { width: `${presentPercent}%` } : {}} 
          transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
        />
        <motion.div 
          initial={{ width: 0 }} 
          animate={isInView ? { width: `${absentPercent}%` } : {}} 
          transition={{ delay: 0.45 + index * 0.1, duration: 0.5 }}
          className="h-full bg-gradient-to-r from-rose-500 to-rose-400"
        />
        <motion.div 
          initial={{ width: 0 }} 
          animate={isInView ? { width: `${exceptionsPercent}%` } : {}} 
          transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
          className="h-full bg-gradient-to-r from-amber-500 to-amber-400"
        />
      </div>
    </motion.div>
  );
});

const AnimatedCounter = memo(function AnimatedCounter({ value, decimals = 0, delay = 0 }) {
  const [count, setCount] = useState(0);
  const nodeRef = useRef(null);
  const isInView = useInView(nodeRef, { once: true });

  useEffect(() => {
    if (!isInView) return;

    const timeout = setTimeout(() => {
      let animationFrame;
      let startTime = null;
      const duration = 800; // Reduced duration for better performance
      const startValue = 0;
      const endValue = value;

      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = startValue + (endValue - startValue) * easeOutQuart;
        
        setCount(current);

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        } else {
          setCount(endValue);
        }
      };

      animationFrame = requestAnimationFrame(animate);
      
      return () => {
        if (animationFrame) cancelAnimationFrame(animationFrame);
      };
    }, delay * 1000);

    return () => clearTimeout(timeout);
  }, [isInView, value, delay]);

  return (
    <span ref={nodeRef} className="inline-block tabular-nums">
      {decimals > 0 ? count.toFixed(decimals) : Math.floor(count)}
    </span>
  );
});

const StatBlock = memo(function StatBlock({ label, value, color, bgColor, delay, inView }) {
  return (
    <div className="text-center relative group/stat">
      <div className={`absolute inset-0 ${bgColor} rounded-lg opacity-0 group-hover/stat:opacity-100 transition-opacity duration-200`} />
      <div className="relative">
        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-wider">{label}</p>
        <p className={`text-2xl font-black ${color} tracking-tight`}>
          <AnimatedCounter value={value} delay={delay + 0.1} />
        </p>
      </div>
    </div>
  );
});

// Combined Daily Muster Roll and Regularization Component for Overview
const DailyMusterRollAndRegularization = memo(function DailyMusterRollAndRegularization() {
  const [filters, setFilters] = useState({
    district: "all",
    block: "all",
    date: "2026-01-30",
    exceptionType: "all"
  });
  const [selectedEntries, setSelectedEntries] = useState([]);
  const [showWorkDetails, setShowWorkDetails] = useState({});
  const [attendanceEntries, setAttendanceEntries] = useState([
    {
      id: 1,
      name: "Rajesh Kumar Naik",
      status: "Present",
      statusColor: "emerald",
      employeeId: "CRP2024001",
      district: "North Goa",
      block: "Pernem",
      location: "Arambol, Pernem, North Goa",
      punchIn: "09:15 AM",
      punchOut: "05:30 PM",
      workHours: "8h 15m",
      supervisor: "Suresh Rane",
      remarks: "Regular attendance",
      approved: true,
      approvedStatus: "Approved",
      exceptionType: null
    },
    {
      id: 2,
      name: "Priya Desai",
      status: "Exception",
      statusColor: "orange",
      employeeId: "CRP2024002",
      district: "North Goa",
      block: "Bicholim",
      location: "Mayem, Bicholim, North Goa",
      punchIn: "09:45 AM",
      punchOut: "05:15 PM",
      workHours: "7h 30m",
      supervisor: "Mangesh Naik",
      remarks: "Location 2.3km from assigned village - Field visit to neighboring SHG",
      crpJustification: "Attended inter-village SHG coordination meeting at Mayem Community Hall as per Block Manager instruction dated 2026-01-29",
      approved: false,
      approvedStatus: "Pending",
      exceptionType: "geo"
    },
    {
      id: 3,
      name: "Amit Patil",
      status: "Exception",
      statusColor: "orange",
      employeeId: "CRP2024003",
      district: "South Goa",
      block: "Quepem",
      location: "Balli, Quepem, South Goa",
      punchIn: "10:15 AM",
      punchOut: "05:45 PM",
      workHours: "7h 30m",
      supervisor: "Rita Fernandes",
      remarks: "Late entry - Traffic jam on national highway",
      approved: false,
      approvedStatus: "Pending",
      exceptionType: "late"
    },
    {
      id: 4,
      name: "Sunita Verma",
      status: "Present",
      statusColor: "emerald",
      employeeId: "CRP2024004",
      district: "South Goa",
      block: "Sanguem",
      location: "Verna, Sanguem, South Goa",
      punchIn: "09:00 AM",
      punchOut: "05:30 PM",
      workHours: "8h 30m",
      supervisor: "John D'Souza",
      remarks: "Regular attendance",
      approved: true,
      approvedStatus: "Approved",
      exceptionType: null
    },
    {
      id: 5,
      name: "Kavita Parsekar",
      status: "Exception",
      statusColor: "orange",
      employeeId: "CRP2024005",
      district: "North Goa",
      block: "Pernem",
      location: "Mandrem, Pernem, North Goa",
      punchIn: "09:30 AM",
      punchOut: "03:45 PM",
      workHours: "6h 15m",
      supervisor: "Ramesh Naik",
      remarks: "Early exit - Medical emergency",
      approved: false,
      approvedStatus: "Pending",
      exceptionType: "early"
    }
  ]);

  const [regularizationRequests, setRegularizationRequests] = useState([
    {
      id: 1,
      name: "Kavita Parsekar",
      priority: "Medium",
      priorityColor: "orange",
      status: "Pending Review",
      requestId: "REG2026001",
      employeeId: "CRP2024008",
      location: "Balli, Quepem",
      requestType: "Missed Punch-out",
      requestDate: "29 Jan 2026",
      submittedOn: "2026-01-30 08:15 AM",
      supervisor: "Ramesh Naik",
      reason: "Mobile phone battery died during field visit to remote SHG location. Unable to mark punch-out at 5:30 PM.",
      workDetails: {
        punchIn: "09:00 AM",
        expectedPunchOut: "05:30 PM",
        actualWorkHours: "8h 30m",
        location: "Balli Village SHG Center"
      },
      supportingDocuments: [
        { name: "Battery_Screenshot.jpg", type: "image" },
        { name: "SHG_Visit_Report.pdf", type: "pdf" }
      ]
    },
    {
      id: 2,
      name: "Deepak Velip",
      priority: "High Priority",
      priorityColor: "rose",
      status: "Pending Review",
      requestId: "REG2026002",
      employeeId: "CRP2024012",
      location: "Valpoi, Sattari",
      requestType: "Late Punch-in",
      requestDate: "30 Jan 2026",
      submittedOn: "2026-01-30 09:45 AM",
      supervisor: "Sunita Desai",
      reason: "Vehicle breakdown on route to village. Arrived 1 hour late after arranging alternate transport.",
      workDetails: {
        punchIn: "10:30 AM",
        expectedPunchOut: "06:00 PM",
        actualWorkHours: "7h 30m",
        location: "Valpoi Primary Health Center"
      },
      supportingDocuments: [
        { name: "Vehicle_Breakdown_Photo.jpg", type: "image" },
        { name: "Mechanic_Receipt.pdf", type: "pdf" }
      ]
    }
  ]);

  const toggleWorkDetails = useCallback((id) => {
    setShowWorkDetails(prev => ({...prev, [id]: !prev[id]}));
  }, []);

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
        ? {...entry, approved: true, approvedStatus: "Approved"} 
        : entry
    ));
    setSelectedEntries(prev => prev.filter(entryId => entryId !== id));
  }, []);

  // Handle bulk approve with useCallback
  const handleBulkApprove = useCallback(() => {
    setAttendanceEntries(prev => prev.map(entry => 
      selectedEntries.includes(entry.id)
        ? {...entry, approved: true, approvedStatus: "Approved"} 
        : entry
    ));
    setSelectedEntries([]);
  }, [selectedEntries]);

  // Handle reject entry with useCallback
  const handleRejectEntry = useCallback((id) => {
    setAttendanceEntries(prev => prev.map(entry => 
      entry.id === id 
        ? {...entry, approved: true, approvedStatus: "Rejected"} 
        : entry
    ));
    setSelectedEntries(prev => prev.filter(entryId => entryId !== id));
  }, []);

  // Handle request info with useCallback
  const handleRequestInfo = useCallback((id) => {
    alert(`Requesting additional information for entry ${id}`);
  }, []);

  // Handle export PDF with useCallback
  const handleExportPDF = useCallback(() => {
    alert(`Exporting ${filteredAttendanceEntries.length} entries to PDF for date ${filters.date}`);
  }, [filteredAttendanceEntries.length, filters.date]);

  // Handle approve regularization request with useCallback
  const handleApproveRequest = useCallback((id) => {
    setRegularizationRequests(prev => prev.map(req => 
      req.id === id 
        ? {...req, status: "Approved"} 
        : req
    ));
  }, []);

  // Handle reject regularization request with useCallback
  const handleRejectRequest = useCallback((id) => {
    setRegularizationRequests(prev => prev.map(req => 
      req.id === id 
        ? {...req, status: "Rejected"} 
        : req
    ));
  }, []);

  // Handle request clarification with useCallback
  const handleRequestClarification = useCallback((id) => {
    alert(`Requesting clarification for request ${id}`);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Daily Muster Roll Section */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Daily Muster Roll</h2>
          <p className="text-sm text-slate-500 mt-1">
            Attendance entries requiring supervisor approval (3 pending)
          </p>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-slate-200 bg-slate-50/50">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">District</label>
              <div className="relative">
                <select
                  value={filters.district}
                  onChange={(e) => setFilters({...filters, district: e.target.value})}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none bg-white"
                >
                  <option value="all">All Districts</option>
                  <option value="north">North Goa</option>
                  <option value="south">South Goa</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Block</label>
              <div className="relative">
                <select
                  value={filters.block}
                  onChange={(e) => setFilters({...filters, block: e.target.value})}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none bg-white"
                >
                  <option value="all">All Blocks</option>
                  <option value="pernem">Pernem</option>
                  <option value="bicholim">Bicholim</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Date</label>
              <input
                type="date"
                value={filters.date}
                onChange={(e) => setFilters({...filters, date: e.target.value})}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Exception Type</label>
              <div className="relative">
                <select
                  value={filters.exceptionType}
                  onChange={(e) => setFilters({...filters, exceptionType: e.target.value})}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none bg-white"
                >
                  <option value="all">All Types</option>
                  <option value="late">Late Punch-in</option>
                  <option value="early">Low GPS Accuracy</option>
                  <option value="geo">Geo-location Mismatch</option>
                   <option value="geo">Missed Punch</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedEntries.length > 0 && selectedEntries.length === pendingEntries.length}
                  onChange={(e) => handleSelectAllPending(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-slate-700">Select All Pending</span>
              </label>
              {selectedEntries.length > 0 && (
                <button
                  onClick={handleBulkApprove}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Approve {selectedEntries.length} Selected
                </button>
              )}
            </div>

            <button 
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export PDF
            </button>
          </div>
        </div>

        {/* Attendance Entries List */}
        <div className="overflow-y-auto max-h-[600px]">
          {filteredAttendanceEntries.length === 0 ? (
            <div className="p-12 text-center">
              <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">No attendance entries found for the selected filters</p>
            </div>
          ) : (
            filteredAttendanceEntries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
            >
              {/* Header Row */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 flex-1">
                  {!entry.approved && (
                    <input
                      type="checkbox"
                      checked={selectedEntries.includes(entry.id)}
                      onChange={(e) => handleEntrySelection(entry.id, e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 mt-1"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-slate-900">{entry.name}</h3>
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                        entry.statusColor === 'emerald' 
                          ? 'bg-emerald-50 text-emerald-700' 
                          : 'bg-orange-50 text-orange-700'
                      }`}>
                        {entry.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        {entry.employeeId}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {entry.location}
                      </span>
                    </p>
                  </div>
                </div>
                {entry.approved && (
                  <span className={`flex items-center gap-1 text-sm font-semibold ${
                    entry.approvedStatus === 'Approved' ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {entry.approvedStatus === 'Approved' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    {entry.approvedStatus}
                  </span>
                )}
                {!entry.approved && (
                  <span className="flex items-center gap-1 text-orange-600 text-sm font-semibold">
                    <Clock className="w-4 h-4" />
                    {entry.approvedStatus}
                  </span>
                )}
              </div>

              {/* Time Details Grid */}
              <div className="grid grid-cols-4 gap-4 mb-3 p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-0.5">Punch In</p>
                  <p className="text-sm font-semibold text-slate-900">{entry.punchIn}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-0.5">Punch Out</p>
                  <p className="text-sm font-semibold text-slate-900">{entry.punchOut}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-0.5">Work Hours</p>
                  <p className="text-sm font-semibold text-slate-900">{entry.workHours}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-0.5">Supervisor</p>
                  <p className="text-sm font-semibold text-slate-900">{entry.supervisor}</p>
                </div>
              </div>

              {/* Remarks */}
              <div className="mb-3">
                <p className="text-xs font-semibold text-slate-500 mb-1">Remarks</p>
                <p className="text-sm text-slate-700">{entry.remarks}</p>
              </div>

              {/* CRP Justification (if exists) */}
              {entry.crpJustification && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs font-semibold text-blue-900 mb-1">CRP Justification</p>
                  <p className="text-sm text-blue-800">{entry.crpJustification}</p>
                </div>
              )}

              {/* Action Buttons */}
              {!entry.approved && (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleApproveEntry(entry.id)}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Approve
                  </button>
                  <button 
                    onClick={() => handleRejectEntry(entry.id)}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-rose-600 rounded-lg hover:bg-rose-700 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                  <button 
                    onClick={() => handleRequestInfo(entry.id)}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <Info className="w-4 h-4" />
                    Request Info
                  </button>
                </div>
              )}
            </motion.div>
            ))
          )}
        </div>
      </motion.div>

      {/* Regularization Requests Section */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Regularization Requests</h2>
              <p className="text-sm text-slate-500 mt-1">
                Missed punch and exception requests with justification trails (2 pending)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                <Filter className="w-5 h-5" />
              </button>
              <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Requests List */}
        <div className="overflow-y-auto max-h-[600px]">
          {regularizationRequests.map((request, index) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 border-b border-slate-100"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-slate-900">{request.name}</h3>
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                      request.priorityColor === 'rose'
                        ? 'bg-rose-50 text-rose-700'
                        : 'bg-orange-50 text-orange-700'
                    }`}>
                      {request.priority}
                    </span>
                    <span className={`flex items-center gap-1 text-xs font-semibold ${
                      request.status === 'Approved' ? 'text-emerald-600' : 
                      request.status === 'Rejected' ? 'text-rose-600' : 
                      'text-orange-600'
                    }`}>
                      {request.status === 'Approved' ? <CheckCircle2 className="w-3.5 h-3.5" /> : 
                       request.status === 'Rejected' ? <XCircle className="w-3.5 h-3.5" /> : 
                       <Clock className="w-3.5 h-3.5" />}
                      {request.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 flex items-center gap-3">
                    <span>#{request.requestId}</span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      {request.employeeId}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {request.location}
                    </span>
                  </p>
                </div>
              </div>

              {/* Request Details Grid */}
              <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-0.5">Request Type</p>
                  <p className="text-sm font-semibold text-slate-900">{request.requestType}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-0.5">Request Date</p>
                  <p className="text-sm font-semibold text-slate-900">{request.requestDate}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-0.5">Submitted On</p>
                  <p className="text-sm font-semibold text-slate-900">{request.submittedOn}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-0.5">Supervisor</p>
                  <p className="text-sm font-semibold text-slate-900">{request.supervisor}</p>
                </div>
              </div>

              {/* Reason */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-slate-500 mb-1">Reason for Regularization</p>
                <p className="text-sm text-slate-700">{request.reason}</p>
              </div>

              {/* Collapsible Work Details */}
              <button
                onClick={() => toggleWorkDetails(request.id)}
                className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 mb-4 transition-colors"
              >
                <ChevronDown className={`w-4 h-4 transition-transform ${showWorkDetails[request.id] ? 'rotate-180' : ''}`} />
                {showWorkDetails[request.id] ? 'Hide' : 'Show'} Work Details & Documents
              </button>

              {showWorkDetails[request.id] && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 space-y-4"
                >
                  {/* Work Details */}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-3">Work Details</h4>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-lg">
                      <div>
                        <p className="text-xs text-slate-500 font-medium mb-1">Punch In</p>
                        <p className="text-sm font-semibold text-slate-900">{request.workDetails.punchIn}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium mb-1">Expected Punch Out</p>
                        <p className="text-sm font-semibold text-slate-900">{request.workDetails.expectedPunchOut}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium mb-1">Actual Work Hours</p>
                        <p className="text-sm font-semibold text-slate-900">{request.workDetails.actualWorkHours}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium mb-1">Location</p>
                        <p className="text-sm font-semibold text-slate-900">{request.workDetails.location}</p>
                      </div>
                    </div>
                  </div>

                  {/* Supporting Documents */}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-3">
                      Supporting Documents ({request.supportingDocuments.length})
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {request.supportingDocuments.map((doc, index) => (
                        <button
                          key={index}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                          <FileText className="w-4 h-4 text-slate-500" />
                          <span>{doc.name}</span>
                          <Download className="w-3.5 h-3.5 text-slate-400" />
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Action Buttons */}
              {request.status === "Pending Review" && (
                <div className="flex items-center gap-2 flex-wrap">
                  <button 
                    onClick={() => handleApproveRequest(request.id)}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Approve Request
                  </button>
                  <button 
                    onClick={() => handleRejectRequest(request.id)}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-rose-600 rounded-lg hover:bg-rose-700 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject Request
                  </button>
                  <button 
                    onClick={() => handleRequestClarification(request.id)}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Request Clarification
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
});

const mockRegularizationRequests = [
    {
      id: 1,
      name: "Kavita Parsekar",
      priority: "Medium",
      priorityColor: "orange",
      status: "Pending Review",
      requestId: "REG2026001",
      employeeId: "CRP2024008",
      location: "Balli, Quepem",
      requestType: "Missed Punch-out",
      requestDate: "29 Jan 2026",
      submittedOn: "2026-01-30 08:15 AM",
      supervisor: "Ramesh Naik",
      reason: "Mobile phone battery died during field visit to remote SHG location. Unable to mark punch-out at 5:30 PM."
    },
    {
      id: 2,
      name: "Deepak Velip",
      priority: "High Priority",
      priorityColor: "rose",
      status: "Pending Review",
      requestId: "REG2026002",
      employeeId: "CRP2024012",
      location: "Valpoi, Sattari",
      requestType: "Late Punch-in",
      requestDate: "30 Jan 2026",
      submittedOn: "2026-01-30 09:45 AM",
      supervisor: "Sunita Desai",
      reason: "Vehicle breakdown on route to village. Arrived 1 hour late after arranging alternate transport."
    }
  ];



// Muster Roll Tab Component
const MusterRollTab = memo(function MusterRollTab() {
  const [filters, setFilters] = useState({
    district: "all",
    block: "all",
    date: "2026-01-30",
    exceptionType: "all"
  });
  const [selectedEntries, setSelectedEntries] = useState([]);

  const [attendanceEntries, setAttendanceEntries] = useState([
    {
      id: 1,
      name: "Rajesh Kumar Naik",
      status: "Present",
      statusColor: "emerald",
      employeeId: "CRP2024001",
      district: "North Goa",
      block: "Pernem",
      location: "Arambol, Pernem, North Goa",
      punchIn: "09:15 AM",
      punchOut: "05:30 PM",
      workHours: "8h 15m",
      supervisor: "Suresh Rane",
      remarks: "Regular attendance",
      approved: true,
      approvedStatus: "Approved",
      exceptionType: null
    },
    {
      id: 2,
      name: "Priya Desai",
      status: "Exception",
      statusColor: "orange",
      employeeId: "CRP2024002",
      district: "North Goa",
      block: "Bicholim",
      location: "Mayem, Bicholim, North Goa",
      punchIn: "09:45 AM",
      punchOut: "05:15 PM",
      workHours: "7h 30m",
      supervisor: "Mangesh Naik",
      remarks: "Location 2.3km from assigned village - Field visit to neighboring SHG",
      crpJustification: "Attended inter-village SHG coordination meeting at Mayem Community Hall as per Block Manager instruction dated 2026-01-29",
      approved: false,
      approvedStatus: "Pending",
      exceptionType: "geo"
    },
    {
      id: 3,
      name: "Amit Patil",
      status: "Exception",
      statusColor: "orange",
      employeeId: "CRP2024003",
      district: "South Goa",
      block: "Quepem",
      location: "Balli, Quepem, South Goa",
      punchIn: "10:15 AM",
      punchOut: "05:45 PM",
      workHours: "7h 30m",
      supervisor: "Rita Fernandes",
      remarks: "Late entry - Traffic jam on national highway",
      approved: false,
      approvedStatus: "Pending",
      exceptionType: "late"
    },
    {
      id: 4,
      name: "Sunita Verma",
      status: "Present",
      statusColor: "emerald",
      employeeId: "CRP2024004",
      district: "South Goa",
      block: "Sanguem",
      location: "Verna, Sanguem, South Goa",
      punchIn: "09:00 AM",
      punchOut: "05:30 PM",
      workHours: "8h 30m",
      supervisor: "John D'Souza",
      remarks: "Regular attendance",
      approved: true,
      approvedStatus: "Approved",
      exceptionType: null
    },
    {
      id: 5,
      name: "Kavita Parsekar",
      status: "Exception",
      statusColor: "orange",
      employeeId: "CRP2024005",
      district: "North Goa",
      block: "Pernem",
      location: "Mandrem, Pernem, North Goa",
      punchIn: "09:30 AM",
      punchOut: "03:45 PM",
      workHours: "6h 15m",
      supervisor: "Ramesh Naik",
      remarks: "Early exit - Medical emergency",
      approved: false,
      approvedStatus: "Pending",
      exceptionType: "early"
    }
  ]);

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
        ? {...entry, approved: true, approvedStatus: "Approved"} 
        : entry
    ));
    setSelectedEntries(prev => prev.filter(entryId => entryId !== id));
  }, []);

  // Handle reject entry with useCallback
  const handleRejectEntry = useCallback((id) => {
    setAttendanceEntries(prev => prev.map(entry => 
      entry.id === id 
        ? {...entry, approved: true, approvedStatus: "Rejected"} 
        : entry
    ));
    setSelectedEntries(prev => prev.filter(entryId => entryId !== id));
  }, []);

  // Handle request info with useCallback
  const handleRequestInfo = useCallback((id) => {
    alert(`Requesting additional information for entry ${id}`);
  }, []);

  // Handle export PDF with useCallback
  const handleExportPDF = useCallback(() => {
    alert(`Exporting ${filteredAttendanceEntries.length} entries to PDF for date ${filters.date}`);
  }, [filteredAttendanceEntries.length, filters.date]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">Daily Muster Roll</h2>
        <p className="text-sm text-slate-500 mt-1">
          Attendance entries requiring supervisor approval ({pendingEntries.length} pending)
        </p>
      </div>

      {/* Filters */}
      <div className="p-6 border-b border-slate-200 bg-slate-50/50">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">District</label>
            <div className="relative">
              <select
                value={filters.district}
                onChange={(e) => setFilters({...filters, district: e.target.value})}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none bg-white"
              >
                <option value="all">All Districts</option>
                <option value="north">North Goa</option>
                <option value="south">South Goa</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Block</label>
            <div className="relative">
              <select
                value={filters.block}
                onChange={(e) => setFilters({...filters, block: e.target.value})}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none bg-white"
              >
                <option value="all">All Blocks</option>
                <option value="pernem">Pernem</option>
                <option value="bicholim">Bicholim</option>
                <option value="quepem">Quepem</option>
                <option value="sanguem">Sanguem</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Date</label>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters({...filters, date: e.target.value})}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Exception Type</label>
            <div className="relative">
              <select
                value={filters.exceptionType}
                onChange={(e) => setFilters({...filters, exceptionType: e.target.value})}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none bg-white"
              >
                <option value="all">All Types</option>
                <option value="late">Late Punch-in</option>
                <option value="early">Early Punch-out</option>
                <option value="geo">Geo-location Mismatch</option>
                <option value="missed">Missed Punch</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedEntries.length > 0 && selectedEntries.length === pendingEntries.length}
                onChange={(e) => handleSelectAllPending(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-slate-700">Select All Pending</span>
            </label>
          </div>

          <button 
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Attendance Entries List */}
      <div className="divide-y divide-slate-100">
        {filteredAttendanceEntries.length === 0 ? (
          <div className="p-12 text-center">
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No attendance entries found for the selected filters</p>
          </div>
        ) : (
          filteredAttendanceEntries.map((entry) => (
            <div
              key={entry.id}
              className="p-6 hover:bg-slate-50/50 transition-colors"
            >
              {/* Header Row */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 flex-1">
                  {!entry.approved && (
                    <input
                      type="checkbox"
                      checked={selectedEntries.includes(entry.id)}
                      onChange={(e) => handleEntrySelection(entry.id, e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 mt-1"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-slate-900">{entry.name}</h3>
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                        entry.statusColor === 'emerald' 
                          ? 'bg-emerald-50 text-emerald-700' 
                          : 'bg-orange-50 text-orange-700'
                      }`}>
                        {entry.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">
                      {entry.employeeId} • {entry.location}
                    </p>
                  </div>
                </div>
                {entry.approved && (
                  <span className={`flex items-center gap-1 text-sm font-semibold ${
                    entry.approvedStatus === 'Approved' ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {entry.approvedStatus === 'Approved' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    {entry.approvedStatus}
                  </span>
                )}
                {!entry.approved && (
                  <span className="flex items-center gap-1 text-orange-600 text-sm font-semibold">
                    <Clock className="w-4 h-4" />
                    {entry.approvedStatus}
                  </span>
                )}
              </div>

              {/* Time Details Grid */}
              <div className="grid grid-cols-4 gap-4 mb-3 p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-1">Punch In</p>
                  <p className="text-sm font-semibold text-slate-900">{entry.punchIn}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-1">Punch Out</p>
                  <p className="text-sm font-semibold text-slate-900">{entry.punchOut}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-1">Work Hours</p>
                  <p className="text-sm font-semibold text-slate-900">{entry.workHours}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-1">Supervisor</p>
                  <p className="text-sm font-semibold text-slate-900">{entry.supervisor}</p>
                </div>
              </div>

              {/* Remarks */}
              <div className="mb-3">
                <p className="text-xs font-semibold text-slate-500 mb-1">Remarks</p>
                <p className="text-sm text-slate-700">{entry.remarks}</p>
              </div>

              {/* CRP Justification (if exists) */}
              {entry.crpJustification && (
                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-xs font-semibold text-amber-900 mb-1">CRP Justification</p>
                  <p className="text-sm text-amber-800">{entry.crpJustification}</p>
                </div>
              )}

              {/* Action Buttons */}
              {!entry.approved && (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleApproveEntry(entry.id)}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Approve
                  </button>
                  <button 
                    onClick={() => handleRejectEntry(entry.id)}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-rose-600 rounded-lg hover:bg-rose-700 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                  <button 
                    onClick={() => handleRequestInfo(entry.id)}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <Info className="w-4 h-4" />
                    Request Info
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
});

// Regularization Tab Component
const RegularizationTab = memo(function RegularizationTab() {
  const [showWorkDetails, setShowWorkDetails] = useState({});
  const [regularizationRequests, setRegularizationRequests] = useState([
    {
      id: 1,
      name: "Kavita Parsekar",
      priority: "Medium",
      priorityColor: "orange",
      status: "Pending Review",
      requestId: "REG2026001",
      employeeId: "CRP2024008",
      location: "Balli, Quepem",
      requestType: "Missed Punch-out",
      requestDate: "29 Jan 2026",
      submittedOn: "2026-01-30 08:15 AM",
      supervisor: "Ramesh Naik",
      reason: "Mobile phone battery died during field visit to remote SHG location. Unable to mark punch-out at 5:30 PM.",
      workDetails: {
        punchIn: "09:00 AM",
        expectedPunchOut: "05:30 PM",
        actualWorkHours: "8h 30m",
        location: "Balli Village SHG Center"
      },
      supportingDocuments: [
        { name: "Battery_Screenshot.jpg", type: "image" },
        { name: "SHG_Visit_Report.pdf", type: "pdf" }
      ]
    },
    {
      id: 2,
      name: "Deepak Velip",
      priority: "High Priority",
      priorityColor: "rose",
      status: "Pending Review",
      requestId: "REG2026002",
      employeeId: "CRP2024012",
      location: "Valpoi, Sattari",
      requestType: "Late Punch-in",
      requestDate: "30 Jan 2026",
      submittedOn: "2026-01-30 10:45 AM",
      supervisor: "Suresh Rane",
      reason: "Vehicle breakdown on route to village. Arrived 1 hour late after arranging alternate transport.",
      workDetails: {
        punchIn: "10:30 AM",
        expectedPunchOut: "06:00 PM",
        actualWorkHours: "7h 30m",
        location: "Valpoi Primary Health Center"
      },
      supportingDocuments: [
        { name: "Vehicle_Breakdown_Photo.jpg", type: "image" },
        { name: "Mechanic_Receipt.pdf", type: "pdf" }
      ]
    }
  ]);

  const toggleWorkDetails = useCallback((id) => {
    setShowWorkDetails(prev => ({...prev, [id]: !prev[id]}));
  }, []);

  // Handle approve request with useCallback
  const handleApproveRequest = useCallback((id) => {
    setRegularizationRequests(prev => prev.map(req => 
      req.id === id 
        ? {...req, status: "Approved"} 
        : req
    ));
  }, []);

  // Handle reject request with useCallback
  const handleRejectRequest = useCallback((id) => {
    setRegularizationRequests(prev => prev.map(req => 
      req.id === id 
        ? {...req, status: "Rejected"} 
        : req
    ));
  }, []);

  // Handle request clarification with useCallback
  const handleRequestClarification = useCallback((id) => {
    alert(`Requesting clarification for request ${id}`);
  }, []);

  const pendingCount = useMemo(() => 
    regularizationRequests.filter(req => req.status === "Pending Review").length,
    [regularizationRequests]
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Regularization Requests</h2>
            <p className="text-sm text-slate-500 mt-1">
              Missed punch and exception requests with justification trails ({pendingCount} pending)
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="divide-y divide-slate-100">
        {regularizationRequests.map((request) => (
          <div
            key={request.id}
            className="p-6"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-slate-900">{request.name}</h3>
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                    request.priorityColor === 'rose'
                      ? 'bg-rose-50 text-rose-700'
                      : 'bg-orange-50 text-orange-700'
                  }`}>
                    {request.priority}
                  </span>
                  <span className={`flex items-center gap-1 text-xs font-semibold ${
                    request.status === 'Approved' ? 'text-emerald-600' : 
                    request.status === 'Rejected' ? 'text-rose-600' : 
                    'text-orange-600'
                  }`}>
                    {request.status === 'Approved' ? <CheckCircle2 className="w-3.5 h-3.5" /> : 
                     request.status === 'Rejected' ? <XCircle className="w-3.5 h-3.5" /> : 
                     <Clock className="w-3.5 h-3.5" />}
                    {request.status}
                  </span>
                </div>
                <p className="text-sm text-slate-600">
                  #{request.requestId} • {request.employeeId} • {request.location}
                </p>
              </div>
            </div>

            {/* Request Details Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4 p-4 bg-slate-50 rounded-lg">
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">Request Type</p>
                <p className="text-sm font-semibold text-slate-900">{request.requestType}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">Request Date</p>
                <p className="text-sm font-semibold text-slate-900">{request.requestDate}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">Submitted On</p>
                <p className="text-sm font-semibold text-slate-900">{request.submittedOn}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">Supervisor</p>
                <p className="text-sm font-semibold text-slate-900">{request.supervisor}</p>
              </div>
            </div>

            {/* Reason */}
            <div className="mb-4">
              <p className="text-xs font-semibold text-slate-500 mb-1">Reason for Regularization</p>
              <p className="text-sm text-slate-700">{request.reason}</p>
            </div>

            {/* Collapsible Work Details */}
            <button
              onClick={() => toggleWorkDetails(request.id)}
              className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 mb-4 transition-colors"
            >
              <ChevronDown className={`w-4 h-4 transition-transform ${showWorkDetails[request.id] ? 'rotate-180' : ''}`} />
              {showWorkDetails[request.id] ? 'Hide' : 'Show'} Work Details & Documents
            </button>

            {showWorkDetails[request.id] && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 space-y-4"
              >
                {/* Work Details */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-3">Work Details</h4>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="text-xs text-slate-500 font-medium mb-1">Punch In</p>
                      <p className="text-sm font-semibold text-slate-900">{request.workDetails.punchIn}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium mb-1">Expected Punch Out</p>
                      <p className="text-sm font-semibold text-slate-900">{request.workDetails.expectedPunchOut}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium mb-1">Actual Work Hours</p>
                      <p className="text-sm font-semibold text-slate-900">{request.workDetails.actualWorkHours}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium mb-1">Location</p>
                      <p className="text-sm font-semibold text-slate-900">{request.workDetails.location}</p>
                    </div>
                  </div>
                </div>

                {/* Supporting Documents */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-3">
                    Supporting Documents ({request.supportingDocuments.length})
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {request.supportingDocuments.map((doc, index) => (
                      <button
                        key={index}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        <FileText className="w-4 h-4 text-slate-500" />
                        <span>{doc.name}</span>
                        <Download className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Action Buttons */}
            {request.status === "Pending Review" && (
              <div className="flex items-center gap-2 flex-wrap">
                <button 
                  onClick={() => handleApproveRequest(request.id)}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Approve Request
                </button>
                <button 
                  onClick={() => handleRejectRequest(request.id)}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-rose-600 rounded-lg hover:bg-rose-700 transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  Reject Request
                </button>
                <button 
                  onClick={() => handleRequestClarification(request.id)}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  Request Clarification
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
});

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
