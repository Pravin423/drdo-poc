"use client";

import { useState, useMemo, useCallback, memo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClipboardList, Activity, CheckCircle, AlertCircle, TrendingUp, Download, Users, FileText, RefreshCw, Filter, Search, ChevronDown, Plus, X, ListTodo, Edit, Trash2, Calendar, Image as ImageIcon, ArrowUpRight, ArrowDownRight, Clock, MapPin, User, CheckCircle2, XCircle, Info } from "lucide-react";
import ProtectedRoute from "../../components/ProtectedRoute";
import DashboardLayout from "../../components/DashboardLayout";

/* ---------------- MOCK DATA ---------------- */
const INITIAL_MOCK_TASKS = []; // We will load from API now




/* Helper function to generate unique task ID */
const generateTaskId = () => {
  return `TASK${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
};


/* Helper function to format date */
const formatDateForDisplay = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
};

/* Helper function to parse assigned CRPs from the select value */
const parseAssignedCRPs = (crpString) => {
  if (!crpString) return [];
  return [crpString.split(" - ")[0]]; // Extract just the name from "Name - Location"
};

/* Helper function to count CRPs */
const countCRPs = (assignedTo) => {
  return assignedTo.length;
};

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


const StatusBadge = ({ status }) => {
  const normStatus = status ? status.toLowerCase() : "";

  const styles = {
    approved: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    active: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    completed: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    closed: "bg-slate-50 text-slate-700 border border-slate-200",
    pending: "bg-amber-50 text-amber-700 border border-amber-300/60",
    "pending review": "bg-amber-50 text-amber-700 border border-amber-300/60",
    inprogress: "bg-blue-50 text-blue-700 border border-blue-200",
    overdue: "bg-rose-50 text-rose-700 border border-rose-200",
    deleted: "bg-rose-50 text-rose-700 border border-rose-200",
    rejected: "bg-rose-50 text-rose-700 border border-rose-200",
    "info requested": "bg-blue-50 text-blue-700 border border-blue-200",
  };

  const badgeStyle = styles[normStatus] || "bg-slate-50 text-slate-700 border border-slate-200";

  return (
    <div className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-[12px] font-bold capitalize ${badgeStyle}`}>
      {status}
    </div>
  );
};

const TaskTypeBadge = ({ type }) => {
  const t = type ? type.toUpperCase() : '';
  const isSpecial = t.includes('SPECIAL');
  const isRegular = t.includes('REGULAR');

  let colorClass = "bg-slate-500";
  if (isSpecial) colorClass = "bg-[#f43f5e]";
  else if (isRegular) colorClass = "bg-[#10b981]";

  return (
    <span className={`${colorClass} text-white px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide inline-block`}>
      {type}
    </span>
  );
};

const ActivityFormBadge = ({ formName }) => {
  return (
    <span className="bg-[#00d0e4] text-white px-3.5 py-1.5 rounded-full text-[12px] font-bold inline-block whitespace-nowrap">
      {formName}
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
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/activity-tasks");
      const result = await res.json();

      const tasksData = Array.isArray(result) ? result : (result.data || []);

      let mappedTasks = tasksData.map(t => ({
        id: t.id || Math.random().toString(36).substr(2, 9),
        title: t.task_name,
        description: t.task_description,
        taskType: t.task_type || "REGULAR",
        vertical: t.vertical_name || "-",
        activityForm: t.form_name || "-",
        assignedTo: t.assigned_to_name ? [{ name: t.assigned_to_name, crpId: t.crp_id }] : [],
        startDate: formatDateForDisplay(t.start_date),
        endDate: formatDateForDisplay(t.end_date),
        honorarium: t.honorarium_amount ? `₹${t.honorarium_amount}` : "-",
        status: t.status || "Active",
        progress: t.progress || 0
      }));

      // Sort by ID in ascending order
      mappedTasks.sort((a, b) => {
        const numA = Number(a.id);
        const numB = Number(b.id);
        if (!isNaN(numA) && !isNaN(numB)) {
          return numA - numB;
        }
        return String(a.id).localeCompare(String(b.id));
      });

      setTasks(mappedTasks);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

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
    // Validate required fields
    if (!formData.taskTitle || !formData.vertical || !formData.taskType || !formData.priority || !formData.startDate || !formData.endDate || !formData.assignedCRPs) {
      alert("Please fill in all required fields marked with *");
      return;
    }

    // Parse the assigned CRPs
    const assignedToArray = parseAssignedCRPs(formData.assignedCRPs);

    // Create new task object
    const newTask = {
      id: generateTaskId(),
      title: formData.taskTitle,
      vertical: formData.vertical,
      assignedTo: assignedToArray,
      crpCount: countCRPs(assignedToArray),
      progress: 0, // New tasks start at 0% progress
      startDate: formatDateForDisplay(formData.startDate),
      endDate: formatDateForDisplay(formData.endDate),
      status: "active", // New tasks are active
      priority: formData.priority.toUpperCase().split(" ")[0], // Extract "HIGH", "MEDIUM", or "LOW"
      taskType: formData.taskType.split(" ")[0], // Take first word for brevity
      description: formData.description,
      deliverables: formData.deliverables,
      daysLeft: 1, // You can calculate this properly if needed
    };

    // Add the new task to the tasks array
    setTasks((prevTasks) => [newTask, ...prevTasks]);

    // Log for debugging
    console.log("Creating task:", newTask);

    // Reset form
    handleClearForm();

    // Switch to overview tab to see the new task
    setActiveTab("overview");
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

  const handleDeleteTask = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  const stats = useMemo(() => {
    const completed = tasks.filter((t) => t.status === "completed").length;
    const active = tasks.filter((t) => t.status === "active").length;
    const overdue = tasks.filter((t) => t.status === "Overdue").length;
    const avgProgress = tasks.length > 0 ? Math.round(tasks.reduce((sum, t) => sum + t.progress, 0) / tasks.length) : 0;

    return [
      {
        label: "Total Tasks",
        value: tasks.length.toString(),
        delta: "2",
        isPositive: true,
        accent: "text-slate-600 bg-slate-50 border-slate-200",
        icon: ClipboardList,
      },
      {
        label: "Active Tasks",
        value: active.toString(),
        delta: "1",
        isPositive: true,
        accent: "text-blue-600 bg-blue-50 border-blue-200",
        icon: Activity,
      },
      {
        label: "Completed",
        value: completed.toString(),
        delta: null,
        isPositive: null,
        accent: "text-emerald-600 bg-emerald-50 border-emerald-200",
        icon: CheckCircle,
      },
      {
        label: "Overdue",
        value: overdue.toString(),
        delta: "1",
        isPositive: false,
        accent: "text-rose-600 bg-rose-50 border-rose-200",
        icon: AlertCircle,
      },
      {
        label: "Avg Progress",
        value: `${avgProgress}%`,
        delta: "5%",
        isPositive: true,
        accent: "text-orange-600 bg-orange-50 border-orange-200",
        icon: TrendingUp,
      },
    ];
  }, [tasks]);

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
                {activeTab === "overview" && <OverviewTab tasks={tasks} onDeleteTask={handleDeleteTask} setActiveTab={setActiveTab} />}
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
const OverviewTab = memo(function OverviewTab({ tasks, onDeleteTask, setActiveTab }) {
  return (
    <>

      {/* Active Tasks List */}
      <ActiveTasksList tasks={tasks} onDeleteTask={onDeleteTask} setActiveTab={setActiveTab} />
    </>
  );
});

/* ---------------- ACTIVE TASKS LIST ---------------- */
const ActiveTasksList = memo(function ActiveTasksList({ tasks, onDeleteTask, setActiveTab }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [localSearch, setLocalSearch] = useState("");

  const displayTasks = useMemo(() => {
    return tasks.filter(t =>
      (t.title || "").toLowerCase().includes(localSearch.toLowerCase()) ||
      (t.vertical || "").toLowerCase().includes(localSearch.toLowerCase())
    );
  }, [tasks, localSearch]);

  const totalPages = Math.max(1, Math.ceil(displayTasks.length / itemsPerPage));
  const paginatedTasks = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return displayTasks.slice(start, start + itemsPerPage);
  }, [displayTasks, currentPage, itemsPerPage]);

  return (
    <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden mt-6">
      {/* Header Panel */}
      <div className="px-6 py-5 bg-white border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
          <span>Show</span>
          <select
            className="border border-slate-200 bg-slate-50 text-slate-800 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span>entries</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-end gap-5 w-full lg:w-auto">
          <div className="relative group flex items-center gap-3">
            <span className="text-sm font-semibold text-slate-600">Search:</span>
            <input
              type="text"
              className="border border-slate-200 rounded-xl px-4 py-2 min-w-[240px] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all bg-slate-50/30 focus:bg-white"
              value={localSearch}
              onChange={(e) => {
                setLocalSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <button onClick={() => setActiveTab("createTask")} className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors whitespace-nowrap shadow-sm">
            <Plus size={16} /> Assign Task
          </button>
        </div>
      </div>

      {/* Main Table Layer */}
      <div className="w-full min-h-[400px]">
        <div className="overflow-x-auto overflow-y-visible" style={{ WebkitOverflowScrolling: 'touch', willChange: 'transform' }}>
          <table className="w-full min-w-[1000px] text-left border-collapse">
            <thead className="bg-[#fafcff]/60">
              <tr>
                <th className="px-6 py-5 text-[12px]  text-slate-500 uppercase tracking-widest w-20">ID</th>
                <th className="px-6 py-5 text-[12px]  text-slate-500 uppercase tracking-widest">Task Name</th>
                <th className="px-6 py-5 text-[12px]   text-slate-500 uppercase tracking-widest">Task Type</th>
                <th className="px-6 py-5 text-[12px]  text-slate-500 uppercase tracking-widest">Vertical</th>
                <th className="px-6 py-5 text-[12px]  text-slate-500 uppercase tracking-widest">Activity Form</th>
                <th className="px-6 py-5 text-[12px]  text-slate-500 uppercase tracking-widest">Assigned To</th>
                <th className="px-6 py-5 text-[12px]  text-slate-500 uppercase tracking-widest">Date Range</th>
                <th className="px-6 py-5 text-[12px]  text-slate-500 uppercase tracking-widest">Honorarium</th>
                <th className="px-6 py-5 text-[12px] text-slate-500 uppercase tracking-widest text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {paginatedTasks.length === 0 ? (
                <tr>
                  <td colSpan="9" className="p-1 text-center text-slate-400 text-sm font-medium">No tasks found.</td>
                </tr>
              ) : (
                paginatedTasks.map((task, index) => (
                  <tr key={task.id} className="hover:bg-slate-50/70 transition-colors group">
                    <td className="px-6 py-6 text-[15px] font-bold text-slate-600 align-middle">
                      {String(task.id).startsWith("TASK") ? index + 1 : task.id}
                    </td>

                    <td className="px-6 py-6 align-middle">
                      <div className="flex flex-col max-w-[240px]">
                        <span className="font-semibold text-slate-800 text-[14px]">{task.title}</span>
                      </div>
                    </td>

                    <td className="px-6 py-6 align-middle">
                      <TaskTypeBadge type={task.taskType} />
                    </td>

                    <td className="px-6 py-6 text-[14px] font-medium text-slate-500 max-w-[160px] break-words align-middle">
                      {task.vertical}
                    </td>

                    <td className="px-6 py-6 align-middle font-medium text-slate-800">
                      {task.activityForm ? <ActivityFormBadge formName={task.activityForm} /> : <span className="text-slate-300 font-bold">—</span>}
                    </td>

                    <td className="px-6 py-6 align-middle">
                      {task.assignedTo && task.assignedTo.length > 0 ? (
                        <div className="flex flex-col gap-1">
                          {task.assignedTo.map((a, i) => {
                            const name = typeof a === 'string' ? a : a.name;
                            return (
                              <div key={i} className="mb-0 flex items-center">
                                <span className="text-[14px] font-bold text-slate-700 leading-tight">{name}{i < task.assignedTo.length - 1 && ','}</span>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <span className="text-slate-300 font-bold">—</span>
                      )}
                    </td>

                    <td className="px-6 py-6 text-slate-600 whitespace-nowrap align-middle">
                      <div className="flex flex-col text-[13px] leading-tight font-medium">
                        <span className="text-slate-700 text-[14px]">{task.startDate}</span>
                        <span className="text-slate-400 mt-0.5">to {task.endDate}</span>
                      </div>
                    </td>

                    <td className="px-6 py-6 text-[15px] font-extrabold text-slate-700 align-middle">
                      {task.honorarium || ""}
                    </td>

                    <td className="px-6 py-6 text-center align-middle">
                      <StatusBadge status={task.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Container */}
      {!displayTasks.length ? null : (
        <div className="px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white">
          <span className="text-sm text-slate-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, displayTasks.length)} of {displayTasks.length} entries
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded text-sm hover:bg-slate-50 disabled:opacity-50 transition-colors"
            >
              Previous
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded text-sm bg-blue-600 text-white font-medium">
              {currentPage}
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded text-sm hover:bg-slate-50 disabled:opacity-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

/* ---------------- CREATE TASK TAB ---------------- */
const CreateTaskTab = memo(function CreateTaskTab({ formData, handleInputChange, handleCreateTask, handleClearForm }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
      <div className="flex items-start gap-3 mb-6">

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
                <option>National Rural Livelihood Mission</option>
                <option>Pradhan Mantri Awas Yojana</option>
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
                <option>Regular Task (Auto Assigned)</option>
                <option>Special Project Task</option>
                <option>Monitoring & Evaluation</option>
                <option>Survey & Data Collection</option>
                <option>Training & Capacity Building</option>
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
                <option>HIGH Priority</option>
                <option>MEDIUM Priority</option>
                <option>LOW Priority</option>
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
            className="mt-0.5 w-4 h-4 text-blue-600 mt-[10px] border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
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
              <option>Priya Desai - North Goa District</option>
              <option>Rajesh Kumar - South Goa District</option>
              <option>Anita Fernandes - Tiswadi Taluka</option>
              <option>Ganesh Parsekar - Sattari Taluka</option>
              <option>Maria D'Souza - Ponda Taluka</option>
              <option>Sunita Rane - Quepem Taluka</option>
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
  const [submissions, setSubmissions] = useState(VERIFICATION_SUBMISSIONS);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showRequestInfo, setShowRequestInfo] = useState(false);
  const [requestMessage, setRequestMessage] = useState("");
  const [animatingId, setAnimatingId] = useState(null);

  const handleApprove = (submissionId) => {
    setAnimatingId(submissionId);
    setTimeout(() => {
      setSubmissions((prev) =>
        prev.map((sub) =>
          sub.id === submissionId ? { ...sub, status: "Approved" } : sub
        )
      );
      setAnimatingId(null);
    }, 600);
  };

  const handleReject = (submissionId) => {
    setAnimatingId(submissionId);
    setTimeout(() => {
      setSubmissions((prev) =>
        prev.map((sub) =>
          sub.id === submissionId ? { ...sub, status: "Rejected" } : sub
        )
      );
      setAnimatingId(null);
    }, 600);
  };

  const handleRequestInfo = (submissionId) => {
    setSelectedSubmission(submissionId);
    setShowRequestInfo(true);
  };

  const handleSendRequest = () => {
    if (requestMessage.trim()) {
      setSubmissions((prev) =>
        prev.map((sub) =>
          sub.id === selectedSubmission
            ? { ...sub, status: "Info Requested", requestMessage: requestMessage }
            : sub
        )
      );
      setRequestMessage("");
      setShowRequestInfo(false);
      setSelectedSubmission(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Verification Queue</h2>
            <p className="text-sm text-slate-500 mt-1">{submissions.length} submissions pending review</p>
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
        {submissions.map((submission, index) => (
          <motion.div
            key={submission.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: animatingId === submission.id ? 0.5 : 1,
              y: 0,
              scale: animatingId === submission.id ? 0.98 : 1,
            }}
            transition={{
              duration: animatingId === submission.id ? 0.6 : 0.3,
              type: "spring",
              stiffness: 300,
              damping: 25
            }}
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
              <motion.div
                initial={{ scale: 1 }}
                animate={{
                  scale: animatingId === submission.id ? [1, 1.1, 0.95] : 1,
                }}
                transition={{ duration: 0.6 }}
              >
                <StatusBadge status={submission.status} />
              </motion.div>
            </div>

            {/* Stats Grid */}
            <motion.div
              animate={{
                opacity: animatingId === submission.id ? 0.6 : 1,
              }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 pb-4 border-b border-slate-200"
            >
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
            </motion.div>

            {/* Activity Report */}
            <div className="mb-4">
              <h4 className="text-sm font-bold text-slate-900 mb-2">Activity Report</h4>
              <motion.div
                animate={{
                  opacity: animatingId === submission.id ? 0.6 : 1,
                }}
                transition={{ duration: 0.3 }}
                className="bg-slate-50 rounded-lg p-4 text-sm text-slate-700 leading-relaxed"
              >
                {submission.activityReport}
              </motion.div>
            </div>

            {/* Evidence Images */}
            <div className="mb-4">
              <h4 className="text-sm font-bold text-slate-900 mb-3">
                Evidence Images ({submission.evidenceImages.length})
              </h4>
              <motion.div
                animate={{
                  opacity: animatingId === submission.id ? 0.6 : 1,
                }}
                transition={{ duration: 0.3 }}
                className="flex gap-3 overflow-x-auto pb-2"
              >
                {submission.evidenceImages.map((img, idx) => (
                  <div key={idx} className="flex-shrink-0">
                    <img
                      src={img}
                      alt={`Evidence ${idx + 1}`}
                      className="w-[300px] h-[200px] object-cover rounded-lg border border-slate-200"
                    />
                  </div>
                ))}
              </motion.div>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-bold text-slate-900 mb-3">
                Attachments ({submission.attachments.length})
              </h4>

              <div className="space-y-3">
                {submission.attachments.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-4 py-3"
                  >
                    {/* Left */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-100">
                        <FileText size={18} className="text-blue-800" />
                      </div>

                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {file.name}
                        </p>
                        <p className="text-xs text-slate-500">{file.size}</p>
                      </div>
                    </div>

                    {/* Download */}
                    <a
                      href={file.url}
                      download
                      className="p-2 rounded-lg hover:bg-slate-200 transition"
                    >
                      <Download size={18} className="text-slate-600" />
                    </a>
                  </div>
                ))}
              </div>
            </div>


            {/* Request Info Message Display */}
            <AnimatePresence>
              {submission.requestMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg overflow-hidden"
                >
                  <p className="text-sm font-semibold text-yellow-900 mb-1">Information Requested</p>
                  <p className="text-sm text-yellow-800">{submission.requestMessage}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="flex mt-[10px] items-center gap-2">
              <motion.button
                whileHover={{ scale: submission.status === "Approved" ? 1 : 1.05 }}
                whileTap={{ scale: submission.status === "Approved" ? 1 : 0.95 }}
                onClick={() => handleApprove(submission.id)}
                disabled={submission.status === "Approved" || animatingId === submission.id}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-all disabled:bg-emerald-300 disabled:cursor-not-allowed"
              >
                <motion.div
                  animate={
                    submission.status === "Approved"
                      ? { rotate: 360, scale: [1, 1.2, 1] }
                      : {}
                  }
                  transition={{ duration: 0.6 }}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </motion.div>
                {submission.status === "Approved" ? "Approved" : "Approve"}
              </motion.button>

              <motion.button
                whileHover={{ scale: submission.status === "Rejected" ? 1 : 1.05 }}
                whileTap={{ scale: submission.status === "Rejected" ? 1 : 0.95 }}
                onClick={() => handleReject(submission.id)}
                disabled={submission.status === "Rejected" || animatingId === submission.id}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-rose-600 rounded-lg hover:bg-rose-700 transition-all disabled:bg-rose-300 disabled:cursor-not-allowed"
              >
                <motion.div
                  animate={
                    submission.status === "Rejected"
                      ? { rotate: 360, scale: [1, 1.2, 1] }
                      : {}
                  }
                  transition={{ duration: 0.6 }}
                >
                  <XCircle className="w-4 h-4" />
                </motion.div>
                {submission.status === "Rejected" ? "Rejected" : "Reject"}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleRequestInfo(submission.id)}
                disabled={animatingId === submission.id}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Info className="w-4 h-4" />
                Request Info
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Request Info Modal */}
      <AnimatePresence>
        {showRequestInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => {
              setShowRequestInfo(false);
              setSelectedSubmission(null);
              setRequestMessage("");
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center justify-between mb-4"
              >
                <h3 className="text-lg font-bold text-slate-900">Request Additional Information</h3>
                <motion.button
                  whileHover={{ rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setShowRequestInfo(false);
                    setSelectedSubmission(null);
                    setRequestMessage("");
                  }}
                  className="text-slate-500 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="mb-4"
              >
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Message to CRP <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  placeholder="Specify what additional information or clarification is needed..."
                  rows="4"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none"
                  autoFocus
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex gap-2 justify-end"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowRequestInfo(false);
                    setSelectedSubmission(null);
                    setRequestMessage("");
                  }}
                  className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: requestMessage.trim() ? 1.05 : 1 }}
                  whileTap={{ scale: requestMessage.trim() ? 0.95 : 1 }}
                  onClick={handleSendRequest}
                  disabled={!requestMessage.trim()}
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                  Send Request
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

