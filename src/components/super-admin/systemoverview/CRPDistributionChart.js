import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, MapPin, CheckCircle2, UserCircle2 } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";

export default function ActiveCRPRoster() {
  const [activeCRPs, setActiveCRPs] = useState([]);
  const [stats, setStats] = useState({ present: 0, absent: 0, total: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLoggedInCRPs() {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem("authToken") : null;
        const date = new Date().toISOString().split('T')[0];
        
        // Fetch attendance and total registered CRPs simultaneously
        const [attRes, crpRes] = await Promise.all([
          fetch(`/api/attendance-report?date=${date}`, { headers: { "Authorization": `Bearer ${token}` } }),
          fetch(`/api/crp-employee`, { headers: { "Authorization": `Bearer ${token}` } })
        ]);

        const attResult = await attRes.json();
        const crpResult = await crpRes.json();
        
        let attData = attResult?.data?.data || attResult?.data || attResult?.attendance || [];
        if (!Array.isArray(attData)) attData = [];

        let crpData = crpResult?.data || crpResult?.crps || [];
        if (!Array.isArray(crpData)) crpData = [];

        const trueTotalCRPs = crpData.length || 0;
        let presentCount = 0;
        const loggedIn = [];

        attData.forEach((item, idx) => {
          const isPresent = item.attendance_status === 1 || !!item.checkin_time;
          
          if (isPresent) {
            presentCount++;
            let timeDisplay = "Checked In";
            if (item.checkin_time) {
              try {
                const parts = item.checkin_time.split(' ');
                if (parts.length > 1) {
                  const tParts = parts[1].split(':');
                  timeDisplay = `${tParts[0]}:${tParts[1]}`;
                } else {
                  timeDisplay = item.checkin_time;
                }
              } catch (e) {
                timeDisplay = item.checkin_time;
              }
            }

            loggedIn.push({
              id: item.id || item.employee_id || idx,
              name: item.fullname || item.name || "Unknown CRP",
              time: timeDisplay,
              area: item.taluka_name || item.block || item.district_name || item.district || "Unassigned Location",
              profile: item.profile || item.image || item.profile_photo || null
            });
          }
        });

        // Ensure total is at least equal to present (in case of data sync issues)
        const safeTotal = Math.max(trueTotalCRPs, presentCount);
        const absentCount = safeTotal - presentCount;

        loggedIn.sort((a, b) => {
          if (a.time > b.time) return -1;
          if (a.time < b.time) return 1;
          return 0;
        });

        setActiveCRPs(loggedIn);
        setStats({
          present: presentCount,
          absent: absentCount,
          total: presentCount + absentCount
        });
      } catch (err) {
        console.error("Failed to fetch active CRPs:", err);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchLoggedInCRPs();
  }, []);

  const donutData = [
    { name: "Checked In", value: stats.present, color: "#10B981" },
    { name: "Pending / Absent", value: stats.absent, color: "#F1F5F9" }
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white shadow-sm flex flex-col min-h-[450px] transition-all hover:shadow-md overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-start justify-between p-6 border-b border-slate-100 bg-slate-50/50">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Live Check-in Overview
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </h2>
          <p className="text-sm text-slate-500">
            Real-time attendance status and recent logins
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
            <div className="w-3 h-3 border-2 border-[#3b52ab] border-t-transparent rounded-full animate-spin" />
            <span className="text-[10px] font-black uppercase text-[#3b52ab] tracking-widest">Live Sync</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 shadow-sm">
            <CheckCircle2 size={14} className="text-emerald-500" />
            <span className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">{stats.present} Online</span>
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row flex-1">
        {/* Left Pane: Donut Chart */}
        <div className="w-full md:w-[35%] border-r border-slate-100 p-6 flex flex-col items-center justify-center bg-white relative">
          {!isLoading && stats.total > 0 ? (
            <div className="w-full h-[220px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                    animationDuration={1500}
                  >
                    {donutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                    itemStyle={{ color: '#1e293b', fontWeight: 'bold' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-1">
                <span className="text-3xl font-black text-slate-800 tracking-tighter">
                  {stats.present} <span className="text-slate-300 text-2xl">/</span> {stats.total}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Checked In</span>
              </div>
            </div>
          ) : (
            <div className="w-40 h-40 rounded-full border-8 border-slate-50 flex items-center justify-center">
              <span className="text-slate-300 font-medium text-sm">No Data</span>
            </div>
          )}
          
          <div className="w-full mt-6 space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-100/50">
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"/>Checked In</span>
              <span className="text-sm font-black text-emerald-700">{stats.present}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-slate-300"/>Pending</span>
              <span className="text-sm font-black text-slate-600">{stats.absent}</span>
            </div>
          </div>
        </div>

        {/* Right Pane: Live Feed */}
        <div className="w-full md:w-[65%] p-6 bg-slate-50/30">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Clock size={14} /> Latest Activity
          </h3>
          
          <div className="h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {!isLoading && activeCRPs.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center p-8 bg-white rounded-2xl border border-dashed border-slate-200 h-full">
                <UserCircle2 size={32} className="text-slate-300 mb-3" />
                <p className="text-sm font-bold text-slate-600">No Check-ins Yet</p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  Waiting for staff members to log their attendance today.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {activeCRPs.map((crp, idx) => (
                    <motion.div
                      key={`${crp.id}-${idx}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 bg-white hover:border-indigo-100 hover:shadow-md hover:shadow-indigo-50 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold overflow-hidden shrink-0 border border-indigo-100">
                          {crp.profile ? (
                            <img src={crp.profile} alt={crp.name} className="w-full h-full object-cover" />
                          ) : (
                            crp.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">{crp.name}</span>
                          <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
                            <MapPin size={10} className="text-slate-400" />
                            <span className="truncate max-w-[150px]">{crp.area}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="text-xs font-black text-slate-700 tabular-nums bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                          {crp.time}
                        </span>
                        <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Online
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
