import React, { useState, useEffect } from 'react'
import ProtectedRoute from '../../../components/ProtectedRoute'
import DashboardLayout from '../../../components/DashboardLayout'   
import SummaryCard from '../../../components/common/SummaryCard'
import { Map, MapPin, Activity } from 'lucide-react'
import { useAuth } from '../../../context/AuthContext'

export default function Performance() {
  const { user } = useAuth();
  const [talukas, setTalukas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
        if (json.status && json.data) {
          const filtered = json.data.filter(t => stringIds.includes(String(t.id)));
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
     <ProtectedRoute allowedRole={["Block-admin", "super-admin", "district-admin"]}>
      <DashboardLayout>
        <div className="max-w-[1600px] mx-auto space-y-8 p-4">
          
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
                <div className="absolute top-4 right-4 flex flex-wrap justify-end gap-1 max-w-[150px] z-20">
                    {talukas.map(t => (
                        <span key={t.id} className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-black rounded-lg shadow-sm border border-blue-200 uppercase">
                            {t.name}
                        </span>
                    ))}
                </div>
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

          {/* Detailed Performance List */}
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
             <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-900">Block-wise Detailed Analysis</h3>
                <p className="text-sm text-slate-500">Breakdown of metrics for your assigned talukas.</p>
             </div>
             <div className="p-8">
                {isLoading ? (
                  <div className="space-y-4 animate-pulse">
                     {[1,2,3].map(i => <div key={i} className="h-16 bg-slate-100 rounded-2xl" />)}
                  </div>
                ) : talukas.length > 0 ? (
                  <div className="grid gap-4">
                    {talukas.map(t => (
                      <div key={t.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors group">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 font-bold group-hover:scale-110 transition-transform">
                              {t.name.slice(0, 1)}
                           </div>
                           <div>
                              <p className="font-bold text-slate-900 uppercase tracking-tight">{t.name}</p>
                              <p className="text-xs text-slate-400">ID: {t.id}</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="text-sm font-black text-slate-900">PENDING</p>
                           <p className="text-[10px] font-bold text-slate-400 uppercase">Status</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                     <p className="text-slate-400 font-medium">No blocks assigned to display performance data.</p>
                  </div>
                )}
             </div>
          </div>

        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
