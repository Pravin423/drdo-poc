// ✅ USE THIS ONE
import {
  Shield,
  MapPin,
  RefreshCw,
  Menu,
  Filter,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Clock,
  CheckCircle2,
  UploadCloud,
  AlertTriangle,
  Users,
  Activity,
  CreditCard,
  ShieldCheck,
  FileText,
  ShieldAlert,
  Zap,

  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal

} from "lucide-react";

import { useState } from "react";
import { motion } from "framer-motion";

import ProtectedRoute from "../../components/ProtectedRoute";
import DashboardLayout from "../../components/DashboardLayout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  LineChart,

} from "recharts";

const alerts = [
  { id: 1, type: 'critical', location: 'Bihar', count: 420, time: '12m ago' },
  { id: 2, type: 'warning', location: 'Uttar Pradesh', count: 128, time: '1h ago' },
  { id: 3, type: 'warning', location: 'Rajasthan', count: 85, time: '3h ago' },
];

const ATTENDANCE_DATA = [
  { month: "Aug", attendance: 82, target: 85 },
  { month: "Sep", attendance: 88, target: 85 },
  { month: "Oct", attendance: 73, target: 85 },
  { month: "Nov", attendance: 90, target: 85 },
  { month: "Dec", attendance: 87, target: 85 },
  { month: "Jan", attendance: 89, target: 85 },
];

const activities = [
  {
    id: 1,
    title: 'Honorarium Approval Pending',
    desc: 'Multiple approvals awaiting review',
    status: 'Pending',
    priority: 'High',
    time: '30 Jan, 11:45 AM',
    icon: AlertCircle,
    color: 'text-amber-500'
  },
  {
    id: 2,
    title: 'Attendance Exception Alert',
    desc: 'Geo-location mismatch detected',
    status: 'In Progress',
    priority: 'Medium',
    time: '30 Jan, 10:30 AM',
    icon: Clock,
    color: 'text-blue-500'
  },
  {
    id: 3,
    title: 'System Configuration Updated',
    desc: 'Rate master updated for vertical tasks',
    status: 'Completed',
    priority: 'Low',
    time: '30 Jan, 09:15 AM',
    icon: CheckCircle2,
    color: 'text-emerald-500'
  },
  {
    id: 4,
    title: 'Bulk Import Completed',
    desc: 'New records registered successfully',
    status: 'Completed',
    priority: 'Medium',
    time: '29 Jan, 05:20 PM',
    icon: UploadCloud,
    color: 'text-indigo-500'
  },
  {
    id: 5,
    title: 'Task Assignment Bottleneck',
    desc: 'Pending supervisor approvals detected',
    status: 'Pending',
    priority: 'High',
    time: '29 Jan, 03:45 PM',
    icon: AlertTriangle,
    color: 'text-rose-500'
  },
  {
    id: 6,
    title: 'New Admin Onboarded',
    desc: 'Access granted to North Goa district office',
    status: 'Completed',
    priority: 'Low',
    time: '29 Jan, 11:20 AM',
    icon: Users, // Needs 'Users' in imports
    color: 'text-cyan-500'
  },
  {
    id: 7,
    title: 'Payment Disbursement Failed',
    desc: 'Bank server timeout for Batch #402',
    status: 'Pending',
    priority: 'High',
    time: '29 Jan, 09:10 AM',
    icon: AlertCircle,
    color: 'text-rose-600'
  },
  {
    id: 8,
    title: 'Monthly Performance Report',
    desc: 'System generated report is ready for download',
    status: 'Completed',
    priority: 'Low',
    time: '28 Jan, 06:30 PM',
    icon: FileText, // Needs 'FileText' in imports
    color: 'text-slate-500'
  },
  {
    id: 9,
    title: 'Unusual Login Detected',
    desc: 'Failed login attempt from unrecognized IP',
    status: 'In Progress',
    priority: 'High',
    time: '28 Jan, 02:15 PM',
    icon: ShieldAlert, // Needs 'ShieldAlert' in imports
    color: 'text-orange-500'
  },
  {
    id: 10,
    title: 'Database Optimization',
    desc: 'Scheduled maintenance completed successfully',
    status: 'Completed',
    priority: 'Medium',
    time: '28 Jan, 01:00 AM',
    icon: Zap, // Needs 'Zap' in imports
    color: 'text-purple-500'
  },
];


const SUMMARY_CARDS = [
  {
    label: "Total CRPs (All States)",
    value: "12,847",
    delta: "+8.2%",
    isPositive: true,
    icon: Users,
    accent: "text-emerald-600 bg-emerald-50 border-emerald-100",
  },
  {
    label: "Overall Attendance Rate",
    value: "87.3%",
    delta: "+2.1%",
    isPositive: true,
    icon: Activity,
    accent: "text-blue-600 bg-blue-50 border-blue-100",
  },
  {
    label: "Honorarium Processing",
    value: "₹42.8L",
    delta: "Pending",
    isPositive: null,
    icon: CreditCard,
    accent: "text-amber-600 bg-amber-50 border-amber-100",
  },
  {
    label: "System Health Score",
    value: "98.5%",
    delta: "-0.3%",
    isPositive: false,
    icon: ShieldCheck,
    accent: "text-rose-600 bg-rose-50 border-rose-100",
  },
];

const DATA_30_DAYS = [
  { state: "Goa", active: 1180 },
  { state: "Maharashtra", active: 8120 },
  { state: "Kerala", active: 3540 },
  { state: "Tamil Nadu", active: 6890 },
  { state: "Gujarat", active: 5210 },
  { state: "Uttar Pradesh", active: 9780 },
  { state: "Karnataka", active: 6450 },
];

const DATA_6_MONTHS = [
  { state: "Rajasthan", active: 7680 },
  { state: "Gujarat", active: 8320 },
  { state: "Madhya Pradesh", active: 6380 },
  { state: "Karnataka", active: 5750 },
  { state: "Maharashtra", active: 5200 },
  { state: "West Bengal", active: 7020 },
];

const PriorityBadge = ({ priority }) => {
  const styles = {
    High: "bg-rose-50 text-rose-700 border-rose-100",
    Medium: "bg-amber-50 text-amber-700 border-amber-100",
    Low: "bg-slate-50 text-slate-600 border-slate-200"
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${styles[priority]}`}>
      {priority}
    </span>
  );
};

export default function CrpManagement() {
  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(activities.length / ITEMS_PER_PAGE);

  const paginatedActivities = activities.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const [range, setRange] = useState("30");
  const [chartData, setChartData] = useState(DATA_30_DAYS);
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleString());

  return (
    <ProtectedRoute allowedRole="super-admin">
      <DashboardLayout>
        <div className="max-w-[1600px] mx-auto space-y-8 p-4">

          {/* Header Section */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Super Admin{" "}
                <span className="bg-gradient-to-b from-[#3b52ab] to-[#1a2e7a] bg-clip-text text-transparent">
                  Overview
                </span>
              </h1>
              <p className="text-slate-500 font-medium">
                System-wide analytics and multi-state configuration oversight.
              </p>
            </div>
            <button className="w-fit px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-all active:scale-95">
              Download Report
            </button>
          </motion.header>

          {/* Summary Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {SUMMARY_CARDS.map((card, index) => (
              <motion.section
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex justify-between items-start">
                  <div className={`p-2.5 rounded-2xl ${card.accent} border`}>
                    <card.icon size={20} />
                  </div>
                  {card.isPositive !== null && (
                    <div className={`flex items-center gap-0.5 text-[11px] font-bold px-2 py-1 rounded-full ${card.isPositive ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'}`}>
                      {card.isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                      {card.delta}
                    </div>
                  )}
                </div>
                <div className="mt-5 space-y-1">
                  <p className="text-2xl font-bold text-slate-900 tracking-tight">{card.value}</p>
                  <p className="text-sm font-medium text-slate-500">{card.label}</p>
                </div>
                <div className="absolute -right-2 -bottom-2 opacity-5 transition-transform group-hover:scale-110">
                  <card.icon size={80} />
                </div>
              </motion.section>
            ))}
          </div>

          {/* Main Charts Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* State-wise CRP Distribution Chart */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col min-h-[450px] transition-all hover:shadow-md"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight">State-wise CRP Distribution</h2>
                  <p className="text-sm text-slate-500">Active CRPs across different states</p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={range}
                    onChange={(e) => {
                      const value = e.target.value;
                      setRange(value);
                      setChartData(value === "30" ? DATA_30_DAYS : DATA_6_MONTHS);
                    }}
                    className="text-xs font-bold bg-slate-50 border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500/20 outline-none cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <option value="30">Last 30 Days</option>
                    <option value="180">Last 6 Months</option>
                  </select>
                  <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400">
                    <MoreHorizontal size={18} />
                  </button>
                </div>
              </div>

              {/* Chart */}
              <div className="flex-1 w-full min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="state" axisLine={false} tickLine={false} tick={{ fill: "#64748B", fontSize: 12, fontWeight: 500 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 11 }} domain={[0, 6000]} />
                    <Tooltip cursor={{ fill: "#F1F5F9" }} content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="active" stroke="#2563EB" strokeWidth={3} fill="url(#areaGradient)" animationDuration={1400} />
                    <Line type="monotone" dataKey="active" stroke="#1E40AF" strokeWidth={2} dot={{ r: 4, fill: "#1E40AF" }} activeDot={{ r: 6 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Legend */}
              <div className="mt-6 flex items-center justify-center gap-6 border-t border-slate-50 pt-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-sm bg-[#0F4C75]" />
                  <span className="text-xs font-semibold text-slate-600">Active CRPs</span>
                </div>
                <div className="flex items-center gap-2 opacity-30">
                  <div className="h-3 w-3 rounded-sm bg-slate-200" />
                  <span className="text-xs font-semibold text-slate-600">Inactive</span>
                </div>
              </div>
            </motion.section>

            {/* System Health */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col transition-all hover:shadow-md"
            >
              <header className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight">System Health</h2>
                  <p className="text-sm text-slate-500">Live service monitoring</p>
                </div>
                <div className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </div>
              </header>

              <div className="flex-1 space-y-3">
                {["Database Cluster", "API Gateway", "Auth Service", "File Storage", "Cloud Backups"].map((item, i) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                  >
                    <HealthRow
                      title={item}
                      status={item === "File Storage" ? "Degraded" : "Operational"}
                      icon={i % 2 === 0 ? <ShieldCheck size={16} /> : <Activity size={16} />}
                    />
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                <span className="text-[11px] font-medium text-slate-400 italic">
                  Synced: {lastUpdated.split(',')[1]}
                </span>
                <button
                  onClick={() => setLastUpdated(new Date().toLocaleString())}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Refresh System
                </button>
              </div>
            </motion.section>
          </div>

          {/* Monthly Attendance */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm min-h-[400px] transition-all hover:shadow-md"
          >
            <header className="mb-8">
              <h2 className="text-xl font-bold text-[#1e3a5f] tracking-tight">Monthly Attendance Trends</h2>
              <p className="text-sm text-slate-500">Attendance percentage over the last 6 months</p>
            </header>

            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ATTENDANCE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} dy={10} />
                  <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                  <Tooltip content={<CustomAttendanceTooltip />} />
                  <Line type="monotone" dataKey="target" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4, fill: "#f59e0b", strokeWidth: 0 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="attendance" stroke="#1e3a5f" strokeWidth={3} dot={{ r: 5, fill: "#1e3a5f", strokeWidth: 0 }} activeDot={{ r: 7, stroke: "#fff", strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.section>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Header Section */}
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Recent System Activities</h2>
                <p className="text-sm text-slate-500 mt-0.5">Latest administrative actions and alerts across all regions.</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                  <Filter size={16} /> Filter
                </button>
                <button className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-all shadow-md shadow-slate-200">
                  <Download size={16} /> Export
                </button>
              </div>
            </div>

            {/* Table Section */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Activity</th>
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">State</th>
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Status</th>
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Priority</th>
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Timestamp</th>
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedActivities.map((item, idx) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="group hover:bg-slate-50/80 transition-colors cursor-default"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-start gap-4">
                          <div className={`mt-1 p-2 rounded-lg bg-white border border-slate-100 shadow-sm ${item.color}`}>
                            <item.icon size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{item.title}</p>
                            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-sm font-medium text-slate-700">{item.state}</span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <div className={`h-1.5 w-1.5 rounded-full ${item.status === 'Completed' ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                          <span className="text-sm text-slate-600 font-medium">{item.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <PriorityBadge priority={item.priority} />
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-xs font-medium text-slate-500">{item.time}</span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button className="inline-flex cursor-pointer items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg transition-all hover:border-blue-400 hover:text-blue-600 shadow-sm">
                          <Eye size={14} /> VIEW
                        </button>

                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer / Pagination */}
            <div className="px-6 py-4 bg-slate-50/30 border-t border-slate-100 flex items-center justify-between">
              <p className="text-xs font-medium text-slate-500">
                Showing{" "}
                <span className="text-slate-900 font-bold">
                  {ITEMS_PER_PAGE}
                </span>{" "}

                of{" "}
                <span className="text-slate-900 font-bold">
                  {activities.length}
                </span>{" "}
                activities
              </p>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                >
                  <ChevronLeft size={18} />
                </button>

                <div className="flex items-center gap-1 mx-2">
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all
            ${currentPage === page
                            ? "bg-slate-900 text-white"
                            : "text-slate-500 hover:bg-white border border-transparent hover:border-slate-200"
                          }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 text-slate-600 hover:bg-white hover:shadow-sm rounded-lg transition-all border border-transparent hover:border-slate-200 disabled:opacity-30"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}


// Custom Tooltip for a "Premium" feel
function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-800">
        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">
          {payload[0].payload.state}
        </p>
        <p className="text-sm font-bold">
          {payload[0].value.toLocaleString()}{" "}
          <span className="text-blue-400 ml-1">Active</span>
        </p>
      </div>
    );
  }
  return null;
}
function HealthRow({ title, status, icon }) {
  const isOperational = status === "Operational";

  return (
    <div className="flex items-center justify-between p-3 rounded-2xl border border-slate-50 bg-slate-50/30 hover:bg-slate-50 transition-colors group">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg bg-white shadow-sm border border-slate-100 ${isOperational ? 'text-emerald-600' : 'text-amber-600'}`}>
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-700 leading-none">{title}</h3>
          <p className="text-[11px] text-slate-500 mt-1 uppercase tracking-wider font-medium">Region: India-West</p>
        </div>
      </div>

      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${isOperational
        ? "bg-emerald-50 text-emerald-700"
        : "bg-amber-50 text-amber-700 animate-pulse"
        }`}>
        {status}
      </div>
    </div>
  );
}
function CustomAttendanceTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-100">
        <p className="text-xs font-bold text-slate-400 mb-2 uppercase">{payload[0].payload.month}</p>
        <div className="space-y-1">
          <p className="text-sm font-bold text-[#1e3a5f]">
            Actual: {payload[1].value}%
          </p>
          <p className="text-sm font-medium text-amber-600">
            Target: {payload[0].value}%
          </p>
        </div>
      </div>
    );
  }
  return null;
}