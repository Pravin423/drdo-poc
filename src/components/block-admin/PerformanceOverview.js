import React, { useState, useEffect } from 'react'
import SummaryCard from '../common/SummaryCard'
import { Map, MapPin, Activity, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts'

export default function PerformanceOverview({ user }) {
  const [talukas, setTalukas] = useState([]);
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

        if (json.status && json.data) {
          const filtered = json.data
            .filter(t => stringIds.includes(String(t.id)))
            .map(t => {
              // Count villages that match this taluka ID (check various possible field names)
              const vCount = allVillages.filter(v => 
                String(v.taluka_id || v.talukaId || v.block_id || v.blockId || "") === String(t.id)
              ).length;
              
              return {
                ...t,
                villageCount: vCount
              };
            });
          setTalukas(filtered);
        }
      } catch (e) {
        console.error("Error fetching taluka performance data:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNames();
  }, [districtId, assignedTalukaIds]);

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
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden p-8 flex flex-col h-[450px]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Village Distribution</h3>
              <p className="text-sm text-slate-500">Comparison of village coverage across blocks.</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-600" />
              <span className="text-xs font-bold text-slate-600 uppercase tracking-tighter">Villages</span>
            </div>
          </div>
          
          <div className="flex-1 w-full min-h-0">
            {isLoading ? (
              <div className="w-full h-full bg-slate-50 rounded-2xl animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={talukas} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                  />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ 
                      borderRadius: '16px', 
                      border: 'none', 
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      padding: '12px'
                    }}
                    labelStyle={{ fontWeight: 800, marginBottom: '4px', color: '#1e293b' }}
                  />
                  <Bar 
                    dataKey="villageCount" 
                    radius={[6, 6, 0, 0]} 
                    barSize={40}
                    animationDuration={1500}
                  >
                    {talukas.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={index % 2 === 0 ? '#3b82f6' : '#6366f1'} 
                        fillOpacity={0.9}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-900 to-indigo-950 rounded-[2rem] p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2">Efficiency Insights</h3>
            <p className="text-blue-200/80 text-sm leading-relaxed">
              Your blocks are currently operating at a baseline. Increase activity forms to see performance trends.
            </p>
          </div>
          
          <div className="space-y-6 relative z-10">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-blue-300">
                <span>Coverage Score</span>
                <span>{talukas.length > 0 ? "Normal" : "--"}</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "65%" }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                  className="h-full bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.5)]" 
                />
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute -left-20 -top-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
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
                    <AnimatePresence mode="wait">
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ 
                            type: "spring", 
                            stiffness: 300, 
                            damping: 30,
                            opacity: { duration: 0.2 } 
                          }}
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
                                { label: 'Active CRPs', val: '0', color: 'slate' },
                                { label: 'Tasks Done', val: '0', color: 'slate' },
                                { label: 'Efficiency', val: '0%', color: 'emerald' },
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
                            <motion.div 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.3 }}
                              className="mt-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100 flex items-center justify-between"
                            >
                              <p className="text-xs font-medium text-blue-700">Detailed analytics for this block will synchronize in the next cycle.</p>
                              <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Sync Now</button>
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
