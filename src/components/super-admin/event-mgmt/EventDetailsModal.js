import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Calendar, 
  MapPin, 
  User, 
  Users, 
  Clock, 
  Globe, 
  FileText,
  Save,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export default function EventDetailsModal({ isOpen, onClose, event }) {
  if (!event) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-7xl bg-slate-50 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="bg-white p-8 border-b border-slate-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-tech-blue-50 text-tech-blue-600 rounded-2xl border border-tech-blue-100">
                  <Calendar size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 leading-tight">{event.title || "Testing"}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-100 text-amber-700 border border-amber-200">
                      Upcoming
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-3 hover:bg-slate-100 rounded-2xl transition-all text-slate-400 hover:text-slate-600"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content - Scrollable Grid */}
            <div className="flex-1 overflow-y-auto p-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Column - Event Info (4/12) */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm h-fit">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                      <div className="w-1.5 h-6 bg-tech-blue-500 rounded-full" />
                      Event Details
                    </h3>
                    
                    <div className="space-y-6">
                      <div className="flex items-center gap-4 group">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-tech-blue-50 group-hover:border-tech-blue-100 transition-colors">
                          <FileText className="w-5 h-5 text-slate-400 group-hover:text-tech-blue-500" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type</p>
                          <p className="text-sm font-extrabold text-slate-700">{event.type || "Meeting"}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 group">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-tech-blue-50 group-hover:border-tech-blue-100 transition-colors">
                          <Globe className="w-5 h-5 text-slate-400 group-hover:text-tech-blue-500" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vertical</p>
                          <p className="text-sm font-extrabold text-slate-700">Health & Nutrition Awareness</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 group">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-tech-blue-50 group-hover:border-tech-blue-100 transition-colors">
                          <MapPin className="w-5 h-5 text-slate-400 group-hover:text-tech-blue-500" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">District</p>
                          <p className="text-sm font-extrabold text-slate-700">{event.district || "North Goa"}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 group">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-tech-blue-50 group-hover:border-tech-blue-100 transition-colors">
                          <MapPin className="w-5 h-5 text-slate-400 group-hover:text-tech-blue-500" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Taluka</p>
                          <p className="text-sm font-extrabold text-slate-700">{event.block || "Bicholim, Ona"}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 group">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-tech-blue-50 group-hover:border-tech-blue-100 transition-colors">
                          <Clock className="w-5 h-5 text-slate-400 group-hover:text-tech-blue-500" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Timeline</p>
                          <p className="text-sm font-extrabold text-slate-700">
                            {new Date(event.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} - {new Date(event.endDate || event.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <FileText size={12} /> Description
                      </p>
                      <p className="text-sm font-bold text-slate-600 leading-relaxed italic bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        "{event.description || "Use for testing"}"
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Column - Participants (8/12) */}
                <div className="lg:col-span-8 space-y-8">
                  {/* CRP Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                          <User size={16} />
                        </div>
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">CRP Participants</h3>
                        <span className="px-2 py-0.5 rounded-full bg-tech-blue-500 text-white text-[10px] font-black">0</span>
                      </div>
                    </div>
                    <div className="bg-white rounded-[2rem] border border-slate-200 p-10 text-center shadow-sm">
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
                        <Users className="w-8 h-8 text-slate-300" />
                      </div>
                      <p className="text-sm font-bold text-slate-400 italic">No CRP participant found.</p>
                    </div>
                  </div>

                  {/* SHG Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                          <Users size={16} />
                        </div>
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">SHG Participants</h3>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black">2</span>
                      </div>
                      <button className="flex items-center gap-2 px-5 py-2 text-[10px] font-black text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20 active:scale-95 uppercase tracking-widest">
                        <Save className="w-3 h-3" />
                        Save Attendance
                      </button>
                    </div>
                    
                    <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50/50 border-b border-slate-100">
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest w-16">#</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">SHG Name</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Attendance</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          <tr className="group hover:bg-slate-50/50 transition-colors">
                            <td className="px-8 py-6 text-xs font-bold text-slate-400">1</td>
                            <td className="px-8 py-6">
                              <p className="text-sm font-black text-slate-700 group-hover:text-tech-blue-600 transition-colors">SHRI NARI SHAKTI SHGS</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Registration ID: #SHG-2024-001</p>
                            </td>
                            <td className="px-8 py-6">
                              <span className="px-3 py-1.5 rounded-xl text-[9px] font-black bg-emerald-100 text-emerald-700 uppercase tracking-widest border border-emerald-200">SHG</span>
                            </td>
                            <td className="px-8 py-6 text-center">
                              <select className="bg-white border-2 border-slate-100 rounded-xl px-4 py-2 text-[10px] font-black text-slate-700 outline-none focus:border-tech-blue-500 focus:ring-4 focus:ring-tech-blue-500/5 transition-all shadow-sm">
                                <option>Pending</option>
                                <option>Present</option>
                                <option>Absent</option>
                              </select>
                            </td>
                          </tr>
                          <tr className="group hover:bg-slate-50/50 transition-colors">
                            <td className="px-8 py-6 text-xs font-bold text-slate-400">2</td>
                            <td className="px-8 py-6">
                              <p className="text-sm font-black text-slate-700 group-hover:text-tech-blue-600 transition-colors">Avinath SHG</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Registration ID: #SHG-2024-042</p>
                            </td>
                            <td className="px-8 py-6">
                              <span className="px-3 py-1.5 rounded-xl text-[9px] font-black bg-emerald-100 text-emerald-700 uppercase tracking-widest border border-emerald-200">SHG</span>
                            </td>
                            <td className="px-8 py-6 text-center">
                              <select className="bg-white border-2 border-slate-100 rounded-xl px-4 py-2 text-[10px] font-black text-slate-700 outline-none focus:border-tech-blue-500 focus:ring-4 focus:ring-tech-blue-500/5 transition-all shadow-sm">
                                <option>Pending</option>
                                <option>Present</option>
                                <option>Absent</option>
                              </select>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
