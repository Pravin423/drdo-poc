import React from "react";
import { motion } from "framer-motion";
import { Calendar, Users, Clock, Award, TrendingUp } from "lucide-react";

export default function EventOverviewStats({ stats }) {
  const statCards = [
    {
      label: "Total Events",
      value: stats.totalEvents.toLocaleString(),
      delta: "+3 this month",
      isPositive: true,
      color: "blue",
      icon: Calendar,
    },
    {
      label: "Total Participants",
      value: stats.totalParticipants.toLocaleString(),
      delta: "+12%",
      isPositive: true,
      color: "emerald",
      icon: Users,
    },
    {
      label: "Upcoming Events",
      value: stats.upcomingEvents.toString(),
      subValue: "Next 30 days",
      color: "amber",
      icon: Clock,
    },
    {
      label: "Certificates",
      value: stats.certificatesIssued.toLocaleString(),
      delta: "89% rate",
      isPositive: true,
      color: "indigo",
      icon: Award,
    },
  ];

  const colorMap = {
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
    amber: "text-amber-600 bg-amber-50 border-amber-100",
    indigo: "text-indigo-600 bg-indigo-50 border-indigo-100",
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((card, index) => (
        <motion.section
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, ease: "easeOut" }}
          whileHover={{ y: -4 }}
          className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-slate-50/50 opacity-0 group-hover:opacity-100 transition-opacity" />

          <div className="flex justify-between items-start relative z-10">
            <div className={`p-3 rounded-2xl ${colorMap[card.color]} border transition-transform duration-300 group-hover:scale-110`}>
              <card.icon size={22} />
            </div>

            {card.delta && (
              <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${card.isPositive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                }`}>
                {card.isPositive && <TrendingUp size={12} />}
                {card.delta}
              </div>
            )}
          </div>

          <div className="mt-6 relative z-10">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
              {card.label}
            </p>
            <div className="flex items-baseline gap-2">
              <h4 className="text-3xl font-black text-slate-900 tracking-tight">
                {card.value}
              </h4>
              {card.subValue && (
                <span className="text-[11px] font-medium text-slate-400 italic">
                  {card.subValue}
                </span>
              )}
            </div>
          </div>

          <div className="absolute -right-6 -bottom-6 opacity-[0.03] text-slate-900 pointer-events-none transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-12">
            <card.icon size={140} strokeWidth={1.5} />
          </div>
        </motion.section>
      ))}
    </div>
  );
}
