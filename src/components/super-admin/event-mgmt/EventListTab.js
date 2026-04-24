import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  MapPin, 
  User, 
  Users, 
  Clock, 
  ChevronRight,
  Search,
  MoreVertical,
  Filter,
  CheckCircle2,
  Trash2,
  AlertTriangle
} from "lucide-react";

export default function EventListTab({ status, events, onEventAction, isViewOnly, onDeleteEvent, onCloseEvent }) {
  const [activeMenuId, setActiveMenuId] = React.useState(null);

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClick = () => setActiveMenuId(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);
  const getStatusConfig = () => {
    switch (status) {
      case "upcoming":
        return { label: "Upcoming Events", color: "blue", icon: Calendar };
      case "ongoing":
        return { label: "Ongoing Events", color: "emerald", icon: Clock };
      case "completed":
        return { label: "Completed Events", color: "emerald", icon: Users };
      case "closed":
        return { label: "Closed Events", color: "slate", icon: AlertTriangle };
      default:
        return { label: "Events", color: "blue", icon: Calendar };
    }
  };

  const config = getStatusConfig();

  const getEventTypeStyle = (type) => {
    if (!type) return "bg-slate-50 text-slate-700 border-slate-100";
    const styles = {
      training: "bg-blue-50/50 text-blue-700 border-blue-100 shadow-sm shadow-blue-500/10",
      workshop: "bg-purple-50/50 text-purple-700 border-purple-100 shadow-sm shadow-purple-500/10",
      seminar: "bg-teal-50/50 text-teal-700 border-teal-100 shadow-sm shadow-teal-500/10",
      meeting: "bg-orange-50/50 text-orange-700 border-orange-100 shadow-sm shadow-orange-500/10",
      camp: "bg-emerald-50/50 text-emerald-700 border-emerald-100 shadow-sm shadow-emerald-500/10",
    };
    return styles[type.toLowerCase()] || "bg-slate-50 text-slate-700 border-slate-100";
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search events by title, venue or facilitator..."
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-tech-blue-500/10 focus:border-tech-blue-500 transition-all"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex items-center gap-2 px-5 py-3 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all flex-1 md:flex-none justify-center">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      {/* Events List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {events.length > 0 ? (
          events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -8, shadow: "0 25px 50px -12px rgba(0,0,0,0.08)" }}
              className="group relative bg-white rounded-[3rem] p-4 pr-8 border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)] hover:border-tech-blue-100 transition-all duration-500"
            >
              <div className="flex gap-8 h-full">
                {/* Left: Styled Date Box */}
                <div className="w-24 shrink-0 flex flex-col items-center justify-center bg-slate-50 group-hover:bg-[#1a2e7a]/5 rounded-[2.2rem] transition-colors duration-500 py-6 border border-slate-100">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">
                    {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                  </span>
                  <span className="text-3xl font-black text-slate-900 group-hover:text-[#1a2e7a] transition-colors">
                    {new Date(event.date).toLocaleDateString('en-US', { day: '2-digit' })}
                  </span>
                  <div className="w-6 h-1 bg-[#1a2e7a]/10 rounded-full mt-3 group-hover:bg-[#1a2e7a]/40 transition-colors" />
                </div>

                {/* Right: Content */}
                <div className="flex-1 py-4 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border ${getEventTypeStyle(event.type)}`}>
                      {event.type}
                    </div>
                    
                    <div className="relative">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(activeMenuId === event.id ? null : event.id);
                        }}
                        className={`p-2 rounded-xl transition-all ${activeMenuId === event.id ? 'bg-[#1a2e7a] text-white' : 'text-slate-300 hover:text-slate-600 hover:bg-slate-50'}`}
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>

                      <AnimatePresence>
                        {activeMenuId === event.id && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute right-0 mt-2 w-52 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-20 p-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {event.status !== 'completed' && event.status !== 'closed' && (
                              <button
                                onClick={() => { setActiveMenuId(null); onCloseEvent?.(event); }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-2xl transition-all"
                              >
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                Close Event
                              </button>
                            )}
                            <button
                              onClick={() => { setActiveMenuId(null); onDeleteEvent?.(event); }}
                              className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-rose-600 hover:bg-rose-50 rounded-2xl transition-all"
                            >
                              <Trash2 className="w-4 h-4 text-rose-500" />
                              Delete Event
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <h3 className="text-xl font-black text-slate-900 group-hover:text-[#1a2e7a] transition-colors leading-tight mb-4 line-clamp-1">
                    {event.title}
                  </h3>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-6 text-[11px] font-bold text-slate-500">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-lg bg-slate-50 flex items-center justify-center">
                          <MapPin className="w-3 h-3 text-slate-400" />
                        </div>
                        {event.venue}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-lg bg-slate-50 flex items-center justify-center">
                          <User className="w-3 h-3 text-slate-400" />
                        </div>
                        {event.facilitator}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-tech-blue-600 bg-tech-blue-50/50 w-fit px-3 py-1.5 rounded-xl border border-tech-blue-100">
                      <Clock className="w-3.5 h-3.5" />
                      <span>
                        {new Date(event.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        {event.endDate && event.endDate !== event.date && ` — ${new Date(event.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`}
                        <span className="mx-2 opacity-30">|</span>
                        {event.startTime}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex-1 pr-4">
                      <p className="text-[11px] font-medium text-slate-400 italic line-clamp-2 leading-relaxed">
                        {event.description || "No description provided for this event."}
                      </p>
                    </div>

                    <button 
                      onClick={() => onEventAction(event)}
                      className="px-6 py-3 bg-[#1a2e7a] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_10px_20px_-5px_rgba(26,46,122,0.3)] hover:shadow-[0_15px_30px_-5px_rgba(26,46,122,0.4)] transition-all active:scale-95 flex items-center gap-2 group/btn"
                    >
                      {status === "ongoing" ? "Attendance" : (status === "completed" || status === "closed") ? "Report" : "Details"}
                      <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="lg:col-span-2 py-24 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <config.icon className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No {config.label.toLowerCase()} found</h3>
            <p className="text-slate-500 font-medium max-w-sm mx-auto">
              There are currently no events matching this status. 
              {status === "upcoming" && " Try creating a new event to get started."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
