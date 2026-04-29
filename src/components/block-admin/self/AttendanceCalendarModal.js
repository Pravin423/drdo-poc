import React from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AttendanceCalendarModal({ isOpen, onClose, currentMonthDays }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl relative z-10 border border-slate-200"
        >
          <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-900">Attendance <span className="text-blue-600">Calendar</span></h2>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-900">
                <X size={20} />
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-widest">
              <span>April 2026</span>
              <div className="flex gap-2">
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Present</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-rose-500" /> Absent</div>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                <div key={d} className="h-8 flex items-center justify-center text-[10px] font-black text-slate-300">{d}</div>
              ))}
              {currentMonthDays.map(item => (
                <div 
                  key={item.day}
                  className={`h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all shadow-sm ${
                    item.status === 'present' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                  } hover:scale-110 cursor-pointer`}
                >
                  {item.day}
                </div>
              ))}
            </div>

            <button 
              onClick={onClose}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-colors"
            >
              Close View
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
