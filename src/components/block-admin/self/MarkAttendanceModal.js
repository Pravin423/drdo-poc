import React from 'react'
import { X, Navigation, Building2, Home, AlertCircle, Info } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function MarkAttendanceModal({ 
  isOpen, 
  onClose, 
  attendanceType, 
  setAttendanceType, 
  isLate, 
  lateReason, 
  setLateReason, 
  distance, 
  isSubmitting, 
  onMark 
}) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="bg-white rounded-[2.5rem] w-full max-w-4xl overflow-hidden shadow-2xl relative z-10 border border-slate-200"
        >
          <div className="flex flex-col md:flex-row h-full min-h-[550px]">
            {/* Left Panel - Selection */}
            <div className="w-full md:w-1/2 p-8 border-r border-slate-100 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Mark <span className="text-blue-600">Attendance</span></h2>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 md:hidden">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Select Location</p>
                <div className="grid gap-3">
                  <button 
                    onClick={() => setAttendanceType('office')}
                    className={`p-4 rounded-2xl border flex items-center gap-4 transition-all ${attendanceType === 'office' ? 'bg-blue-50 border-blue-200 shadow-md ring-1 ring-blue-500' : 'bg-slate-50 border-slate-100 hover:bg-slate-100'}`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${attendanceType === 'office' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-slate-400'}`}>
                      <Building2 size={24} />
                    </div>
                    <div className="text-left">
                      <p className={`font-bold ${attendanceType === 'office' ? 'text-blue-900' : 'text-slate-700'}`}>Work from Office</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Geo-fencing required</p>
                    </div>
                  </button>

                  <button 
                    onClick={() => setAttendanceType('home')}
                    className={`p-4 rounded-2xl border flex items-center gap-4 transition-all ${attendanceType === 'home' ? 'bg-indigo-50 border-indigo-200 shadow-md ring-1 ring-indigo-500' : 'bg-slate-50 border-slate-100 hover:bg-slate-100'}`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${attendanceType === 'home' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-400'}`}>
                      <Home size={24} />
                    </div>
                    <div className="text-left">
                      <p className={`font-bold ${attendanceType === 'home' ? 'text-indigo-900' : 'text-slate-700'}`}>Work from Home</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Authorized Remote</p>
                    </div>
                  </button>
                </div>
              </div>

              {isLate && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-rose-500">
                    <AlertCircle size={16} />
                    <p className="text-xs font-black uppercase tracking-widest">Marking Late (After 10:00 AM)</p>
                  </div>
                  <textarea 
                    value={lateReason}
                    onChange={(e) => setLateReason(e.target.value)}
                    placeholder="Please provide a valid reason for reporting late..."
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all resize-none h-24 font-medium"
                  />
                </div>
              )}

              <div className="pt-4 space-y-3">
                 <button 
                   onClick={onMark}
                   disabled={isSubmitting}
                   className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2"
                 >
                   {isSubmitting ? (
                     <>
                       <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                       Processing...
                     </>
                   ) : 'Complete Check-in'}
                 </button>
                 <button 
                   onClick={onClose}
                   className="w-full py-3 text-slate-400 font-bold text-sm hover:text-slate-600"
                 >
                   Cancel
                 </button>
              </div>
            </div>

            {/* Right Panel - Map/Visual */}
            <div className="hidden md:flex w-1/2 bg-slate-50 p-8 flex-col relative overflow-hidden">
              <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full transition-colors text-slate-900 z-20 border border-slate-100">
                <X size={20} />
              </button>

              {attendanceType === 'office' ? (
                <div className="h-full flex flex-col">
                  <div className="flex-1 rounded-[2rem] bg-white border border-slate-200 overflow-hidden relative shadow-inner">
                    <div className="absolute inset-0 bg-[#f8f9fa] flex items-center justify-center">
                       <div className="relative flex items-center justify-center">
                          <div className="absolute w-[250px] h-[250px] bg-blue-500/10 rounded-full animate-pulse border border-blue-500/20" />
                          <div className="absolute w-[150px] h-[150px] bg-blue-500/20 rounded-full border border-blue-500/30" />
                          <div className="relative z-10 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl ring-4 ring-white">
                             <Navigation size={24} className="text-white fill-white" />
                          </div>
                       </div>
                    </div>
                    <div className="absolute bottom-6 left-6 right-6">
                       <div className={`p-4 rounded-2xl backdrop-blur-md border ${distance > 500 ? 'bg-rose-50/90 border-rose-200' : 'bg-emerald-50/90 border-emerald-200'} shadow-lg`}>
                          <div className="flex items-center justify-between mb-2">
                             <p className={`text-[10px] font-black uppercase tracking-widest ${distance > 500 ? 'text-rose-600' : 'text-emerald-600'}`}>Geofence Status</p>
                             <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${distance > 500 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                {distance > 500 ? 'OUT OF RANGE' : 'IN RANGE'}
                             </span>
                          </div>
                          <div className="flex items-center gap-3">
                             <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${distance > 500 ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                <Navigation size={16} />
                             </div>
                             <div>
                                <p className="text-xs font-bold text-slate-800">Distance: {distance}m to Office</p>
                                <p className="text-[10px] text-slate-500 font-medium">Reporting from Panaji HQ Office</p>
                             </div>
                          </div>
                       </div>
                    </div>
                  </div>
                  <div className="mt-6 flex items-start gap-3 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                     <Info size={18} className="text-blue-500 mt-0.5" />
                     <p className="text-[10px] text-blue-700 font-medium leading-relaxed">
                       Attendance is geofenced within a 500m radius of the assigned office location.
                     </p>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-24 h-24 bg-indigo-100 rounded-[2rem] flex items-center justify-center text-indigo-600 shadow-inner">
                     <Home size={48} />
                  </div>
                  <div className="max-w-xs">
                     <h4 className="text-xl font-black text-slate-900">WFH Mode</h4>
                     <p className="text-sm text-slate-500 mt-2">Remote attendance is active. Current network location will be logged.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
