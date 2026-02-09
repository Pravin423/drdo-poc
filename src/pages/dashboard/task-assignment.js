"use client";

import { useState, useMemo, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardList,
  Activity,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Download,
  Users,
  FileText,
  RefreshCw,
  Filter,
  Search,
  ChevronDown,
  Plus,
  X,
  ListTodo,
  Edit,
  Trash2,
  Calendar,
  Image as ImageIcon,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  MapPin,
  User,
  CheckCircle2,
  XCircle,
  Info,
} from "lucide-react";
import ProtectedRoute from "../../components/ProtectedRoute";
import DashboardLayout from "../../components/DashboardLayout";

/* ---------------- MOCK DATA ---------------- */
const MOCK_TASKS = [
  {
    id: "TASK173823377184",
    title: "SHG Formation and Registration Drive",
    vertical: "Self Help Groups (SHG)",
    assignedTo: ["Priya Desai", "Anita Fernandes"],
    crpCount: 2,
    progress: 65,
    startDate: "20 Jan 2026",
    endDate: "05 Feb 2026",
    daysOverdue: 4,
    status: "Overdue",
    priority: "HIGH",
    taskType: "Regular Task",
  },
  {
    id: "TASK173823377185",
    title: "MGNREGA Work Site Monitoring",
    vertical: "MGNREGA",
    assignedTo: ["Rajesh Kumar", "Suresh Naik"],
    crpCount: 2,
    progress: 45,
    startDate: "25 Jan 2026",
    endDate: "10 Feb 2026",
    daysLeft: 1,
    status: "active",
    priority: "HIGH",
    taskType: "Monitoring",
  },
  {
    id: "TASK173823377186",
    title: "Health & Nutrition Awareness Campaign",
    vertical: "Health & Nutrition",
    assignedTo: ["Anita Fernandes", "Maria D'Souza"],
    crpCount: 2,
    progress: 80,
    startDate: "22 Jan 2026",
    endDate: "08 Feb 2026",
    daysOverdue: 1,
    status: "Overdue",
    priority: "MEDIUM",
    taskType: "Special Project",
  },
  {
    id: "TASK173823377187",
    title: "PMAY Beneficiary Verification",
    vertical: "Pradhan Mantri Awas Yojana",
    assignedTo: ["Ganesh Parsekar", "Prakash Gaonkar"],
    crpCount: 2,
    progress: 55,
    startDate: "18 Jan 2026",
    endDate: "02 Feb 2026",
    daysOverdue: 7,
    status: "Overdue",
    priority: "HIGH",
    taskType: "Survey",
  },
  {
    id: "TASK173823377188",
    title: "Skill Development Training Coordination",
    vertical: "Education & Skill Development",
    assignedTo: ["Sunita Rane"],
    crpCount: 1,
    progress: 30,
    startDate: "28 Jan 2026",
    endDate: "15 Feb 2026",
    daysLeft: 6,
    status: "active",
    priority: "MEDIUM",
    taskType: "Training",
  },
];

const VERIFICATION_SUBMISSIONS = [
  {
    id: 1,
    taskTitle: "SHG Formation and Registration Drive",
    submittedBy: "Priya Desai (CRP001)",
    submittedDate: "28 Jan 2026, 02:30 pm",
    stats: {
      villagesCovered: 5,
      shgsFormed: 12,
      membersEnrolled: 144,
      trainingSessions: 8,
    },
    activityReport: "Conducted SHG formation drive in 5 villages of North Goa District.\n\nActivities Completed:\n- Organized awareness meetings in Mapusa, Bicholim, Pernem, Bardez, and Tiswadi...",
    evidenceImages: [
      "https://picsum.photos/200/150?random=1",
      "https://picsum.photos/200/150?random=2",
      "https://picsum.photos/200/150?random=3",
    ],
    status: "Pending Review",
  },
];

/* ---------------- STATS CARD ---------------- */
const StatsCard = memo(function StatsCard({ icon: Icon, label, value, subValue, delta, isPositive, accent }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-200"
    >
      {/* Top Row */}
      <div className="flex justify-between items-start relative z-10">
        <div className={`p-2 rounded-lg ${accent} border`}>
          <Icon size={18} strokeWidth={2} />
        </div>

        {isPositive !== null && (
          <div className={`flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-md 
            ${isPositive ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'}`}>
            {isPositive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
            {delta}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mt-5 space-y-0.5 relative z-10">
        <div className="flex items-baseline gap-2">
          <h4 className="text-2xl font-bold text-slate-900 tracking-tight">{value}</h4>
          {subValue && (
            <span className="text-xs font-semibold text-slate-400">{subValue}</span>
          )}
        </div>
        <p className="text-[13px] font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
      </div>

      {/* Background Decorative Icon */}
      <div className="absolute -right-2 -bottom-2 opacity-[0.06] text-slate-900 pointer-events-none">
        <Icon size={100} strokeWidth={2} />
      </div>
    </motion.section>
  );
});

/* ---------------- STATUS BADGE ---------------- */
const StatusBadge = ({ status }) => {
  const styles = {
    Overdue: "bg-rose-50 text-rose-700 border-rose-200",
    active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    completed: "bg-slate-100 text-slate-600 border-slate-200",
    "Pending Review": "bg-orange-50 text-orange-700 border-orange-200",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles.active}`}>
      {status}
    </span>
  );
};

/* ---------------- PRIORITY BADGE ---------------- */
const PriorityBadge = ({ priority }) => {
  const styles = {
    HIGH: "bg-rose-50 text-rose-700 border-rose-200",
    MEDIUM: "bg-orange-50 text-orange-700 border-orange-200",
    LOW: "bg-blue-50 text-blue-700 border-blue-200",
  };

  return (
    <span className={`px-2 py-0.5 rounded text-xs font-bold border ${styles[priority]}`}>
      {priority}
    </span>
  );
};

/* ---------------- PROGRESS BAR ---------------- */
const ProgressBar = ({ percentage }) => {
  const getColor = (percent) => {
    if (percent >= 75) return "bg-emerald-500";
    if (percent >= 50) return "bg-blue-500";
    if (percent >= 25) return "bg-orange-500";
    return "bg-slate-400";
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-semibold text-slate-900">{percentage}%</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${getColor(percentage)}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

/* ---------------- MAIN PAGE COMPONENT ---------------- */
export default function TaskAssignment() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showVerificationQueue, setShowVerificationQueue] = useState(false);
  const [formData, setFormData] = useState({
    taskTitle: "",
    vertical: "",
    taskType: "",
    priority: "",
    startDate: "",
    endDate: "",
    enableAutoAssignment: false,
    assignedCRPs: "",
    description: "",
    deliverables: "",
  });

  const tabs = [
    { id: "overview", label: "Overview", icon: ListTodo },
    { id: "createTask", label: "Create Task", icon: Plus },
    { id: "verification", label: "Verification Queue", icon: FileText },
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCreateTask = () => {
    console.log("Creating task:", formData);
    setShowCreateForm(false);
    setFormData({
      taskTitle: "",
      vertical: "",
      taskType: "",
      priority: "",
      startDate: "",
      endDate: "",
      enableAutoAssignment: false,
      assignedCRPs: "",
      description: "",
      deliverables: "",
    });
  };

  const handleClearForm = () => {
    setFormData({
      taskTitle: "",
      vertical: "",
      taskType: "",
      priority: "",
      startDate: "",
      endDate: "",
      enableAutoAssignment: false,
      assignedCRPs: "",
      description: "",
      deliverables: "",
    });
  };

  const stats = useMemo(() => [
    {
      label: "Total Tasks",
      value: "5",
      delta: "2",
      isPositive: true,
      accent: "text-slate-600 bg-slate-50 border-slate-200",
      icon: ClipboardList,
    },
    {
      label: "Active Tasks",
      value: "5",
      delta: "1",
      isPositive: true,
      accent: "text-blue-600 bg-blue-50 border-blue-200",
      icon: Activity,
    },
    {
      label: "Completed",
      value: "0",
      delta: null,
      isPositive: null,
      accent: "text-emerald-600 bg-emerald-50 border-emerald-200",
      icon: CheckCircle,
    },
    {
      label: "Overdue",
      value: "3",
      delta: "1",
      isPositive: false,
      accent: "text-rose-600 bg-rose-50 border-rose-200",
      icon: AlertCircle,
    },
    {
      label: "Avg Progress",
      value: "55%",
      delta: "5%",
      isPositive: true,
      accent: "text-orange-600 bg-orange-50 border-orange-200",
      icon: TrendingUp,
    },
  ], []);

  return (
    <ProtectedRoute allowedRole="super-admin">
      <DashboardLayout>
        <div className="min-h-screen p-2 lg:p-3 xl:p-4">
          <div className="max-w-[1600px] mx-auto space-y-8">
            {/* Page Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                  Task Assignment <span className="bg-gradient-to-b from-[#3b52ab] to-[#1a2e7a] bg-clip-text text-transparent">Interface</span>
                </h1>
                <p className="text-slate-500 font-medium">
                  Create, assign, and monitor tasks across verticals with comprehensive tracking
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

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {stats.map((card, index) => (
                <StatsCard key={card.label} {...card} />
              ))}
            </div>

            {/* Navigation Tabs */}
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

            {/* Content Area with Animation */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {activeTab === "overview" && <OverviewTab />}
                {activeTab === "createTask" && (
                  <CreateTaskTab
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleCreateTask={handleCreateTask}
                    handleClearForm={handleClearForm}
                  />
                )}
                {activeTab === "verification" && <VerificationTab />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

/* ---------------- OVERVIEW TAB ---------------- */
const OverviewTab = memo(function OverviewTab() {
  const [filters, setFilters] = useState({
    search: "",
    vertical: "all",
    status: "all",
    priority: "all",
    taskType: "all",
    fromDate: "",
    toDate: "",
  });

  return (
    <>
      {/* Filter Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Filter size={20} className="text-slate-700" />
              <h2 className="text-lg font-bold text-slate-900">Filter Tasks</h2>
            </div>
            <p className="text-sm text-slate-500">Refine your task view</p>
          </div>
          <button className="text-sm text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1">
            <RefreshCw size={14} />
            Reset
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
            />
          </div>

          <div className="relative">
            <select
              value={filters.vertical}
              onChange={(e) => setFilters({ ...filters, vertical: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none bg-white"
            >
              <option value="all">All Verticals</option>
              <option>Self Help Groups (SHG)</option>
              <option>MGNREGA</option>
              <option>Health & Nutrition</option>
              <option>Education & Skill Development</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none bg-white"
            >
              <option value="all">All Status</option>
              <option>Active</option>
              <option>Overdue</option>
              <option>Completed</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none bg-white"
            >
              <option value="all">All Priority</option>
              <option>HIGH</option>
              <option>MEDIUM</option>
              <option>LOW</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <select
              value={filters.taskType}
              onChange={(e) => setFilters({ ...filters, taskType: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none bg-white"
            >
              <option value="all">All Task Types</option>
              <option>Regular Task</option>
              <option>Monitoring</option>
              <option>Survey</option>
              <option>Training</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">From Date</label>
            <input
              type="date"
              value={filters.fromDate}
              onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">To Date</label>
            <input
              type="date"
              value={filters.toDate}
              onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
            />
          </div>

          <button className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors mt-6">
            <Search size={16} />
            Apply Filters
          </button>
        </div>
      </div>

      {/* Active Tasks List */}
      <ActiveTasksList />
    </>
  );
});

/* ---------------- ACTIVE TASKS LIST ---------------- */
const ActiveTasksList = memo(function ActiveTasksList() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Active Tasks</h2>
            <p className="text-sm text-slate-500 mt-1">{MOCK_TASKS.length} tasks in progress</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Tasks List */}
      <div className="divide-y divide-slate-100">
        {MOCK_TASKS.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="p-6 hover:bg-slate-50/50 transition-colors"
          >
            {/* Header Row */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-slate-900">{task.title}</h3>
                  <PriorityBadge priority={task.priority} />
                  <StatusBadge status={task.status} />
                </div>
                <p className="text-sm text-slate-600 flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" />
                    ID: {task.id}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span>{task.taskType}</span>
                </p>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4 p-4 bg-slate-50 rounded-lg">
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">Vertical</p>
                <p className="text-sm font-semibold text-slate-900">{task.vertical}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">Assigned To</p>
                <p className="text-sm font-semibold text-slate-900">{task.crpCount} CRPs</p>
                <p className="text-xs text-slate-600">{task.assignedTo.join(", ")}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">Timeline</p>
                <p className="text-sm font-semibold text-slate-900">{task.startDate} to {task.endDate}</p>
                {task.daysOverdue ? (
                  <p className="text-xs text-rose-600 font-medium">{task.daysOverdue} days overdue</p>
                ) : task.daysLeft ? (
                  <p className="text-xs text-emerald-600 font-medium">{task.daysLeft} days left</p>
                ) : null}
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">Progress</p>
                <ProgressBar percentage={task.progress} />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-rose-600 rounded-lg hover:bg-rose-700 transition-colors">
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
              <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                <Info className="w-4 h-4" />
                Details
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
});

/* ---------------- CREATE TASK TAB ---------------- */
const CreateTaskTab = memo(function CreateTaskTab({ formData, handleInputChange, handleCreateTask, handleClearForm }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
      <div className="flex items-start gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
          <ClipboardList className="text-blue-600" size={20} />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-slate-900">Create New Task</h2>
          <p className="text-sm text-slate-600">Assign tasks to CRPs with timeline and deliverables</p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="taskTitle"
              value={formData.taskTitle}
              onChange={handleInputChange}
              placeholder="Enter task title"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Vertical <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="vertical"
                value={formData.vertical}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-600 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none bg-white"
              >
                <option value="">Select vertical</option>
                <option>Self Help Groups (SHG)</option>
                <option>MGNREGA</option>
                <option>Health & Nutrition</option>
                <option>Education & Skill Development</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Task Type <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="taskType"
                value={formData.taskType}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-600 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none bg-white"
              >
                <option value="">Select task type</option>
                <option>Regular Task</option>
                <option>Monitoring</option>
                <option>Survey</option>
                <option>Training</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Priority Level <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-600 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none bg-white"
              >
                <option value="">Select priority</option>
                <option>HIGH</option>
                <option>MEDIUM</option>
                <option>LOW</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Start Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-600 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              End Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-600 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Auto-Assignment Checkbox */}
        <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <input
            type="checkbox"
            name="enableAutoAssignment"
            checked={formData.enableAutoAssignment}
            onChange={handleInputChange}
            className="mt-0.5 w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
          />
          <div>
            <label className="text-sm font-semibold text-slate-900">Enable Auto-Assignment</label>
            <p className="text-xs text-slate-600 mt-0.5">
              Automatically assign this task to eligible CRPs based on vertical and location
            </p>
          </div>
        </div>

        {/* Assign to CRPs */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Assign to CRPs <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              name="assignedCRPs"
              value={formData.assignedCRPs}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-600 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none bg-white"
            >
              <option value="">Select CRPs to assign</option>
              <option>Priya Desai</option>
              <option>Rajesh Kumar</option>
              <option>Anita Fernandes</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
          <p className="text-xs text-slate-500 mt-1.5">Select one or more CRPs for this task</p>
        </div>

        {/* Task Description */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Task Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
            placeholder="Provide detailed task description, objectives, and expected outcomes"
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none"
          />
        </div>

        {/* Deliverables */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Deliverables & Requirements
          </label>
          <textarea
            name="deliverables"
            value={formData.deliverables}
            onChange={handleInputChange}
            rows="4"
            placeholder="List expected deliverables, documentation requirements, and success criteria"
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleCreateTask}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Plus size={18} />
            Create Task
          </button>
          <button
            onClick={handleClearForm}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <X size={18} />
            Clear Form
          </button>
        </div>
      </div>
    </div>
  );
});

/* ---------------- VERIFICATION TAB ---------------- */
const VerificationTab = memo(function VerificationTab() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Verification Queue</h2>
            <p className="text-sm text-slate-500 mt-1">{VERIFICATION_SUBMISSIONS.length} submissions pending review</p>
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

      {/* Submissions List */}
      <div className="divide-y divide-slate-100">
        {VERIFICATION_SUBMISSIONS.map((submission, index) => (
          <motion.div
            key={submission.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="p-6"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-base font-bold text-slate-900 mb-1">{submission.taskTitle}</h3>
                <div className="flex items-center gap-3 text-xs text-slate-600">
                  <span className="flex items-center gap-1">
                    <User size={12} />
                    {submission.submittedBy}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    Submitted: {submission.submittedDate}
                  </span>
                </div>
              </div>
              <StatusBadge status={submission.status} />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 pb-4 border-b border-slate-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">{submission.stats.villagesCovered}</div>
                <div className="text-xs text-slate-600 mt-0.5">Villages Covered</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">{submission.stats.shgsFormed}</div>
                <div className="text-xs text-slate-600 mt-0.5">SHGs Formed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">{submission.stats.membersEnrolled}</div>
                <div className="text-xs text-slate-600 mt-0.5">Members Enrolled</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">{submission.stats.trainingSessions}</div>
                <div className="text-xs text-slate-600 mt-0.5">Training Sessions</div>
              </div>
            </div>

            {/* Activity Report */}
            <div className="mb-4">
              <h4 className="text-sm font-bold text-slate-900 mb-2">Activity Report</h4>
              <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-700 leading-relaxed">
                {submission.activityReport}
              </div>
            </div>

            {/* Evidence Images */}
            <div className="mb-4">
              <h4 className="text-sm font-bold text-slate-900 mb-3">
                Evidence Images ({submission.evidenceImages.length})
              </h4>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {submission.evidenceImages.map((img, idx) => (
                  <div key={idx} className="flex-shrink-0">
                    <img
                      src={img}
                      alt={`Evidence ${idx + 1}`}
                      className="w-32 h-24 object-cover rounded-lg border border-slate-200"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors">
                <CheckCircle2 className="w-4 h-4" />
                Approve
              </button>
              <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-rose-600 rounded-lg hover:bg-rose-700 transition-colors">
                <XCircle className="w-4 h-4" />
                Reject
              </button>
              <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                <Info className="w-4 h-4" />
                Request Info
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
});
