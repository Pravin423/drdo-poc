import { useState, useEffect } from "react";
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
import { ATTENDANCE_DATA as MOCK_DATA } from "./utils/data";

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
export default function AttendanceTrends() {
  const [data, setData] = useState(MOCK_DATA);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAttendanceTrends() {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
        const promises = [];
        
        // Fetch the last 6 months of data
        for (let i = 5; i >= 0; i--) {
          const date = new Date();
          date.setMonth(date.getMonth() - i);
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const year = date.getFullYear();
          const monthName = date.toLocaleString('en-US', { month: 'short' });

          promises.push(
            fetch(`/api/monthly-attendance?month=${month}&year=${year}`, {
              headers: { "Authorization": `Bearer ${token}` }
            })
            .then(res => res.json())
            .then(result => ({ monthName, result }))
            .catch(() => ({ monthName, result: null }))
          );
        }

        const results = await Promise.all(promises);

        const trendData = results.map(({ monthName, result }) => {
          let attendancePercentage = 0;
          
          // Try to extract attendance data based on the API response structure used in MonthlyAttendanceGrid
          const records = result?.data?.data || result?.data || [];
          const employees = Array.isArray(records) ? records : Object.values(records || {});

          if (employees.length > 0) {
            let totalPresent = 0;
            let totalDays = 0;

            employees.forEach(emp => {
              if (emp.counts) {
                totalPresent += (emp.counts.P || 0);
                totalDays += (emp.counts.P || 0) + (emp.counts.A || 0) + (emp.counts.L || 0) + (emp.counts.H || 0);
              }
            });

            if (totalDays > 0) {
              attendancePercentage = Math.round((totalPresent / totalDays) * 100);
            }
          }

          return {
            month: monthName,
            // If the API returns no data for a past month, we fallback to 0 or leave it empty.
            attendance: attendancePercentage > 0 ? attendancePercentage : 0, 
            target: 85 // System Target is fixed at 85%
          };
        });

        // Check if we actually found any real data before replacing the mock data
        const hasRealData = trendData.some(d => d.attendance > 0);
        if (hasRealData) {
          setData(trendData);
        }
      } catch (err) {
        console.error("Failed to fetch attendance trends:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAttendanceTrends();
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm min-h-[400px] transition-all hover:shadow-md relative"
    >
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#1e3a5f] tracking-tight">
            Monthly Attendance Trends
          </h2>
          <p className="text-sm text-slate-500">
            Attendance percentage over the last 6 months
          </p>
        </div>
        {isLoading && (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-[10px] font-black uppercase text-indigo-500 tracking-widest">Live Sync</span>
          </div>
        )}
      </header>

      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
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
              isAnimationActive={false}
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
