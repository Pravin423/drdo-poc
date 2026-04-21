import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ATTENDANCE_DATA } from "./utils/data";

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
function CustomAttendanceTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-100">
      <p className="text-xs font-bold text-slate-400 mb-2 uppercase">
        {payload[0].payload.month}
      </p>
      <div className="space-y-1">
        <p className="text-sm font-bold text-[#1e3a5f]">
          Actual: {payload[1]?.value}%
        </p>
        <p className="text-sm font-medium text-amber-600">
          Target: {payload[0]?.value}%
        </p>
      </div>
    </div>
  );
}

// ─── AttendanceTrends ─────────────────────────────────────────────────────────
/**
 * Line chart comparing actual attendance vs. monthly target over 6 months.
 */
export default function AttendanceTrends() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm min-h-[400px] transition-all hover:shadow-md"
    >
      <header className="mb-8">
        <h2 className="text-xl font-bold text-[#1e3a5f] tracking-tight">
          Monthly Attendance Trends
        </h2>
        <p className="text-sm text-slate-500">
          Attendance percentage over the last 6 months
        </p>
      </header>

      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={ATTENDANCE_DATA}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 12 }}
            />
            <Tooltip content={<CustomAttendanceTooltip />} />
            <Line
              type="monotone"
              dataKey="target"
              stroke="#f59e0b"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 4, fill: "#f59e0b", strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="attendance"
              stroke="#1e3a5f"
              strokeWidth={3}
              dot={{ r: 5, fill: "#1e3a5f", strokeWidth: 0 }}
              activeDot={{ r: 7, stroke: "#fff", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.section>
  );
}
