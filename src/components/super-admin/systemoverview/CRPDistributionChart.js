import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList
} from "recharts";

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  
  return (
    <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-800 z-50">
      <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2 flex items-center gap-1">
        <MapPin size={10} />
        {data.area}
      </p>
      <div className="space-y-1">
        <p className="text-sm font-bold flex items-center justify-between gap-4">
          <span className="text-white">Avg. Attendance</span>
          <span className={data.attendance >= 85 ? "text-emerald-400" : data.attendance >= 70 ? "text-amber-400" : "text-rose-400"}>
            {data.attendance}%
          </span>
        </p>
        <p className="text-[10px] text-slate-500 font-medium pt-1 border-t border-slate-800">
          Based on {data.totalStaff} total staff members
        </p>
      </div>
    </div>
  );
}

// ─── AreaWiseAttendanceChart ──────────────────────────────────────────────────
export default function AreaWiseAttendanceChart() {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAreaAttendance() {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem("authToken") : null;
        const date = new Date().toISOString().split('T')[0];
        
        const res = await fetch(`/api/attendance-report?date=${date}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const result = await res.json();
        
        let rawData = result?.data?.data || result?.data || result?.attendance || [];
        if (!Array.isArray(rawData)) rawData = [];

        const areaStats = {};
        
        rawData.forEach(item => {
          const area = item.taluka_name || item.block || item.district_name || item.district || "Unassigned";
          if (!areaStats[area]) {
            areaStats[area] = { present: 0, total: 0 };
          }
          
          areaStats[area].total += 1;
          
          const isPresent = item.attendance_status === 1 || !!item.checkin_time;
          if (isPresent) {
            areaStats[area].present += 1;
          }
        });

        const processedData = Object.entries(areaStats).map(([area, stats]) => {
          const attendance = stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0;
          return {
            area,
            attendance,
            totalStaff: stats.total
          };
        }).sort((a, b) => b.attendance - a.attendance);

        setChartData(processedData);
        
      } catch (err) {
        console.error("Failed to fetch area attendance:", err);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchAreaAttendance();
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col min-h-[450px] transition-all hover:shadow-md relative overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2 relative z-10">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Area-wise Attendance Leaderboard
            <TrendingUp size={18} className="text-slate-400" />
          </h2>
          <p className="text-sm text-slate-500">
            Performance ranked by operational blocks today
          </p>
        </div>

        {isLoading && (
          <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
            <div className="w-3 h-3 border-2 border-[#3b52ab] border-t-transparent rounded-full animate-spin" />
            <span className="text-[10px] font-black uppercase text-[#3b52ab] tracking-widest">Live Sync</span>
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="flex-1 w-full mt-4 flex flex-col justify-center">
        {!isLoading && chartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-8 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 h-full">
            <MapPin size={32} className="text-slate-300 mb-3" />
            <p className="text-sm font-bold text-slate-600">No Attendance Records Yet</p>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              Waiting for staff members to check in today. The leaderboard will populate automatically once records are received.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={chartData.length * 45 > 300 ? chartData.length * 45 : 300}>
          <BarChart 
            layout="vertical" 
            data={chartData} 
            margin={{ top: 10, right: 40, left: 10, bottom: 0 }}
          >
            <XAxis 
              type="number" 
              domain={[0, 100]} 
              hide 
            />
            <YAxis 
              type="category" 
              dataKey="area" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "#475569", fontSize: 12, fontWeight: 700 }} 
              width={90}
            />
            <Tooltip 
              cursor={{ fill: "transparent" }} 
              content={<CustomTooltip />} 
            />
            <Bar
              dataKey="attendance"
              barSize={18}
              radius={[8, 8, 8, 8]}
              background={{ fill: '#F1F5F9', radius: 8 }}
              animationDuration={1500}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.attendance >= 85 ? "#10B981" : entry.attendance >= 70 ? "#F59E0B" : "#EF4444"} 
                />
              ))}
              <LabelList 
                dataKey="attendance" 
                position="right" 
                formatter={(val) => `${val}%`}
                style={{ fill: '#64748B', fontSize: 11, fontWeight: 800 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-6 border-t border-slate-50 pt-4">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-[#10B981]" />
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Optimal (≥85%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-[#F59E0B]" />
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Average (70-84%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-[#EF4444]" />
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Low (&lt;70%)</span>
        </div>
      </div>
    </motion.section>
  );
}
