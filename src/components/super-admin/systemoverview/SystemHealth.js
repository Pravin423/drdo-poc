import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, MapPin, CheckCircle2, Clock, Inbox, ChevronRight } from "lucide-react";

export default function SystemHealth() {
  const [queries, setQueries] = useState([
    {
      id: "Q-1042",
      sender: "Ramesh Naik",
      role: "CRP",
      location: "Salcete",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ramesh",
      subject: "Unable to sync offline data",
      message: "The application is throwing a timeout error when I try to upload photos.",
      priority: "High",
      time: "10m ago",
      status: "unread"
    },
    {
      id: "Q-1041",
      sender: "Priya Desai",
      role: "Block Admin",
      location: "Bardez",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
      subject: "Password reset for 3 CRPs",
      message: "Newly onboarded CRPs in Mapusa are unable to log into their accounts.",
      priority: "Medium",
      time: "1h ago",
      status: "unread"
    },
    {
      id: "Q-1040",
      sender: "Santosh Kumar",
      role: "CRP",
      location: "Tiswadi",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Santosh",
      subject: "Village Mapping correction",
      message: "My profile shows Corlim, but I was transferred to Old Goa last week.",
      priority: "Low",
      time: "3h ago",
      status: "read"
    }
  ]);

  const [activeTab, setActiveTab] = useState("all");

  const getPriorityColor = (priority) => {
    switch(priority) {
      case "High": return "bg-rose-500";
      case "Medium": return "bg-amber-500";
      case "Low": return "bg-emerald-500";
      default: return "bg-slate-300";
    }
  };

  const markAsRead = (id) => {
    setQueries(queries.map(q => q.id === id ? { ...q, status: "read" } : q));
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="rounded-3xl border border-slate-200 bg-white shadow-sm flex flex-col h-full min-h-[450px] overflow-hidden"
    >
      {/* Clean Dashboard Header */}
      <div className="p-6 border-b border-slate-100 flex flex-col gap-4 bg-white shrink-0">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              Field Support Desk
              {queries.filter(q => q.status === "unread").length > 0 && (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                </span>
              )}
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Incoming queries from your field staff
            </p>
          </div>
        </div>

        {/* Seamless Tabs */}
        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100">
          <button 
            onClick={() => setActiveTab("all")}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === "all" ? "bg-white text-slate-800 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-700"}`}
          >
            All Tickets
          </button>
          <button 
            onClick={() => setActiveTab("unread")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === "unread" ? "bg-white text-slate-800 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-700"}`}
          >
            Pending Action
            {queries.filter(q => q.status === "unread").length > 0 && (
              <span className={`px-1.5 py-0.5 rounded-full text-[9px] ${activeTab === "unread" ? "bg-indigo-100 text-indigo-700" : "bg-slate-200 text-slate-600"}`}>
                {queries.filter(q => q.status === "unread").length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Clean List View */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {queries.filter(q => activeTab === "all" || q.status === activeTab).length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center text-slate-500">
            <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mb-3">
              <CheckCircle2 size={24} className="text-emerald-500" />
            </div>
            <p className="text-sm font-bold text-slate-700">Inbox Zero</p>
            <p className="text-xs mt-1">No pending queries right now.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            <AnimatePresence>
              {queries.filter(q => activeTab === "all" || q.status === activeTab).map((query, idx) => (
                <motion.div
                  key={query.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`p-4 transition-colors hover:bg-slate-50/80 group relative ${query.status === "unread" ? "bg-white" : "bg-slate-50/30"}`}
                >
                  {/* Subtle Priority Left Border for unread */}
                  {query.status === "unread" && (
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${getPriorityColor(query.priority)} opacity-80`} />
                  )}

                  <div className="flex items-start gap-3">
                    <img src={query.avatar} alt={query.sender} className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 shrink-0" />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-bold truncate ${query.status === "unread" ? "text-slate-900" : "text-slate-600"}`}>
                            {query.sender}
                          </span>
                        </div>
                        <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1 shrink-0">
                          <Clock size={10} /> {query.time}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        <span>{query.role}</span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5"><MapPin size={9}/> {query.location}</span>
                      </div>

                      <h4 className={`text-sm font-bold mb-1 line-clamp-1 ${query.status === "unread" ? "text-slate-800" : "text-slate-600"}`}>
                        {query.subject}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {query.message}
                      </p>

                      {/* Quick Actions (Appear on hover or if unread) */}
                      <div className={`mt-3 flex items-center gap-2 transition-opacity duration-200 ${query.status === "unread" ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors">
                          <MessageSquare size={12} /> Reply
                        </button>
                        {query.status === "unread" && (
                          <button 
                            onClick={() => markAsRead(query.id)}
                            className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-bold text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                          >
                            <CheckCircle2 size={12} /> Resolve
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50 shrink-0">
        <button className="w-full flex items-center justify-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors">
          <Inbox size={14} /> Open Support Inbox <ChevronRight size={14} />
        </button>
      </div>
    </motion.section>
  );
}
