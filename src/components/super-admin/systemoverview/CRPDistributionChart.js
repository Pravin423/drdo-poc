import { useState } from "react";
import { motion } from "framer-motion";
import { MoreHorizontal } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CITY_DATA_30_DAYS, CITY_DATA_6_MONTHS } from "./utils/data";

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-800">
      <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2">
        {payload[0].payload.city}
      </p>
      <div className="space-y-1">
        <p className="text-sm font-bold flex items-center justify-between gap-4">
          <span className="text-blue-400">North Goa</span>
          <span>{payload[0]?.value.toLocaleString()}</span>
        </p>
        <p className="text-sm font-bold flex items-center justify-between gap-4">
          <span className="text-emerald-400">South Goa</span>
          <span>{payload[1]?.value.toLocaleString()}</span>
        </p>
      </div>
    </div>
  );
}

// ─── CRPDistributionChart ─────────────────────────────────────────────────────
/**
 * Area chart showing city-wise CRP distribution for North & South Goa.
 * Includes a 30-day / 6-month toggle and a legend.
 */
export default function CRPDistributionChart() {
  const [range, setRange] = useState("30");
  const [chartData, setChartData] = useState(CITY_DATA_30_DAYS);

  const handleRangeChange = (e) => {
    const value = e.target.value;
    setRange(value);
    setChartData(value === "30" ? CITY_DATA_30_DAYS : CITY_DATA_6_MONTHS);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col min-h-[450px] transition-all hover:shadow-md"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            City-wise CRP Distribution (Goa)
          </h2>
          <p className="text-sm text-slate-500">
            Active CRPs in North and South Goa across major cities
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={range}
            onChange={handleRangeChange}
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
              <linearGradient id="northGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="southGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis
              dataKey="city"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748B", fontSize: 12, fontWeight: 500 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94A3B8", fontSize: 11 }}
            />
            <Tooltip cursor={{ fill: "#F1F5F9" }} content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="northGoa"
              stroke="#2563EB"
              strokeWidth={3}
              fill="url(#northGradient)"
              animationDuration={1400}
            />
            <Area
              type="monotone"
              dataKey="southGoa"
              stroke="#10B981"
              strokeWidth={3}
              fill="url(#southGradient)"
              animationDuration={1400}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-center gap-6 border-t border-slate-50 pt-4">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-sm bg-[#2563EB]" />
          <span className="text-xs font-semibold text-slate-600">North Goa</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-sm bg-[#10B981]" />
          <span className="text-xs font-semibold text-slate-600">South Goa</span>
        </div>
      </div>
    </motion.section>
  );
}
