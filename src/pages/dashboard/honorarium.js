"use client";

import { useState, useMemo, memo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  IndianRupee,
  Calendar,
  CheckCircle2,
  Eye,
  Edit,
  History,
  Download,
  Upload,
  Plus,
  X,
  ChevronDown,
  Clock,
  FileText,
  RefreshCw,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Activity,
  AlertCircle,
  ListTodo,
  Settings,
  CheckCircle,
} from "lucide-react";
import ProtectedRoute from "../../components/ProtectedRoute";
import DashboardLayout from "../../components/DashboardLayout";

/* ---------------- MOCK DATA ---------------- */

// Rate Master Data
const RATE_DATA = [
  {
    id: 1,
    taskType: "SHG Meeting Facilitation",
    vertical: "Women Empowerment",
    baseRate: 500,
    bonusRate: 100,
    effectiveFrom: "1/1/2026",
    status: "Active",
    version: "v2.1",
  },
  {
    id: 2,
    taskType: "Livelihood Training",
    vertical: "Skill Development",
    baseRate: 750,
    bonusRate: 150,
    effectiveFrom: "1/1/2026",
    status: "Active",
    version: "v1.8",
  },
  {
    id: 3,
    taskType: "Health Awareness Camp",
    vertical: "Health & Nutrition",
    baseRate: 600,
    bonusRate: 120,
    effectiveFrom: "1/1/2026",
    status: "Active",
    version: "v2.0",
  },
  {
    id: 4,
    taskType: "Agriculture Extension",
    vertical: "Agriculture & Allied",
    baseRate: 550,
    bonusRate: 110,
    effectiveFrom: "1/12/2025",
    status: "Superseded",
    version: "v1.5",
  },
  {
    id: 5,
    taskType: "Financial Literacy Session",
    vertical: "Financial Inclusion",
    baseRate: 650,
    bonusRate: 130,
    effectiveFrom: "1/1/2026",
    status: "Active",
    version: "v1.9",
  },
];

// Calculation Summary Data
const CALCULATION_DATA = [
  {
    id: 1,
    name: "Priya Desai",
    crpId: "CRP-NG-2024-001",
    district: "North Goa",
    block: "Bardez",
    attendance: 26,
    tasks: "18/18",
    calculatedOn: "2026-01-28 10:30 AM",
    baseAmount: 9000,
    bonus: 1800,
    deductions: 0,
    netAmount: 10800,
    status: "Calculated",
  },
  {
    id: 2,
    name: "Rajesh Naik",
    crpId: "CRP-SG-2024-045",
    district: "South Goa",
    block: "Salcete",
    attendance: 24,
    tasks: "15/16",
    calculatedOn: "2026-01-28 11:15 AM",
    baseAmount: 8250,
    bonus: 1500,
    deductions: 250,
    netAmount: 9500,
    status: "Pending Review",
  },
  {
    id: 3,
    name: "Sunita Parab",
    crpId: "CRP-NG-2024-012",
    district: "North Goa",
    block: "Pernem",
    attendance: 25,
    tasks: "20/20",
    calculatedOn: "2026-01-28 09:45 AM",
    baseAmount: 10000,
    bonus: 2000,
    deductions: 0,
    netAmount: 12000,
    status: "Calculated",
  },
];

// Approval Workflow Data
const APPROVAL_DATA = [
  {
    id: 1,
    crpName: "Priya Desai",
    crpId: "CRP-NG-2024-001",
    month: "January 2026",
    amount: 10800,
    submittedBy: "CRP",
    pendingWith: "Supervisor - Bardez",
    status: "Supervisor Review",
    approvalChain: [
      {
        stage: "CRP Submission",
        approver: "Priya Desai",
        status: "Completed",
        timestamp: "2026-01-28 02:30 PM",
      },
      {
        stage: "Supervisor Review",
        approver: "Ramesh Kumar",
        status: "Pending",
      },
      {
        stage: "Block Manager",
        approver: "Anjali Rane",
        status: "Pending",
      },
      {
        stage: "District Officer",
        approver: "Suresh Naik",
        status: "Pending",
      },
      {
        stage: "Finance Approval",
        approver: "Finance Officer",
        status: "Pending",
      },
    ],
    documents: [
      { name: "Attendance_Jan2026.pdf", url: "#" },
      { name: "Task_Completion_Report.pdf", url: "#" },
    ],
  },
  {
    id: 2,
    crpName: "Rajesh Naik",
    crpId: "CRP-SG-2024-045",
    month: "January 2026",
    amount: 9500,
    submittedBy: "Supervisor",
    pendingWith: "Block Manager - Salcete",
    status: "Block Manager",
    approvalChain: [
      {
        stage: "CRP Submission",
        approver: "Rajesh Naik",
        status: "Completed",
        timestamp: "2026-01-28 03:45 PM",
      },
      {
        stage: "Supervisor Review",
        approver: "Kavita Desai",
        status: "Completed",
        timestamp: "2026-01-29 10:15 AM",
      },
      {
        stage: "Block Manager",
        approver: "Prakash Gaonkar",
        status: "Pending",
      },
      {
        stage: "District Officer",
        approver: "Maria Fernandes",
        status: "Pending",
      },
      {
        stage: "Finance Approval",
        approver: "Finance Officer",
        status: "Pending",
      },
    ],
    documents: [
      { name: "Attendance_Jan2026.pdf", url: "#" },
      { name: "Task_Report.pdf", url: "#" },
      { name: "Supervisor_Remarks.pdf", url: "#" },
    ],
  },
  {
    id: 3,
    crpName: "Sunita Parab",
    crpId: "CRP-NG-2024-012",
    month: "January 2026",
    amount: 12000,
    submittedBy: "Block Manager",
    pendingWith: "District Officer - North Goa",
    status: "District Officer",
    approvalChain: [
      {
        stage: "CRP Submission",
        approver: "Sunita Parab",
        status: "Completed",
        timestamp: "2026-01-28 01:20 PM",
      },
      {
        stage: "Supervisor Review",
        approver: "Anil Verma",
        status: "Completed",
        timestamp: "2026-01-29 09:30 AM",
      },
      {
        stage: "Block Manager",
        approver: "Rita D'Souza",
        status: "Completed",
        timestamp: "2026-01-30 11:00 AM",
      },
      {
        stage: "District Officer",
        approver: "Carlos Silva",
        status: "Pending",
      },
      {
        stage: "Finance Approval",
        approver: "Finance Officer",
        status: "Pending",
      },
    ],
    documents: [
      { name: "Attendance_Jan2026.pdf", url: "#" },
      { name: "Task_Completion_Report.pdf", url: "#" },
    ],
  },
];

// Payment Status Data
const PAYMENT_DATA = [
  {
    id: 1,
    crpName: "Priya Desai",
    crpId: "CRP-NG-2024-001",
    month: "January 2026",
    amount: 10800,
    bankAccount: "XXXX-XXXX-1234",
    paymentDate: "30/1/2026",
    transactionId: "TXN20260130B001",
    processedBy: "Finance Officer - North Goa",
    status: "Processed",
  },
  {
    id: 2,
    crpName: "Sunita Parab",
    crpId: "CRP-NG-2024-012",
    month: "January 2026",
    amount: 12000,
    bankAccount: "XXXX-XXXX-5678",
    paymentDate: "30/1/2026",
    transactionId: "TXN20260130B002",
    processedBy: "Finance Officer - North Goa",
    status: "Processed",
  },
  {
    id: 3,
    crpName: "Rajesh Naik",
    crpId: "CRP-SG-2024-045",
    month: "January 2026",
    amount: 9500,
    bankAccount: "XXXX-XXXX-9012",
    status: "Pending",
  },
];

/* ---------------- STATS CARD COMPONENT ---------------- */
const StatsCard = memo(function StatsCard({
  icon: Icon,
  label,
  value,
  subValue,
  delta,
  isPositive,
  accent,
}) {
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
          <div
            className={`flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-md 
            ${
              isPositive
                ? "text-emerald-700 bg-emerald-50"
                : "text-rose-700 bg-rose-50"
            }`}
          >
            {isPositive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
            {delta}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mt-5 space-y-0.5 relative z-10">
        <div className="flex items-baseline gap-2">
          <h4 className="text-2xl font-bold text-slate-900 tracking-tight">
            {value}
          </h4>
          {subValue && (
            <span className="text-xs font-semibold text-slate-400">{subValue}</span>
          )}
        </div>
        <p className="text-[13px] font-semibold text-slate-500 uppercase tracking-wider">
          {label}
        </p>
      </div>

      {/* Background Decorative Icon */}
      <div className="absolute -right-2 -bottom-2 opacity-[0.06] text-slate-900 pointer-events-none">
        <Icon size={100} strokeWidth={2} />
      </div>
    </motion.section>
  );
});

/* ---------------- STATUS BADGE COMPONENT ---------------- */
const StatusBadge = ({ status }) => {
  const styles = {
    Active: "bg-emerald-50 text-emerald-700 border-emerald-100",
    Superseded: "bg-slate-100 text-slate-600 border-slate-200",
    Calculated: "bg-emerald-50 text-emerald-700 border-emerald-100",
    "Pending Review": "bg-amber-50 text-amber-700 border-amber-100",
    "Supervisor Review": "bg-blue-50 text-blue-700 border-blue-100",
    "Block Manager": "bg-blue-50 text-blue-700 border-blue-100",
    "District Officer": "bg-blue-50 text-blue-700 border-blue-100",
    Processed: "bg-emerald-50 text-emerald-700 border-emerald-100",
    Pending: "bg-amber-50 text-amber-700 border-amber-100",
    Exception: "bg-red-50 text-red-700 border-red-100",
    Completed: "bg-emerald-50 text-emerald-700 border-emerald-100",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${
        styles[status] || "bg-slate-100 text-slate-600 border-slate-200"
      }`}
    >
      {status === "Completed" && <span className="text-lg">✓</span>}
      {status}
    </span>
  );
};

/* ---------------- MAIN PAGE COMPONENT ---------------- */
export default function HonorariumCalculation() {
  const [rates, setRates] = useState(RATE_DATA);
  const [activeTab, setActiveTab] = useState("rateMaster");

  // Rate Master States
  const [isAddRateOpen, setIsAddRateOpen] = useState(false);
  const [isImportRatesOpen, setIsImportRatesOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rateFile, setRateFile] = useState(null);

  // Calculation Summary States
  const [selectedMonth, setSelectedMonth] = useState("January 2026");
  const [selectedDistrict, setSelectedDistrict] = useState("All Districts");
  const [expandedCalculation, setExpandedCalculation] = useState(null);

  // Payment Status States
  const [selectedStatus, setSelectedStatus] = useState("All Status");

  // Add Rate Form State
  const [rateForm, setRateForm] = useState({
    taskType: "",
    vertical: "",
    baseRate: "",
    bonusRate: "",
    effectiveFrom: "",
  });

  const tabs = [
    { id: "rateMaster", label: "Rate Master", icon: Settings },
    { id: "calculations", label: "Calculations", icon: Activity },
    { id: "approvals", label: "Approvals", icon: CheckCircle },
    { id: "payments", label: "Payments", icon: IndianRupee },
  ];

  // Disable background scroll when modal is open
  useEffect(() => {
    if (isAddRateOpen || isImportRatesOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isAddRateOpen, isImportRatesOpen]);

  // Export Rates to CSV
  const exportRatesToCSV = () => {
    const headers = [
      "Task Type",
      "Vertical",
      "Base Rate",
      "Bonus Rate",
      "Effective From",
      "Status",
      "Version",
    ];

    const rows = rates.map((rate) => [
      rate.taskType,
      rate.vertical,
      rate.baseRate,
      rate.bonusRate,
      rate.effectiveFrom,
      rate.status,
      rate.version,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((val) => `"${val ?? ""}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `Honorarium_Rates_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Handle Add Rate Submit
  const handleAddRate = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API delay
    setTimeout(() => {
      const newRate = {
        id: Date.now(),
        ...rateForm,
        status: "Active",
        version: `v${(Math.random() * 3).toFixed(1)}`,
      };

      setRates((prev) => [newRate, ...prev]);
      setRateForm({
        taskType: "",
        vertical: "",
        baseRate: "",
        bonusRate: "",
        effectiveFrom: "",
      });
      setIsSubmitting(false);
      setIsAddRateOpen(false);
    }, 800);
  };

  // Calculate stats
  const stats = useMemo(() => {
    const activeRates = rates.filter((r) => r.status === "Active").length;
    const totalCalculations = CALCULATION_DATA.length;
    const totalAmount = CALCULATION_DATA.reduce((sum, c) => sum + c.netAmount, 0);
    const pendingApprovals = APPROVAL_DATA.length;
    const processedPayments = PAYMENT_DATA.filter(
      (p) => p.status === "Processed"
    ).length;

    return [
      {
        label: "Active Rates",
        value: activeRates.toString(),
        delta: "2",
        isPositive: true,
        accent: "text-emerald-600 bg-emerald-50 border-emerald-200",
        icon: Settings,
      },
      {
        label: "Total Calculations",
        value: totalCalculations.toString(),
        delta: "1",
        isPositive: true,
        accent: "text-blue-600 bg-blue-50 border-blue-200",
        icon: Activity,
      },
      {
        label: "Pending Approvals",
        value: pendingApprovals.toString(),
        delta: null,
        isPositive: null,
        accent: "text-amber-600 bg-amber-50 border-amber-200",
        icon: Clock,
      },
      {
        label: "Processed Payments",
        value: processedPayments.toString(),
        delta: "2",
        isPositive: true,
        accent: "text-purple-600 bg-purple-50 border-purple-200",
        icon: CheckCircle2,
      },
      {
        label: "Total Amount",
        value: `₹${(totalAmount / 1000).toFixed(1)}K`,
        delta: "8%",
        isPositive: true,
        accent: "text-indigo-600 bg-indigo-50 border-indigo-200",
        icon: IndianRupee,
      },
    ];
  }, []);

  return (
    <ProtectedRoute allowedRole="super-admin">
      {/* Add New Rate Modal */}
      <AnimatePresence>
        {isAddRateOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/50 backdrop-blur-md px-4">
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-white w-full max-w-2xl rounded-3xl shadow-xl border border-slate-200 overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Add New Rate</h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Configure honorarium rate for task type and vertical
                  </p>
                </div>
                <button
                  onClick={() => setIsAddRateOpen(false)}
                  className="p-2 rounded-full hover:bg-slate-100 transition"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddRate} className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 ml-1">
                      Task Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={rateForm.taskType}
                      onChange={(e) =>
                        setRateForm({ ...rateForm, taskType: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-500 transition-all outline-none text-sm"
                    >
                      <option value="">Select Task Type</option>
                      <option>SHG Meeting Facilitation</option>
                      <option>Livelihood Training</option>
                      <option>Health Awareness Camp</option>
                      <option>Agriculture Extension</option>
                      <option>Financial Literacy Session</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 ml-1">
                      Vertical <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={rateForm.vertical}
                      onChange={(e) =>
                        setRateForm({ ...rateForm, vertical: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-500 transition-all outline-none text-sm"
                    >
                      <option value="">Select Vertical</option>
                      <option>Women Empowerment</option>
                      <option>Skill Development</option>
                      <option>Health & Nutrition</option>
                      <option>Agriculture & Allied</option>
                      <option>Financial Inclusion</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 ml-1">
                      Base Rate (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="number"
                      value={rateForm.baseRate}
                      onChange={(e) =>
                        setRateForm({ ...rateForm, baseRate: e.target.value })
                      }
                      placeholder="500"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-500 transition-all outline-none text-sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 ml-1">
                      Bonus Rate (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="number"
                      value={rateForm.bonusRate}
                      onChange={(e) =>
                        setRateForm({ ...rateForm, bonusRate: e.target.value })
                      }
                      placeholder="100"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-500 transition-all outline-none text-sm"
                    />
                  </div>

                  <div className="col-span-2 space-y-1">
                    <label className="text-xs font-semibold text-slate-500 ml-1">
                      Effective From <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="date"
                      value={rateForm.effectiveFrom}
                      onChange={(e) =>
                        setRateForm({
                          ...rateForm,
                          effectiveFrom: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-500 transition-all outline-none text-sm"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsAddRateOpen(false)}
                    className="px-4 py-2 rounded-xl border text-sm font-semibold hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className={`px-5 py-2 rounded-xl text-white text-sm font-semibold transition ${isSubmitting ? "bg-slate-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"}`}
                  >
                    {isSubmitting ? "Adding..." : "Add Rate"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Import Rates Modal */}
      <AnimatePresence>
        {isImportRatesOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/50 backdrop-blur-md px-4">
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-white w-full max-w-2xl rounded-3xl shadow-xl border border-slate-200 overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Import Rates</h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Upload rate configurations using a CSV file
                  </p>
                </div>
                <button
                  onClick={() => setIsImportRatesOpen(false)}
                  className="p-2 rounded-full hover:bg-slate-100 transition"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <label className="group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 p-8 cursor-pointer transition hover:border-slate-400 hover:bg-slate-50">
                  <Upload
                    size={34}
                    className="text-slate-400 group-hover:text-slate-600 mb-3 transition"
                  />

                  {!rateFile ? (
                    <>
                      <p className="text-sm font-medium text-slate-700">
                        Click to upload or drag & drop
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        CSV file (max 5MB)
                      </p>
                    </>
                  ) : (
                    <div className="flex items-center gap-3 bg-white border rounded-xl px-4 py-2">
                      <span className="text-sm font-medium text-slate-700 truncate max-w-[200px]">
                        {rateFile.name}
                      </span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setRateFile(null);
                        }}
                        className="text-slate-400 hover:text-red-500"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}

                  <input
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={(e) => setRateFile(e.target.files[0])}
                  />
                </label>
              </div>

              <div className="flex justify-end gap-3 px-6 py-4 border-t bg-slate-50">
                <button
                  onClick={() => {
                    setIsImportRatesOpen(false);
                    setRateFile(null);
                  }}
                  className="px-4 py-2 rounded-xl border text-sm font-semibold hover:bg-white transition"
                >
                  Cancel
                </button>
                <button
                  disabled={!rateFile}
                  onClick={() => {
                    console.log("Importing rates from:", rateFile);
                    setRateFile(null);
                    setIsImportRatesOpen(false);
                  }}
                  className={`px-5 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition ${
                    !rateFile
                      ? "bg-slate-300 text-white cursor-not-allowed"
                      : "bg-emerald-600 text-white hover:bg-emerald-700"
                  }`}
                >
                  <Upload size={16} />
                  Import Rates
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
                  Honorarium Calculation{" "}
                  <span className="bg-gradient-to-b from-[#3b52ab] to-[#1a2e7a] bg-clip-text text-transparent">
                    Engine
                  </span>
                </h1>
                <p className="text-slate-500 font-medium">
                  Comprehensive rate configuration and automated payment processing
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
                      ${
                        activeTab === tab.id
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
                {activeTab === "rateMaster" && (
                  <RateMasterTab
                  rates={rates}
                    onAddRate={() => setIsAddRateOpen(true)}
                    onImportRates={() => setIsImportRatesOpen(true)}
                    onExportRates={exportRatesToCSV}
                  />
                )}
                {activeTab === "calculations" && (
                  <CalculationsTab
                    data={CALCULATION_DATA}
                    selectedMonth={selectedMonth}
                    setSelectedMonth={setSelectedMonth}
                    selectedDistrict={selectedDistrict}
                    setSelectedDistrict={setSelectedDistrict}
                    expandedCalculation={expandedCalculation}
                    setExpandedCalculation={setExpandedCalculation}
                  />
                )}
                {activeTab === "approvals" && (
                  <ApprovalsTab data={APPROVAL_DATA} />
                )}
                {activeTab === "payments" && (
                  <PaymentsTab
                    data={PAYMENT_DATA}
                    selectedStatus={selectedStatus}
                    setSelectedStatus={setSelectedStatus}
                    selectedMonth={selectedMonth}
                    setSelectedMonth={setSelectedMonth}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

/* ---------------- RATE MASTER TAB ---------------- */
const RateMasterTab = memo(function RateMasterTab({
  rates,
  onAddRate,
  onImportRates,
  onExportRates,
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Rate Master Configuration
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Manage honorarium rates by task type and vertical with version control
            </p>
          </div>
          <button
            onClick={onAddRate}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Plus size={16} />
            Add New Rate
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Task Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Vertical
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Base Rate (₹)
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Bonus Rate (₹)
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Effective From
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Version
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rates.map((rate, index) => (
              <motion.tr
                key={rate.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-slate-50/50 transition-colors"
              >
                <td className="px-6 py-4 text-sm font-medium text-slate-900">
                  {rate.taskType}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {rate.vertical}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                  ₹{rate.baseRate}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-emerald-600">
                  ₹{rate.bonusRate}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {rate.effectiveFrom}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={rate.status} />
                </td>
                <td className="px-6 py-4 text-sm font-medium text-slate-600">
                  {rate.version}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-slate-100 rounded-lg transition">
                      <Edit size={16} className="text-slate-600" />
                    </button>
                    <button className="p-2 hover:bg-slate-100 rounded-lg transition">
                      <History size={16} className="text-slate-600" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
        <p className="text-sm text-slate-500">
          Showing {rates.filter((r) => r.status === "Active").length} active rate
          configurations
        </p>
        <div className="flex gap-3">
          <button
            onClick={onExportRates}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Download size={16} />
            Export Rates
          </button>
          <button
            onClick={onImportRates}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Upload size={16} />
            Import Rates
          </button>
        </div>
      </div>
    </div>
  );
});
const handleExportSummaryCSV = () => {
  const rows = [
    ["Month", selectedMonth],
    ["District", selectedDistrict],
    ["Total CRPs", metrics.totalCRPs],
    ["Total Amount", metrics.totalAmount],
    ["Average Attendance", metrics.avgAttendance],
    ["Task Completion (%)", metrics.taskCompletion],
  ];

  const csvContent =
    "data:text/csv;charset=utf-8," +
    rows.map((e) => e.join(",")).join("\n");

  const link = document.createElement("a");
  link.href = encodeURI(csvContent);
  link.download = `CRP_Monthly_Summary_${selectedMonth}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/* ---------------- CALCULATIONS TAB ---------------- */
const CalculationsTab = memo(function CalculationsTab({
  data,
  selectedMonth,
  setSelectedMonth,
  selectedDistrict,
  setSelectedDistrict,
  expandedCalculation,
  setExpandedCalculation,
}) {
  const metrics = useMemo(() => {
    return {
      totalCRPs: data.length,
      totalAmount: data.reduce((sum, c) => sum + c.netAmount, 0),
      avgAttendance: Math.round(
        data.reduce((sum, c) => sum + c.attendance, 0) / data.length
      ),
      taskCompletion: 97,
    };
  }, [data]);

  return (
    <>
      {/* Header with Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Monthly Calculation Summary
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Auto-generated honorarium calculations with attendance dependency
            </p>
          </div>
          <div className="flex flex-wrap gap-3 justify-end">
            <button
              onClick={() => {
                const headers = [
                  "CRP Name",
                  "CRP ID",
                  "District",
                  "Block",
                  "Attendance",
                  "Tasks",
                  "Base Amount",
                  "Bonus",
                  "Deductions",
                  "Net Amount",
                  "Status",
                  "Calculated On"
                ];
                const rows = data.map(calc => [
                  calc.name, calc.crpId, calc.district, calc.block, calc.attendance, 
                  calc.tasks, calc.baseAmount, calc.bonus, calc.deductions, 
                  calc.netAmount, calc.status, calc.calculatedOn
                ]);
                const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
                const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `CRP_Calculations_${selectedMonth.replace(/\s+/g, '_')}.csv`;
                link.click();
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors shadow-sm"
            >
              <Download size={16} /> Export All Calculations
            </button>
            <div className="relative">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none bg-white pr-10"
              >
                <option>January 2026</option>
                <option>February 2026</option>
                <option>March 2026</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none bg-white pr-10"
              >
                <option>All Districts</option>
                <option>North Goa</option>
                <option>South Goa</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Total CRPs",
              value: metrics.totalCRPs,
              icon: Users,
              bg: "bg-blue-50",
              text: "text-blue-600",
              border: "border-blue-200",
            },
            {
              label: "Total Amount",
              value: `₹${metrics.totalAmount.toLocaleString()}`,
              icon: IndianRupee,
              bg: "bg-emerald-50",
              text: "text-emerald-600",
              border: "border-emerald-200",
            },
            {
              label: "Avg. Attendance",
              value: `${metrics.avgAttendance} days`,
              icon: Calendar,
              bg: "bg-amber-50",
              text: "text-amber-600",
              border: "border-amber-200",
            },
            {
              label: "Task Completion",
              value: `${metrics.taskCompletion}%`,
              icon: CheckCircle2,
              bg: "bg-purple-50",
              text: "text-purple-600",
              border: "border-purple-200",
            },
          ].map((card, index) => (
            <div
              key={card.label}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <div
                  className={`p-2 rounded-lg border ${card.bg} ${card.text} ${card.border}`}
                >
                  <card.icon size={18} />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-slate-900">{card.value}</p>
                <p className="text-sm font-medium text-slate-500">{card.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CRP Calculation Cards */}
      <div className="space-y-4">
        {data.map((calc, index) => (
          <motion.div
            key={calc.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Card Header */}
            <div className="px-6 py-4 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-slate-900">{calc.name}</h3>
                  <StatusBadge status={calc.status} />
                </div>
                <p className="text-sm text-slate-500 font-medium">{calc.crpId}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setExpandedCalculation(
                      expandedCalculation === calc.id ? null : calc.id
                    )
                  }
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <Eye size={16} />
                  View Breakdown
                </button>
                <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                  <RefreshCw size={16} />
                  Recalculate
                </button>
              </div>
            </div>

            {/* Card Details */}
            <div className="px-6 pb-4">
              <div className="grid grid-cols-4 gap-4 p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-1">
                    District/Block
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {calc.district} / {calc.block}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-1">
                    Attendance
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {calc.attendance} days
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-1">Tasks</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {calc.tasks}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-1">
                    Calculated On
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {calc.calculatedOn}
                  </p>
                </div>
              </div>
            </div>
            

            {/* Expanded Breakdown */}
            <AnimatePresence>
              {expandedCalculation === calc.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6">
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">
                      <div className="grid grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                            Base Amount
                          </p>
                          <p className="text-lg font-bold text-slate-900">
                            ₹{calc.baseAmount.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                            Bonus
                          </p>
                          <p className="text-lg font-bold text-emerald-600">
                            +₹{calc.bonus.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                            Deductions
                          </p>
                          <p className="text-lg font-bold text-red-600">
                            -₹{calc.deductions.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                            Net Amount
                          </p>
                          <p className="text-lg font-bold text-slate-900">
                            ₹{calc.netAmount.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
          </motion.div>
        ))}
      </div>
    </>
  );
});

/* ---------------- APPROVALS TAB ---------------- */
const ApprovalsTab = memo(function ApprovalsTab({ data }) {
  return (
    <>
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Approval Workflow</h2>
            <p className="text-sm text-slate-500 mt-1">
              Multi-level approval chain with justification requirements
            </p>
          </div>
          <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-full text-xs font-bold">
            {data.length} Pending
          </span>
        </div>
      </div>

      {/* Approval Cards */}
      <div className="space-y-4">
        {data.map((approval, index) => (
          <motion.div
            key={approval.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm"
          >
            {/* Card Header */}
            <div className="px-6 py-4 flex justify-between items-start border-b border-slate-100">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-slate-900">
                    {approval.crpName}
                  </h3>
                  <StatusBadge status={approval.status} />
                </div>
                <p className="text-sm text-slate-500 font-medium">
                  {approval.crpId}
                </p>
              </div>
            </div>

            {/* Card Details */}
            <div className="px-6 py-4 bg-slate-50">
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                    Month
                  </p>
                  <p className="font-medium text-slate-900">{approval.month}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                    Amount
                  </p>
                  <p className="font-bold text-slate-900">
                    ₹{approval.amount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                    Submitted By
                  </p>
                  <p className="font-medium text-slate-900">
                    {approval.submittedBy}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                    Pending With
                  </p>
                  <p className="font-medium text-slate-900">
                    {approval.pendingWith}
                  </p>
                </div>
              </div>
            </div>

            {/* Approval Chain Progress */}
            <div className="px-6 py-5">
              <h4 className="text-sm font-bold text-slate-900 mb-4">
                Approval Chain Progress
              </h4>
              <div className="space-y-3">
                {approval.approvalChain.map((step, stepIndex) => (
                  <div key={stepIndex} className="flex items-start gap-3 relative">
                    {/* Icon */}
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        step.status === "Completed"
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {step.status === "Completed" ? (
                        <CheckCircle2 size={16} />
                      ) : (
                        <Clock size={16} />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-bold text-slate-900">
                            {step.stage}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {step.approver}
                          </p>
                          {step.timestamp && (
                            <p className="text-xs text-slate-400 mt-0.5">
                              {step.timestamp}
                            </p>
                          )}
                        </div>
                        <StatusBadge status={step.status} />
                      </div>
                    </div>

                    {/* Connector Line */}
                    {stepIndex < approval.approvalChain.length - 1 && (
                      <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-slate-200 -mb-3" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Attached Documents */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
              <h4 className="text-sm font-bold text-slate-900 mb-3">
                Attached Documents
              </h4>
              <div className="flex flex-wrap gap-3">
                {approval.documents.map((doc, docIndex) => (
                  <a
                    key={docIndex}
                    href={doc.url}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
                  >
                    <FileText size={16} className="text-blue-500" />
                    {doc.name}
                    <Download size={14} className="text-slate-400" />
                  </a>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 py-4 flex justify-between">
              <button className="flex items-center gap-1.5 px-5 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                <Eye size={16} />
                Review & Action
              </button>
              <button className="flex items-center gap-1.5 px-5 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                <History size={16} />
                View History
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
});

/* ---------------- PAYMENTS TAB ---------------- */
const PaymentsTab = memo(function PaymentsTab({
  data,
  selectedStatus,
  setSelectedStatus,
  selectedMonth,
  setSelectedMonth,
}) {
  const metrics = useMemo(() => {
    return {
      totalAmount: data.reduce((sum, p) => sum + p.amount, 0),
      processed: data
        .filter((p) => p.status === "Processed")
        .reduce((sum, p) => sum + p.amount, 0),
      pending: data
        .filter((p) => p.status === "Pending")
        .reduce((sum, p) => sum + p.amount, 0),
      exceptions: 7950,
    };
  }, [data]);

  const filteredPayments =
    selectedStatus === "All Status"
      ? data
      : data.filter((p) => p.status === selectedStatus);

  const handleDownloadReceipt = (payment) => {
    const receiptContent = `
      HONORARIUM PAYMENT RECEIPT
      --------------------------
      Transaction ID: ${payment.transactionId}
      Date: ${payment.paymentDate}
      
      CRP Name: ${payment.crpName}
      CRP ID: ${payment.crpId}
      Month: ${payment.month}
      Amount Paid: ₹${payment.amount.toLocaleString()}
      Bank Account: ${payment.bankAccount}
      
      Status: ${payment.status}
      Processed By: ${payment.processedBy}
    `;
    const blob = new Blob([receiptContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Receipt_${payment.transactionId}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Header with Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Payment Status Dashboard
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Track processed, pending, and exception payments with MIS export
            </p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none bg-white pr-10"
              >
                <option>January 2026</option>
                <option>February 2026</option>
                <option>March 2026</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none bg-white pr-10"
              >
                <option>All Status</option>
                <option>Processed</option>
                <option>Pending</option>
                <option>Exception</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Payment Metric Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Total Amount",
              value: `₹${metrics.totalAmount.toLocaleString()}`,
              subtext: `${data.length} total payments`,
              icon: IndianRupee,
              bg: "bg-blue-50",
              text: "text-blue-600",
              border: "border-blue-200",
            },
            {
              label: "Processed",
              value: `₹${metrics.processed.toLocaleString()}`,
              subtext: "2 payments completed",
              icon: CheckCircle2,
              bg: "bg-emerald-50",
              text: "text-emerald-600",
              border: "border-emerald-200",
            },
            {
              label: "Pending",
              value: `₹${metrics.pending.toLocaleString()}`,
              subtext: "1 awaiting processing",
              icon: Clock,
              bg: "bg-amber-50",
              text: "text-amber-600",
              border: "border-amber-200",
            },
            {
              label: "Exceptions",
              value: `₹${metrics.exceptions.toLocaleString()}`,
              subtext: "1 require attention",
              icon: AlertCircle,
              bg: "bg-red-50",
              text: "text-red-600",
              border: "border-red-200",
            },
          ].map((card, index) => (
            <div
              key={card.label}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <div
                  className={`p-2 rounded-lg border ${card.bg} ${card.text} ${card.border}`}
                >
                  <card.icon size={18} />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-slate-900">{card.value}</p>
                <p className="text-sm font-medium text-slate-500">{card.label}</p>
                <p className="text-xs text-slate-400">{card.subtext}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Records */}
      <div className="space-y-4">
        {filteredPayments.map((payment, index) => (
          <motion.div
            key={payment.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm"
          >
            {/* Card Header */}
            <div className="px-6 py-4 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-slate-900">
                    {payment.crpName}
                  </h3>
                  <StatusBadge status={payment.status} />
                </div>
                <p className="text-sm text-slate-500 font-medium">
                  {payment.crpId}
                </p>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                  <Eye size={16} />
                  View Details
                </button>
                {payment.status === "Processed" && (
                  <button 
                    onClick={() => handleDownloadReceipt(payment)}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    <Download size={16} />
                    Receipt
                  </button>
                )}
              </div>
            </div>

            {/* Card Details */}
            <div className="px-6 pb-4">
              <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                    Month
                  </p>
                  <p className="font-medium text-slate-900">{payment.month}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                    Amount
                  </p>
                  <p className="font-bold text-slate-900">
                    ₹{payment.amount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                    Bank Account
                  </p>
                  <p className="font-medium text-slate-900">
                    {payment.bankAccount}
                  </p>
                </div>
              </div>

              {/* Transaction Details (only for processed) */}
              {payment.status === "Processed" && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                        Payment Date
                      </p>
                      <p className="font-medium text-slate-900">
                        {payment.paymentDate}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                        Transaction ID
                      </p>
                      <p className="font-medium text-slate-900">
                        {payment.transactionId}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                        Processed By
                      </p>
                      <p className="font-medium text-slate-900">
                        {payment.processedBy}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
});
