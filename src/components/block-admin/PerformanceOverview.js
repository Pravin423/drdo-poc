import React, { useState, useEffect } from 'react'
import SummaryCard from '../common/SummaryCard'
import { Map, MapPin, Activity, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts'

const COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981'];

export default function PerformanceOverview({ user }) {
  const [talukas, setTalukas] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedBlockId, setExpandedBlockId] = useState(null);

  const districtId = user?.district_id;
  const assignedTalukaIds = user?.taluka_id;
  const roleName = user?.role_name || "Block Manager";

  useEffect(() => {
    const fetchNames = async () => {
      if (!districtId) {
        setIsLoading(false);
        return;
      }
      try {
        // 1. Parse IDs
        let idsArray = [];
        if (typeof assignedTalukaIds === 'string' && assignedTalukaIds.startsWith('[')) {
          idsArray = JSON.parse(assignedTalukaIds);
        } else if (Array.isArray(assignedTalukaIds)) {
          idsArray = assignedTalukaIds;
        } else {
          idsArray = [assignedTalukaIds];
        }
        const stringIds = idsArray.map(String);

        // 2. Fetch all talukas for the district
        const res = await fetch(`/api/talukas?district_id=${districtId}`);
        const json = await res.json();
        
        // 3. Fetch all villages to ensure we get data even if district filter is strict
        const vRes = await fetch(`/api/villages`);
        const vJson = await vRes.json();
        const allVillages = vJson.status && vJson.data ? vJson.data : [];

        // 4. Fetch all employees to filter for active staff
        const eRes = await fetch(`/api/employees`);
        const eJson = await eRes.json();
        const allEmployees = eJson.status && eJson.data ? eJson.data : [];

        // 5. Fetch SHGs to map counts
        const sRes = await fetch(`/api/shg-list`);
        const sJson = await sRes.json();
        const allSHGs = sJson.status && sJson.data ? sJson.data : [];

        if (json.status && json.data) {
          const filtered = json.data
            .filter(t => stringIds.includes(String(t.id)))
            .map(t => {
              // Count villages
              const vCount = allVillages.filter(v => 
                String(v.taluka_id || v.talukaId || v.block_id || v.blockId || "") === String(t.id)
              ).length;

              // Count SHGs for this taluka
              const sCount = allSHGs.filter(s => 
                String(s.taluka_id || s.block_id || s.talukaId || "") === String(t.id)
              ).length;
              
              return {
                ...t,
                villageCount: vCount,
                shgCount: sCount
              };
            });
          setTalukas(filtered);

          // Filter employees for these talukas
          const assignedEmployees = allEmployees.filter(emp => 
            stringIds.includes(String(emp.taluka_id || emp.block_id || ""))
          );
          setEmployees(assignedEmployees);
        }
      } catch (e) {
        console.error("Error fetching taluka performance data:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNames();
  }, [districtId, assignedTalukaIds]);

  const totalVillagesInBlocks = talukas.reduce((acc, curr) => acc + (curr.villageCount || 0), 0);
  const activeStaffCount = employees.length;
  const coveragePercent = totalVillagesInBlocks > 0 ? Math.min(Math.round((activeStaffCount / talukas.length) * 100), 100) : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          {roleName}{" "}
          <span className="bg-gradient-to-b from-[#3b52ab] to-[#1a2e7a] bg-clip-text text-transparent">
            Performance
          </span>
        </h1>
        <p className="text-slate-500 font-medium">
          Real-time metrics and block-level performance benchmarks.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="relative group">
          <SummaryCard 
            title="Total Assigned Blocks"
            value={talukas.length}
            icon={Map}
            variant="blue"
            delay={0.1}
          />
        </div>

        <SummaryCard 
          title="Active CRPs"
          value="--"
          icon={Activity}
          variant="emerald"
          delay={0.2}
        />

        <SummaryCard 
          title="Target Completion"
          value="0%"
          icon={MapPin}
          variant="amber"
          delay={0.3}
        />
      </div>

      {/* Performance Chart Section */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden p-8 flex flex-col h-[550px]">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Village Distribution</h3>
            <p className="text-sm text-slate-500">Proportional breakdown of village coverage across all assigned blocks.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-600" />
            <span className="text-xs font-bold text-slate-600 uppercase tracking-tighter">Villages</span>
          </div>
        </div>
        
        <div className="flex-1 w-full min-h-0 relative">
          {isLoading ? (
            <div className="w-full h-full bg-slate-50 rounded-2xl animate-pulse" />
          ) : (
            <>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={talukas}
                    cx="50%"
                    cy="45%"
                    innerRadius={110}
                    outerRadius={160}
                    paddingAngle={5}
                    dataKey="villageCount"
                    animationDuration={1500}
                  >
                    {talukas.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                      contentStyle={{ 
                        borderRadius: '16px', 
                        border: 'none', 
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                        padding: '12px'
                      }}
                      itemStyle={{ fontWeight: 800, color: '#1e293b' }}
                  />
                  <Legend 
                      verticalAlign="bottom" 
                      height={36} 
                      iconType="circle"
                      formatter={(value) => <span className="text-[10px] font-bold text-slate-500 uppercase">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Central Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mb-14">
                <span className="text-4xl font-black text-slate-900 leading-none">{totalVillagesInBlocks}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Total Villages</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Taluka Comparison Section */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden p-8 flex flex-col h-[500px]">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Comparative Performance Analysis</h3>
            <p className="text-sm text-slate-500">Comparing SHG mapping progress across all assigned talukas.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-indigo-600" />
            <span className="text-xs font-bold text-slate-600 uppercase tracking-tighter">SHGs Mapped</span>
          </div>
        </div>

        <div className="flex-1 w-full min-h-0">
          {isLoading ? (
            <div className="w-full h-full bg-slate-50 rounded-2xl animate-pulse" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={talukas} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                  angle={-45}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    padding: '12px'
                  }}
                />
                <Bar 
                  dataKey="shgCount" 
                  fill="#6366f1" 
                  radius={[8, 8, 0, 0]} 
                  barSize={40}
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Detailed Performance List */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-900">Block-wise Detailed Analysis</h3>
          <p className="text-sm text-slate-500">Click on a block to view specific performance metrics.</p>
        </div>
        <div className="p-8">
          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              {[1,2,3].map(i => <div key={i} className="h-16 bg-slate-100 rounded-2xl" />)}
            </div>
          ) : talukas.length > 0 ? (
            <div className="grid gap-4">
              {talukas.map(t => {
                const isExpanded = expandedBlockId === t.id;
                return (
                  <div key={t.id} className="overflow-hidden bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-all duration-300">
                    {/* Row Header - Clickable */}
                    <div 
                      onClick={() => setExpandedBlockId(isExpanded ? null : t.id)}
                      className="flex items-center justify-between p-5 cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-bold transition-all duration-300 ${isExpanded ? 'text-blue-600 border-blue-200 scale-110 shadow-sm' : 'text-slate-400'}`}>
                          {t.name.slice(0, 1)}
                        </div>
                        <div>
                          <p className={`font-bold uppercase tracking-tight transition-colors ${isExpanded ? 'text-blue-600' : 'text-slate-900'}`}>{t.name}</p>
                          <p className="text-xs text-slate-400">Taluka ID: {t.id}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right hidden sm:block">
                          <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">Current Status</p>
                          <span className={`text-xs font-black px-2 py-0.5 rounded-md ${isExpanded ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-500'}`}>
                            {isExpanded ? 'ANALYZING' : 'PENDING'}
                          </span>
                        </div>
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          className="text-slate-400 group-hover:text-blue-500 transition-colors"
                        >
                          <ChevronDown size={20} />
                        </motion.div>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ 
                            height: { duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] },
                            opacity: { duration: 0.25, ease: "linear" }
                          }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-6 pt-2 border-t border-slate-100/50 bg-white/50">
                            <motion.div 
                              initial="hidden"
                              animate="show"
                              variants={{
                                hidden: { opacity: 0 },
                                show: {
                                  opacity: 1,
                                  transition: {
                                    staggerChildren: 0.05
                                  }
                                }
                              }}
                              className="grid grid-cols-2 md:grid-cols-4 gap-4"
                            >
                              {[
                                { label: 'Villages', val: t.villageCount || 0, color: 'slate' },
                                { label: 'SHGs Mapped', val: t.shgCount || 0, color: 'slate' },
                                { 
                                  label: 'Efficiency', 
                                  val: `${Math.min(Math.round(((t.shgCount || 0) / ((t.villageCount || 1) * 5)) * 100), 100)}%`, 
                                  color: 'emerald' 
                                },
                              ].map((stat, i) => (
                                <motion.div 
                                  key={i}
                                  variants={{
                                    hidden: { opacity: 0, y: 10 },
                                    show: { opacity: 1, y: 0 }
                                  }}
                                  className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group/stat"
                                >
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover/stat:text-blue-500 transition-colors">{stat.label}</p>
                                  <p className={`text-lg font-black mt-1 ${stat.color === 'emerald' ? 'text-emerald-600' : 'text-slate-900'}`}>{stat.val}</p>
                                </motion.div>
                              ))}
                            </motion.div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-400 font-medium">No blocks assigned to display performance data.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
