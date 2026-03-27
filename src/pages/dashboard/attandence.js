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
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

import ProtectedRoute from "../../components/ProtectedRoute";
import DashboardLayout from "../../components/DashboardLayout";
import GISMapTab from "../../components/dashboard/GISMapTab";

export default function AttendanceManagement() {
  const [activeTab, setActiveTab] = useState("masterRole");
  const [activeModal, setActiveModal] = useState(null);

  const tabs = [
    { id: "masterRole", label: "Attendance Report", icon: Users },
    { id: "regularization", label: "Employee Work Report", icon: FileCheck },
    { id: "leaveList", label: "Leave List", icon: MapIcon },
    { id: "holidays", label: "Holidays List", icon: MapIcon },
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
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">
                      Status Date
                    </p>
                    <p className="text-sm font-bold text-slate-700">
                      {new Date().toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                </div>
              </div>
            </motion.div>

            {/* --- Overview section always visible --- */}
            <OverviewGrid />

            {/* --- Navigation Tabs --- */}
            <div className="flex overflow-x-auto p-1.5 bg-slate-200/50 rounded-2xl w-fit backdrop-blur-sm border border-slate-200/50">
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
                {activeTab === "masterRole" && <MusterRollTab />}
                {activeTab === "regularization" && <RegularizationTab />}
                {(activeTab === "leaveList" || activeTab === "gisMap") && <GISMapTab />}
                {activeTab === "holidays" && <HolidaysTab />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </DashboardLayout>

    </ProtectedRoute>
  );
}

// --- Sub-components ---

const OverviewGrid = memo(function OverviewGrid() {
  const stats = useMemo(() => [
    {
      label: "Total CRPs",
      value: "248",
      accent: "text-emerald-600 bg-emerald-50",
      icon: Users,
    },
    {
      label: "Present Today",
      value: "232",
      accent: "text-blue-600 bg-blue-50",
      icon: CheckCircle2,
    },
    {
      label: "Absent Today",
      value: "16",
      accent: "text-rose-600 bg-rose-50",
      icon: XCircle,
    },

    {
      label: "Pending Approvals",
      value: "24",
      accent: "text-orange-600 bg-orange-50",
      icon: Clock,
    },
  ], []);

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
                onChange={(e) => setFilters({ ...filters, district: e.target.value })}
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
                onChange={(e) => setFilters({ ...filters, block: e.target.value })}
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
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Exception Type</label>
            <div className="relative">
              <select
                value={filters.exceptionType}
                onChange={(e) => setFilters({ ...filters, exceptionType: e.target.value })}
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
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${entry.statusColor === 'emerald'
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
                  <span className={`flex items-center gap-1 text-sm font-semibold ${entry.approvedStatus === 'Approved' ? 'text-emerald-600' : 'text-rose-600'
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
    setShowWorkDetails(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  // Handle approve request with useCallback
  const handleApproveRequest = useCallback((id) => {
    setRegularizationRequests(prev => prev.map(req =>
      req.id === id
        ? { ...req, status: "Approved" }
        : req
    ));
  }, []);

  // Handle reject request with useCallback
  const handleRejectRequest = useCallback((id) => {
    setRegularizationRequests(prev => prev.map(req =>
      req.id === id
        ? { ...req, status: "Rejected" }
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
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${request.priorityColor === 'rose'
                    ? 'bg-rose-50 text-rose-700'
                    : 'bg-orange-50 text-orange-700'
                    }`}>
                    {request.priority}
                  </span>
                  <span className={`flex items-center gap-1 text-xs font-semibold ${request.status === 'Approved' ? 'text-emerald-600' :
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


// Holidays Tab Component
const HolidaysTab = memo(function HolidaysTab() {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1)); // January 2026

  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  // Calendar logic
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const generateCalendarDays = () => {
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const isHoliday = (day) => {
    if (!day) return false;
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return holidays.find(h => h.date === dateStr);
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
 useEffect(() => {
  const fetchHolidays = async () => {
    try {
      const res = await fetch('/api/holiday', {
        method: 'GET',
        credentials: 'include',
      });

      const data = await res.json();

      // API returns { status: 1, message: "...", data: [...] }
      let holidayData = data?.data || [];
      if (!Array.isArray(holidayData)) holidayData = [];

      const formatted = holidayData
        .filter(h => h.status === 'active') // only show active holidays
        .map((h, index) => {
          // Use start_date as the primary display date
          const dateObj = new Date(h.start_date);

          const yyyy = dateObj.getFullYear();
          const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
          const dd = String(dateObj.getDate()).padStart(2, '0');
          const normalizedDate = `${yyyy}-${mm}-${dd}`;

          // Check if it's multi-day
          const isMultiDay = h.start_date !== h.end_date;
          const type = isMultiDay ? 'National' : 'General'; // or adjust to your logic

          return {
            id: h.id || index,
            name: h.holiday_name,               // ✅ mapped from holiday_name
            date: normalizedDate,               // ✅ mapped from start_date
            end_date: h.end_date,               // optional: store for display
            type,                               // derived
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
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar View */}
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

            {/* ↺ Today button — redirects calendar to current month */}
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

        <div className="grid grid-cols-7 gap-y-3 gap-x-2 text-center mb-4">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="text-[11px] font-extrabold text-[#9ca3af] py-2 uppercase tracking-widest">{day}</div>
          ))}
        </div>

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

      {/* Holiday List */}
      {/* Holiday List */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Holiday List 2026</h2>
            <p className="text-sm text-slate-500 mt-1">Manage official and regional holidays</p>
          </div>

          <button className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#1a2e7a] rounded-xl hover:bg-[#13225a] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
            + Add Holiday
          </button>
        </div>

        <div className="relative overflow-hidden">
          <div
            className="divide-y divide-slate-100 max-h-[550px] overflow-y-auto pr-2 custom-scrollbar scroll-smooth"
            style={{
              maskImage: 'linear-gradient(to bottom, transparent, black 15px, black calc(100% - 25px), transparent)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15px, black calc(100% - 25px), transparent)'
            }}
          >

            {/* 🔥 Loading State */}
            {loading ? (
              <div className="p-6 text-center text-slate-500">
                Loading holidays...
              </div>

            ) : holidays.length === 0 ? (
              /* 🔥 Empty State */
              <div className="p-6 text-center text-slate-400">
                No holidays found
              </div>

            ) : (
              /* 🔥 Data Rendering */
              holidays.map((holiday) => (
                <div
                  key={holiday.id}
                  onClick={() => setCurrentDate(new Date(holiday.date))}
                  className="p-5 flex items-center justify-between hover:bg-slate-50/80 transition-all duration-300 group cursor-pointer border-l-4 border-transparent hover:border-indigo-500"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 text-indigo-600 flex flex-col items-center justify-center font-bold ring-1 ring-indigo-100/50 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-lg leading-none mb-0.5">
                        {new Date(holiday.date).getDate()}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-indigo-400">
                        {monthNames[new Date(holiday.date).getMonth()]?.substring(0, 3) || "N/A"}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-[15px] text-slate-900 group-hover:text-indigo-600 transition-colors duration-300">
                        {holiday.name}
                      </h3>

                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-sm font-medium text-slate-500 flex items-center gap-1.5 bg-slate-100 px-2 py-0.5 rounded-md">
                          <Calendar className="w-3.5 h-3.5" />
                          {holiday.day}
                        </span>

                        <span className={`px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-md 
                    ${holiday.type === 'National'
                            ? 'bg-rose-50 text-rose-600'
                            : 'bg-amber-50 text-amber-600'}
                  `}>
                          {holiday.type}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                    className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all hover:scale-110">
                      <Edit className="w-4 h-4" />
                    </button>

                    <button className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all hover:scale-110">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}

          </div>
        </div>
      </div>
    </div>
  );
});
