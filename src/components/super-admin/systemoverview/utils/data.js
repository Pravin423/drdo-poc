import {
  AlertCircle,
  Clock,
  CheckCircle2,
  UploadCloud,
  AlertTriangle,
  Users,
  FileText,
  ShieldAlert,
  Zap,
} from "lucide-react";

// ─── Chart Data ──────────────────────────────────────────────────────────────

export const CITY_DATA_30_DAYS = [
  { city: "Panaji",   northGoa: 1250, southGoa: 980  },
  { city: "Margao",   northGoa: 850,  southGoa: 1420 },
  { city: "Mapusa",   northGoa: 1450, southGoa: 600  },
  { city: "Vasco",    northGoa: 720,  southGoa: 1350 },
  { city: "Ponda",    northGoa: 1100, southGoa: 1280 },
  { city: "Bicholim", northGoa: 980,  southGoa: 450  },
];

export const CITY_DATA_6_MONTHS = [
  { city: "Panaji",   northGoa: 4500, southGoa: 3200 },
  { city: "Margao",   northGoa: 3100, southGoa: 5100 },
  { city: "Mapusa",   northGoa: 5200, southGoa: 2100 },
  { city: "Vasco",    northGoa: 2800, southGoa: 4900 },
  { city: "Ponda",    northGoa: 4100, southGoa: 4300 },
  { city: "Bicholim", northGoa: 3800, southGoa: 1800 },
];

export const ATTENDANCE_DATA = [
  { month: "Aug", attendance: 82, target: 85 },
  { month: "Sep", attendance: 88, target: 85 },
  { month: "Oct", attendance: 73, target: 85 },
  { month: "Nov", attendance: 90, target: 85 },
  { month: "Dec", attendance: 87, target: 85 },
  { month: "Jan", attendance: 89, target: 85 },
];

export const ACTIVITIES = [
  {
    id: 1,
    title: "Honorarium Approval Pending",
    desc: "Multiple approvals awaiting review",
    status: "Pending",
    priority: "High",
    time: "30 Jan, 11:45 AM",
    icon: AlertCircle,
    color: "text-amber-500",
  },
  {
    id: 2,
    title: "Attendance Exception Alert",
    desc: "Geo-location mismatch detected",
    status: "In Progress",
    priority: "Medium",
    time: "30 Jan, 10:30 AM",
    icon: Clock,
    color: "text-blue-500",
  },
  {
    id: 3,
    title: "System Configuration Updated",
    desc: "Rate master updated for vertical tasks",
    status: "Completed",
    priority: "Low",
    time: "30 Jan, 09:15 AM",
    icon: CheckCircle2,
    color: "text-emerald-500",
  },
  {
    id: 4,
    title: "Bulk Import Completed",
    desc: "New records registered successfully",
    status: "Completed",
    priority: "Medium",
    time: "29 Jan, 05:20 PM",
    icon: UploadCloud,
    color: "text-indigo-500",
  },
  {
    id: 5,
    title: "Task Assignment Bottleneck",
    desc: "Pending supervisor approvals detected",
    status: "Pending",
    priority: "High",
    time: "29 Jan, 03:45 PM",
    icon: AlertTriangle,
    color: "text-rose-500",
  },
  {
    id: 6,
    title: "New Admin Onboarded",
    desc: "Access granted to North Goa district office",
    status: "Completed",
    priority: "Low",
    time: "29 Jan, 11:20 AM",
    icon: Users,
    color: "text-cyan-500",
  },
  {
    id: 7,
    title: "Payment Disbursement Failed",
    desc: "Bank server timeout for Batch #402",
    status: "Pending",
    priority: "High",
    time: "29 Jan, 09:10 AM",
    icon: AlertCircle,
    color: "text-rose-600",
  },
  {
    id: 8,
    title: "Monthly Performance Report",
    desc: "System generated report is ready for download",
    status: "Completed",
    priority: "Low",
    time: "28 Jan, 06:30 PM",
    icon: FileText,
    color: "text-slate-500",
  },
  {
    id: 9,
    title: "Unusual Login Detected",
    desc: "Failed login attempt from unrecognized IP",
    status: "In Progress",
    priority: "High",
    time: "28 Jan, 02:15 PM",
    icon: ShieldAlert,
    color: "text-orange-500",
  },
  {
    id: 10,
    title: "Database Optimization",
    desc: "Scheduled maintenance completed successfully",
    status: "Completed",
    priority: "Medium",
    time: "28 Jan, 01:00 AM",
    icon: Zap,
    color: "text-purple-500",
  },
];

// ─── Shared Small Components ──────────────────────────────────────────────────

export function PriorityBadge({ priority }) {
  const styles = {
    High:   "bg-rose-50  text-rose-700  border-rose-100",
    Medium: "bg-amber-50 text-amber-700 border-amber-100",
    Low:    "bg-slate-50 text-slate-600 border-slate-200",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${styles[priority]}`}
    >
      {priority}
    </span>
  );
}
