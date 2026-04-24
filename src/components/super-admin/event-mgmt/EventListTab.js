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
        return { label: "Completed Events", color: "slate", icon: Users };
      default:
        return { label: "Events", color: "blue", icon: Calendar };
    }
  };

  const config = getStatusConfig();

  const getEventTypeStyle = (type) => {
    if (!type) return "bg-slate-50 text-slate-700 border-slate-100";
    const styles = {
      training: "bg-blue-50 text-blue-700 border-blue-100",
      workshop: "bg-purple-50 text-purple-700 border-purple-100",
      seminar: "bg-teal-50 text-teal-700 border-teal-100",
      meeting: "bg-orange-50 text-orange-700 border-orange-100",
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6 z-10">
                <div className="relative">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenuId(activeMenuId === event.id ? null : event.id);
                    }}
                    className={`p-2.5 rounded-xl transition-all ${activeMenuId === event.id ? 'bg-[#1a2e7a] text-white shadow-lg' : 'hover:bg-slate-100 text-slate-400'}`}
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>

                  <AnimatePresence>
                    {activeMenuId === event.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -10 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-20"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="p-1.5">
                          {event.status !== 'completed' && (
                            <button
                              onClick={() => {
                                setActiveMenuId(null);
                                onCloseEvent?.(event);
                              }}
                              className="w-full flex items-center gap-3 px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-700 hover:bg-slate-50 rounded-xl transition-colors group"
                            >
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
                              Close Event
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setActiveMenuId(null);
                              onDeleteEvent?.(event);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-xs font-black uppercase tracking-widest text-rose-600 hover:bg-rose-50 rounded-xl transition-colors group"
                          >
                            <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            Delete Event
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="flex flex-col h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getEventTypeStyle(event.type)}`}>
                    {event.type}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <Calendar className="w-3 h-3" />
                    {new Date(event.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>

                <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-[#1a2e7a] transition-colors leading-tight">
                  {event.title}
                </h3>

                <div className="grid grid-cols-2 gap-6 mb-8 mt-auto">
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <MapPin className="w-3 h-3" /> Venue
                    </p>
                    <p className="text-sm font-extrabold text-slate-700 line-clamp-1">{event.venue}</p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <User className="w-3 h-3" /> Facilitator
                    </p>
                    <p className="text-sm font-extrabold text-slate-700 line-clamp-1">{event.facilitator}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map((i) => (
                      <img
                        key={i}
                        src={`https://i.pravatar.cc/150?u=${event.id + i}`}
                        alt="Participant"
                        className="w-10 h-10 rounded-2xl border-4 border-white shadow-sm object-cover"
                      />
                    ))}
                    <div className="w-10 h-10 rounded-2xl bg-slate-100 border-4 border-white shadow-sm flex items-center justify-center text-[10px] font-black text-slate-500">
                      +12
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => onEventAction(event)}
                    className="flex items-center gap-2 px-6 py-3 text-xs font-black uppercase tracking-widest text-[#1a2e7a] bg-[#1a2e7a]/5 rounded-2xl hover:bg-[#1a2e7a] hover:text-white transition-all group/btn"
                  >
                    {status === "ongoing" ? "Take Attendance" : status === "completed" ? "View Report" : "View Details"}
                    <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </button>
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
