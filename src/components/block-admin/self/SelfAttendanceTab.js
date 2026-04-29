import React from 'react'
import { Calendar, UserCheck, MapPin } from 'lucide-react'

export default function SelfAttendanceTab({ onOpenCalendar, onOpenMarkModal }) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900">My Attendance Record</h3>
          <p className="text-sm text-slate-500">Track your daily presence and check-in history.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={onOpenCalendar}
            className="px-5 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
          >
            <Calendar size={18} /> View Calendar
          </button>
          <button 
            onClick={onOpenMarkModal}
            className="px-6 py-3 bg-[#3b52ab] text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95 flex items-center gap-2"
          >
            <MapPin size={18} /> Mark Attendance
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Days', value: '24', color: 'slate' },
          { label: 'Present', value: '22', color: 'emerald' },
          { label: 'Absent', value: '1', color: 'rose' },
          { label: 'On Leave', value: '1', color: 'amber' },
        ].map((stat, idx) => (
          <div key={idx} className={`p-6 rounded-2xl border ${
            stat.color === 'emerald' ? 'bg-emerald-50 border-emerald-100' : 
            stat.color === 'rose' ? 'bg-rose-50 border-rose-100' :
            stat.color === 'amber' ? 'bg-amber-50 border-amber-100' :
            'bg-slate-50 border-slate-100'
          }`}>
            <p className={`text-[10px] font-black uppercase tracking-widest ${
              stat.color === 'emerald' ? 'text-emerald-600' : 
              stat.color === 'rose' ? 'text-rose-600' :
              stat.color === 'amber' ? 'text-amber-600' :
              'text-slate-400'
            }`}>{stat.label}</p>
            <p className={`text-3xl font-black mt-2 ${
              stat.color === 'emerald' ? 'text-emerald-700' : 
              stat.color === 'rose' ? 'text-rose-700' :
              stat.color === 'amber' ? 'text-amber-700' :
              'text-slate-900'
            }`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent History */}
      <div className="bg-slate-50/50 border border-slate-100 rounded-[2rem] overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-white">
          <p className="font-bold text-slate-800">Recent Logs</p>
        </div>
        <div className="p-6 space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  {25-i}
                </div>
                <div>
                  <p className="font-bold text-slate-900">April {25-i}, 2026</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Checked in at 09:15 AM • Office</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-lg uppercase tracking-widest">Present</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
