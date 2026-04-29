import React from 'react'
import { Calendar, Briefcase, Heart, Palmtree, ChevronRight } from 'lucide-react'

export default function SelfLeaveTab({ onOpenApplyModal }) {
  const leaveBalances = [
    { type: 'Casual Leave', available: 8, total: 12, color: 'blue', icon: Briefcase },
    { type: 'Medical Leave', available: 5, total: 10, color: 'rose', icon: Heart },
    { type: 'Earned Leave', available: 15, total: 30, color: 'emerald', icon: Palmtree },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Leave Management</h3>
          <p className="text-sm text-slate-500">Track your balances and apply for new leaves.</p>
        </div>
        <button 
          onClick={onOpenApplyModal}
          className="px-6 py-3 bg-[#3b52ab] text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95 flex items-center gap-2"
        >
          <Calendar size={18} /> New Leave Application
        </button>
      </div>

      {/* Leave Balance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {leaveBalances.map((leave, idx) => {
          const Icon = leave.icon;
          const percentage = (leave.available / leave.total) * 100;
          return (
            <div key={idx} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-slate-200 transition-all group">
              <div className="flex items-center justify-between mb-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  leave.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                  leave.color === 'rose' ? 'bg-rose-50 text-rose-600' :
                  'bg-emerald-50 text-emerald-600'
                } group-hover:scale-110 transition-transform`}>
                  <Icon size={24} />
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Available</p>
                  <p className="text-2xl font-black text-slate-900">{leave.available}/{leave.total}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                  <span>Usage Progress</span>
                  <span>{Math.round(percentage)}% Left</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${
                      leave.color === 'blue' ? 'bg-blue-500' :
                      leave.color === 'rose' ? 'bg-rose-500' :
                      'bg-emerald-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <p className="text-xs font-bold text-slate-800 pt-2">{leave.type}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Leave History List */}
      <div className="bg-slate-50/50 border border-slate-100 rounded-[2rem] overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 bg-white flex items-center justify-between">
          <p className="font-bold text-slate-800 text-lg">Application History</p>
          <span className="text-xs font-bold text-blue-600 cursor-pointer hover:underline">View All History</span>
        </div>
        <div className="p-8 space-y-4">
          {[
            { type: 'Casual Leave', range: '12 May 2026 - 13 May 2026', status: 'Pending', color: 'amber', days: 2 },
            { type: 'Medical Leave', range: '05 Apr 2026 - 06 Apr 2026', status: 'Approved', color: 'emerald', days: 2 },
          ].map((leave, i) => (
            <div key={i} className="p-6 bg-white rounded-2xl border border-slate-100 flex items-center justify-between group hover:border-blue-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors">
                  <Calendar size={24} />
                </div>
                <div>
                  <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{leave.type}</p>
                  <p className="text-xs text-slate-500 font-medium">{leave.range} • <span className="text-slate-900 font-bold">{leave.days} Days</span></p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-4 py-1.5 text-[10px] font-black rounded-lg uppercase tracking-widest border ${
                  leave.color === 'emerald' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                }`}>
                  {leave.status}
                </span>
                <ChevronRight size={18} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
