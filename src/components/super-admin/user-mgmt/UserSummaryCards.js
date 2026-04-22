import React from "react";
import { motion } from "framer-motion";
import { Users, UserCheck, UserX, Shield } from "lucide-react";

export default function UserSummaryCards({ totalUsers, activeUsers, inactiveUsers, rolesCount }) {
  const summaryCards = [
    { label: "Total Users",    value: totalUsers,    icon: Users,     accent: "text-blue-600 bg-blue-50 border-blue-100",         sub: "Registered accounts" },
    { label: "Active Users",   value: activeUsers,   icon: UserCheck, accent: "text-emerald-600 bg-emerald-50 border-emerald-100", sub: "Currently active" },
    { label: "Inactive Users", value: inactiveUsers, icon: UserX,     accent: "text-rose-600 bg-rose-50 border-rose-100",         sub: "Deactivated" },
    { label: "Roles Defined",  value: rolesCount,    icon: Shield,    accent: "text-purple-600 bg-purple-50 border-purple-100",    sub: "Permission levels" },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {summaryCards.map((card, i) => (
        <motion.section
          key={card.label}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, duration: 0.5 }}
          className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300"
        >
          <div className="flex justify-between items-start">
            <div className={`p-3 rounded-2xl ${card.accent} border`}>
              <card.icon size={22} />
            </div>
            <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 rounded-full">{card.sub}</span>
          </div>
          <div className="mt-6 space-y-1">
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">{card.value}</p>
            <p className="text-sm font-semibold text-slate-500">{card.label}</p>
          </div>
        </motion.section>
      ))}
    </div>
  );
}
