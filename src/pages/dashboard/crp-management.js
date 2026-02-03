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