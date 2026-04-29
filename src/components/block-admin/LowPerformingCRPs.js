import React, { useState, useEffect } from 'react'
import SummaryCard from '../common/SummaryCard'
import { Users, AlertTriangle, CheckCircle, ChevronRight, Search } from 'lucide-react'
import { motion } from 'framer-motion'

export default function LowPerformingCRPs({ user }) {
  const [crpPerformance, setCrpPerformance] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [threshold, setThreshold] = useState(5); // Default threshold for "low performing"
  const [searchTerm, setSearchTerm] = useState("");

  const districtId = user?.district_id;
  const assignedTalukaIds = user?.taluka_id;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

        // 1. Fetch CRP-SHG mappings
        const mappingRes = await fetch("/api/crp-shg-list", { headers });
        const mappingData = await mappingRes.json();
        const mappings = Array.isArray(mappingData.data) ? mappingData.data : [];

        // 2. Fetch all employees to get the full list of CRPs
        const empRes = await fetch("/api/employees", { headers });
        const empData = await empRes.json();
        const allEmployees = Array.isArray(empData.data) ? empData.data : [];

        // 3. Parse assigned taluka IDs
        let targetTalukaIds = [];
        if (assignedTalukaIds) {
          if (typeof assignedTalukaIds === 'string' && assignedTalukaIds.startsWith('[')) {
            try {
              targetTalukaIds = JSON.parse(assignedTalukaIds).map(String);
            } catch (e) {
              targetTalukaIds = [String(assignedTalukaIds)];
            }
          } else if (Array.isArray(assignedTalukaIds)) {
            targetTalukaIds = assignedTalukaIds.map(String);
          } else {
            targetTalukaIds = [String(assignedTalukaIds)];
          }
        }

        // 4. Get list of CRPs (prioritize crp_list from mapping API if available)
        const crpSource = (Array.isArray(mappingData.crp_list) && mappingData.crp_list.length > 0) 
          ? mappingData.crp_list 
          : allEmployees.filter(emp => 
              String(emp.role_name || emp.role || "").toLowerCase() === 'crp'
            );

        // 5. Filter for this block admin's jurisdiction
        const blockCRPs = targetTalukaIds.length > 0 
          ? crpSource.filter(emp => targetTalukaIds.includes(String(emp.taluka_id || emp.block_id || emp.talukaId || "")))
          : crpSource;

        // 6. Calculate performance and SORT (lowest SHG count first)
        const performance = blockCRPs.map(crp => {
          const crpMappings = mappings.filter(m => String(m.user_id || m.crpuser) === String(crp.id || crp.user_id));
          return {
            id: crp.id || crp.user_id,
            name: crp.fullname || crp.name || "Unknown",
            email: crp.email,
            mobile: crp.mobile,
            taluka: crp.taluka_name || crp.taluka || "N/A",
            shgCount: crpMappings.length,
          };
        }).sort((a, b) => a.shgCount - b.shgCount); // Sort by performance (lowest first)

        setCrpPerformance(performance);
      } catch (error) {
        console.error("Error identifying low-performing CRPs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [districtId, assignedTalukaIds, threshold]);

  const lowPerforming = crpPerformance.filter(p => p.shgCount < threshold);
  const optimalPerforming = crpPerformance.filter(p => p.shgCount >= threshold);

  const filteredList = crpPerformance.filter(p => 
    (p.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.mobile || "").includes(searchTerm)
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Identify Low-Performing{" "}
            <span className="bg-gradient-to-b from-[#f43f5e] to-[#991b1b] bg-clip-text text-transparent">
              CRPs
            </span>
          </h1>
          <p className="text-slate-500 font-medium">
            Monitoring SHG mapping targets and coverage efficiency for your blocks.
          </p>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase px-2">Threshold:</span>
          {[3, 5, 10].map(v => (
            <button
              key={v}
              onClick={() => setThreshold(v)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${threshold === v ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              {v} SHGs
            </button>
          ))}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid gap-6 md:grid-cols-3">
        <SummaryCard 
          title="Total CRPs"
          value={crpPerformance.length}
          icon={Users}
          variant="blue"
          delay={0.1}
        />
        <SummaryCard 
          title="Low Performing"
          value={lowPerforming.length}
          icon={AlertTriangle}
          variant="rose"
          delay={0.2}
        />
        <SummaryCard 
          title="Meeting Target"
          value={optimalPerforming.length}
          icon={CheckCircle}
          variant="emerald"
          delay={0.3}
        />
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Performance Detailed List</h3>
            <p className="text-sm text-slate-500">Currently flagging CRPs with fewer than {threshold} SHGs.</p>
          </div>
          
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or mobile..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all w-full md:w-80 font-medium"
            />
          </div>
        </div>

        <div className="p-8">
          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              {[1,2,3,4,5].map(i => <div key={i} className="h-20 bg-slate-100 rounded-2xl" />)}
            </div>
          ) : filteredList.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-separate border-spacing-y-3">
                <thead>
                  <tr className="text-left text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">
                    <th className="pb-2 pl-6">CRP Details</th>
                    <th className="pb-2">Taluka</th>
                    <th className="pb-2 text-center">SHGs Count</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2 pr-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredList.map((crp) => (
                    <motion.tr 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      key={crp.id} 
                      className="group bg-slate-50 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 rounded-2xl border border-transparent hover:border-slate-100"
                    >
                      <td className="py-4 pl-6 rounded-l-2xl">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${crp.shgCount < threshold ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'}`}>
                            {crp.name.slice(0, 1)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{crp.name}</p>
                            <p className="text-xs text-slate-400">{crp.mobile || "No mobile"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 font-bold text-slate-600 text-sm uppercase tracking-tight">
                        {crp.taluka}
                      </td>
                      <td className="py-4">
                        <div className="flex flex-col items-center">
                          <span className={`text-lg font-black ${crp.shgCount < threshold ? 'text-rose-600' : 'text-slate-900'}`}>
                            {crp.shgCount}
                          </span>
                          <div className="w-16 h-1.5 bg-slate-200 rounded-full mt-1 overflow-hidden">
                             <div 
                               className={`h-full transition-all duration-1000 ${crp.shgCount < threshold ? 'bg-rose-500' : 'bg-emerald-500'}`}
                               style={{ width: `${Math.min((crp.shgCount / threshold) * 100, 100)}%` }}
                             />
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-tighter ${
                          crp.shgCount < threshold 
                            ? 'bg-rose-100 text-rose-700 border border-rose-200' 
                            : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                        }`}>
                          {crp.shgCount < threshold ? "Action Required" : "Satisfactory"}
                        </span>
                      </td>
                      <td className="py-4 pr-6 text-right rounded-r-2xl">
                        <button className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-blue-600 transition-all group-hover:translate-x-1">
                          <ChevronRight size={20} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Search size={24} className="text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No CRPs found</h3>
              <p className="text-slate-500 max-w-xs mx-auto mt-2">Try adjusting your search terms or threshold to see results.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
