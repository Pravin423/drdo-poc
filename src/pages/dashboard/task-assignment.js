"use client";

import { useState, useMemo, memo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClipboardList, Activity, CheckCircle, AlertCircle, TrendingUp, Calendar } from "lucide-react";
import ProtectedRoute from "../../components/ProtectedRoute";
import DashboardLayout from "../../components/DashboardLayout";
import { useRouter } from "next/router";
// Extracted Components
import SummaryCard from "../../components/common/SummaryCard";
import { 
  ActiveTasksList, 
  CreateTaskModal 
} from "../../components/super-admin/all-task";

/* Initial form state (outside component to stay stable) */
const INITIAL_FORM_STATE = {
  taskName: "",
  taskType: "SPECIAL",
  startDate: "",
  endDate: "",
  honorariumAmount: "",
  activityForm: "",
  latitude: "",
  longitude: "",
  radius: "",
  assignToCrp: "",
  vertical_id: "",
  taskDescription: ""
};

/* Helper function to format date */
const formatDateForDisplay = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
};

/* ---------------- MAIN PAGE COMPONENT ---------------- */
export default function TaskAssignment() {
  const router = useRouter();
  const isViewOnly = router.query.viewOnly === "true";

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [apiError, setApiError] = useState(null);

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

      // Sort by ID in descending order (newest first)
      mappedTasks.sort((a, b) => {
        const numA = Number(a.id);
        const numB = Number(b.id);
        if (!isNaN(numA) && !isNaN(numB)) {
          return numB - numA;
        }
        return String(b.id).localeCompare(String(a.id));
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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCreateTask = async () => {
    setApiError(null);
    if (!formData.taskName || !formData.taskType || !formData.startDate || !formData.endDate || !formData.activityForm || !formData.latitude || !formData.longitude || !formData.radius || !formData.taskDescription) {
      setApiError("Please fill in all required fields marked with *");
      return;
    }
    
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      setApiError("End date cannot be earlier than start date.");
      return;
    }

    try {
      setLoading(true);
      const isSpecial = formData.taskType === "SPECIAL";
      
      const payload = {
        task_name: formData.taskName,
        task_description: formData.taskDescription,
        task_type: formData.taskType.toLowerCase(),
        form_id: Number(formData.activityForm),
        start_date: formData.startDate,
        end_date: formData.endDate,
        honorarium_amount: Number(formData.honorariumAmount) || 0,
        latitude: formData.latitude,
        longitude: formData.longitude,
        radius: Number(formData.radius),
      };

      if (!isSpecial) {
        if (!formData.vertical_id) {
          setApiError("Vertical is required for Regular tasks.");
          setLoading(false);
          return;
        }
        payload.vertical_id = Number(formData.vertical_id);
      } else {
        if (!formData.assignToCrp) {
          setApiError("Assign to CRP is required for Special tasks.");
          setLoading(false);
          return;
        }
        payload.assigned_to = Number(formData.assignToCrp);
      }

      const res = await fetch("/api/activity-tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      
      const result = await res.json();
      
      if (!res.ok || result.status === false) {
        throw new Error(result.message || "Failed to create task");
      }

      // Clean up and refresh the data
      handleClearForm();
      setIsAssignModalOpen(false);
      fetchTasks(); // Background reload
      
    } catch (error) {
      console.error("Error creating task:", error);
      setApiError(error.message || "Failed to assign task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClearForm = () => {
    setFormData(INITIAL_FORM_STATE);
  };

  const handleDeleteTask = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  const stats = useMemo(() => {
    const normTask = (val) => (val || "").toLowerCase();
    const completed = tasks.filter((t) => normTask(t.status) === "completed").length;
    const active = tasks.filter((t) => normTask(t.status) === "active").length;
    const overdue = tasks.filter((t) => normTask(t.status) === "overdue").length;
    const avgProgress = tasks.length > 0 ? Math.round(tasks.reduce((sum, t) => sum + t.progress, 0) / tasks.length) : 0;

    return [
      {
        title: "Total Tasks",
        value: tasks.length,
        delta: "2",
        variant: "slate",
        icon: ClipboardList,
      },
      {
        title: "Active Tasks",
        value: active,
        delta: "1",
        variant: "blue",
        icon: Activity,
      },
      {
        title: "Completed",
        value: completed,
        variant: "emerald",
        icon: CheckCircle,
      },
      {
        title: "Overdue",
        value: overdue,
        delta: "1",
        variant: "rose",
        icon: AlertCircle,
      },
      {
        title: "Avg Progress",
        value: `${avgProgress}%`,
        delta: "5%",
        variant: "amber",
        icon: TrendingUp,
      },
    ];
  }, [tasks]);


  return (
    <ProtectedRoute allowedRole={["super-admin", "state-admin", "Block-admin"]}>
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
              {stats.map((card) => (
                <SummaryCard key={card.title} {...card} />
              ))}
            </div>

            {/* Content Area with Animation */}
            <AnimatePresence mode="wait">
              <motion.div
                key="tasks-table"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <ActiveTasksList 
                  tasks={tasks} 
                  loading={loading} 
                  onDeleteTask={handleDeleteTask} 
                  onOpenAssignModal={() => { setApiError(null); setIsAssignModalOpen(true); }} 
                  isViewOnly={isViewOnly}
                />
              </motion.div>
            </AnimatePresence>

          </div>
        </div>
      </DashboardLayout>

      {/* Create Task Modal Overlay (Outside Layout) */}
      <AnimatePresence>
        {isAssignModalOpen && (
          <CreateTaskModal
            formData={formData}
            handleInputChange={handleInputChange}
            handleCreateTask={handleCreateTask}
            handleClearForm={handleClearForm}
            onClose={() => setIsAssignModalOpen(false)}
            apiError={apiError}
          />
        )}
      </AnimatePresence>
    </ProtectedRoute>
  );
}
