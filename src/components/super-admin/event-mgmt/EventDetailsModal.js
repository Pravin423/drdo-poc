import React, { useState } from "react";
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
  Folder,
  Plus,
  Download,
  Image,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  LayoutDashboard,
  Link,
  ChevronDown,
  Navigation,
  ExternalLink,
  Search
} from "lucide-react";

// Reuse existing components
import EventAttendanceTab from "./EventAttendanceTab";
import EventAnalyticsTab from "./EventAnalyticsTab";

export default function EventDetailsModal({ isOpen, onClose, event }) {
  const [activeTab, setActiveTab] = useState("details");

  if (!event) return null;

  const tabs = [
    { id: "details", label: "Details", icon: LayoutDashboard },
    { id: "documents", label: "Docs & Images", icon: Folder },
  ];

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
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-7xl bg-slate-50 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-white/20"
          >
            {/* Premium Header */}
            <div className="bg-white px-8 py-6 border-b border-slate-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-tech-blue-50 text-tech-blue-600 rounded-2xl border border-tech-blue-100 shadow-sm">
                  <Calendar size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 leading-tight">{event.title || "Testing"}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-400 text-slate-900 shadow-sm">
                      Upcoming
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">• {event.type || "Meeting"}</span>
                  </div>
                </div>
              </div>

              {/* Internal Tab Navigation - Updated to 2 Tabs */}
              <div className="hidden md:flex p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/50">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300
                      ${activeTab === tab.id
                        ? "bg-white text-[#1a2e7a] shadow-md ring-1 ring-slate-100 scale-105"
                        : "text-slate-400 hover:text-slate-600 hover:bg-white/50"
                      }`}
                  >
                    <tab.icon size={14} />
                    {tab.label}
                  </button>
                ))}
              </div>

              <button 
                onClick={onClose}
                className="p-3 hover:bg-slate-100 rounded-2xl transition-all text-slate-400 hover:text-slate-600"
              >
                <X size={24} />
              </button>
            </div>

            {/* Mobile Tab Navigation */}
            <div className="md:hidden flex p-2 bg-white border-b border-slate-100 overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap
                    ${activeTab === tab.id ? "bg-tech-blue-50 text-[#1a2e7a]" : "text-slate-400"}`}
                >
                  <tab.icon size={14} />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content Area - Optimized for scrolling */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar will-change-scroll translate-z-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  {activeTab === "details" && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                      
                      {/* Left Sidebar - Event Info (Compact) */}
                      <div className="lg:col-span-4 space-y-4">
                        <div className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm h-fit">
                          <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                            <div className="w-1.5 h-3.5 bg-tech-blue-500 rounded-full" />
                            Event Info
                          </h3>
                          
                          <div className="space-y-3.5">
                            {[
                              { label: "Type", value: event.type || "Meeting", icon: FileText, color: "text-orange-400" },
                              { label: "Vertical", value: "Health & Nutrition Awareness", icon: Link, color: "text-purple-400" },
                              { label: "Location", value: "Lat: 19.13584, Lng: 72.83122", icon: Navigation, color: "text-rose-500" },
                              { label: "District", value: event.district || "North Goa", icon: Globe, color: "text-blue-500" },
                              { label: "Taluka", value: event.block || "Bicholim, Ona", icon: MapPin, color: "text-emerald-500" },
                              { label: "Start", value: "18 Apr 2026, 04:00 PM", icon: Clock, color: "text-slate-400" },
                              { label: "End", value: "19 Apr 2026, 04:00 PM", icon: Clock, color: "text-slate-400" },
                              { label: "Lead 1", value: "N/A", icon: User, color: "text-tech-blue-600" },
                              { label: "Lead 2", value: "N/A", icon: User, color: "text-tech-blue-600" },
                            ].map((item, idx) => (
                              <div key={idx} className="flex items-center gap-3.5 group">
                                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-white transition-all shrink-0">
                                  <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{item.label}</p>
                                  <p className="text-[11px] font-extrabold text-slate-700 truncate leading-none">{item.value}</p>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="mt-6 pt-6 border-t border-slate-100">
                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-2">Description</p>
                            <p className="text-[10.5px] font-bold text-slate-600 leading-relaxed italic bg-slate-50/50 p-3.5 rounded-2xl border border-slate-100/50">
                              "{event.description || "Use for testing"}"
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Right Main Content - Participants Table */}
                      <div className="lg:col-span-8 space-y-6">
                        
                        {/* Summary Stats Row */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">CRP Participants</p>
                            <p className="text-2xl font-black text-slate-900">0</p>
                          </div>
                          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">SHG Participants</p>
                            <p className="text-2xl font-black text-emerald-600">2</p>
                          </div>
                        </div>

                        {/* CRP Participants Table */}
                        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                          <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center gap-3">
                            <User size={16} className="text-slate-700" />
                            <h3 className="text-xs font-bold text-slate-900">CRP Participants</h3>
                          </div>
                          <div className="p-6">
                            <p className="text-xs font-medium text-slate-500">No CRP participant found.</p>
                          </div>
                        </div>

                        {/* SHG Participants Table */}
                        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                          <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center gap-3">
                            <Users size={16} className="text-slate-700" />
                            <h3 className="text-xs font-bold text-slate-900">SHG Participants</h3>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="bg-slate-50/50">
                                  <th className="px-6 py-3 text-[10px] font-bold text-slate-900 w-12">#</th>
                                  <th className="px-6 py-3 text-[10px] font-bold text-slate-900">SHG Name</th>
                                  <th className="px-6 py-3 text-[10px] font-bold text-slate-900">Type</th>
                                  <th className="px-6 py-3 text-[10px] font-bold text-slate-900">Attendance</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {[
                                  { id: 1, name: "SHRI NARI SHAKTI SHGS", type: "SHG" },
                                  { id: 2, name: "Avinath SHG", type: "SHG" }
                                ].map((shg, idx) => (
                                  <tr key={shg.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-3 text-xs text-slate-600">{idx + 1}</td>
                                    <td className="px-6 py-3 text-xs font-bold text-slate-700">{shg.name}</td>
                                    <td className="px-6 py-3">
                                      <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[9px] font-black uppercase tracking-tight">SHG</span>
                                    </td>
                                    <td className="px-6 py-3">
                                      <div className="relative inline-block w-28">
                                        <select className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-[11px] font-bold text-slate-700 outline-none appearance-none focus:border-tech-blue-500">
                                          <option>Pending</option>
                                          <option>Present</option>
                                          <option>Absent</option>
                                        </select>
                                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          <div className="p-4 border-t border-slate-100 bg-white">
                            <button className="px-4 py-2 text-xs font-black text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center gap-2">
                              <Save size={14} />
                              Save Attendance
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                  {activeTab === "documents" && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      {/* Upload Section */}
                      <div className="bg-white rounded-[2rem] border-2 border-dashed border-slate-200 p-12 text-center group hover:border-tech-blue-400 transition-all cursor-pointer">
                        <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-tech-blue-50 transition-all">
                          <Plus className="w-8 h-8 text-slate-400 group-hover:text-tech-blue-500" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">Upload Files</h3>
                        <p className="text-sm font-bold text-slate-400 mt-2 uppercase tracking-widest">Drop images or documents here</p>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Photo Gallery */}
                        <div className="space-y-6">
                          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 ml-2">
                             <Image size={14} /> Event Photos
                          </h4>
                          <div className="grid grid-cols-2 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                              <div key={i} className="group relative aspect-video rounded-3xl overflow-hidden bg-slate-200 border border-slate-200 shadow-sm">
                                <img src={`https://picsum.photos/seed/${i + 100}/800/450`} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                   <p className="text-[10px] font-black text-white uppercase tracking-widest">event_photo_{i}.jpg</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Document List */}
                        <div className="space-y-6">
                          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 ml-2">
                             <FileText size={14} /> Documents
                          </h4>
                          <div className="space-y-4">
                            {[
                              { name: "attendance_report.pdf", size: "1.2 MB", type: "PDF" },
                              { name: "event_budget_final.xlsx", size: "850 KB", type: "Excel" },
                              { name: "venue_contract.pdf", size: "2.4 MB", type: "PDF" }
                            ].map((doc, i) => (
                              <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-tech-blue-400 transition-all">
                                <div className="flex items-center gap-4">
                                   <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-tech-blue-50">
                                      <FileText className="w-5 h-5 text-slate-400 group-hover:text-tech-blue-500" />
                                   </div>
                                   <div>
                                      <p className="text-sm font-black text-slate-900">{doc.name}</p>
                                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{doc.size} • {doc.type}</p>
                                   </div>
                                </div>
                                <button className="p-3 hover:bg-slate-50 rounded-xl transition-all text-slate-400 hover:text-tech-blue-600">
                                   <Download size={18} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer with subtle info */}
            <div className="px-8 py-4 bg-white border-t border-slate-100 flex items-center justify-between shrink-0">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last updated: 24 Apr 2026 • 11:38 AM</p>
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Live Sync Active</span>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
