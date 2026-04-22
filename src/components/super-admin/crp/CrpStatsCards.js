"use client";

import { motion } from "framer-motion";
import { Users } from "lucide-react";

export default function CrpStatsCards({ totalCRPs, activeCRPs, inactiveCRPs }) {
  const summaryCards = [
    { label: "Total CRPs", value: totalCRPs, icon: Users, accent: "bg-blue-50 text-blue-600 border-blue-200" },
    { label: "Active CRPs", value: activeCRPs, icon: Users, accent: "bg-emerald-50 text-emerald-600 border-emerald-200" },
    { label: "Inactive CRPs", value: inactiveCRPs, icon: Users, accent: "bg-rose-50 text-rose-600 border-rose-200" },
  ];

  return (
    <div className="grid gap-y-8 gap-x-6 md:grid-cols-2 lg:grid-cols-4">
      {summaryCards.map((card, index) => (
        <motion.section
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
          className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300"
        >
          <div className="flex justify-between items-start">
            <div className={`p-2.5 rounded-2xl border ${card.accent}`}>
              <card.icon size={20} />
            </div>
          </div>

          <div className="mt-5 space-y-1">
            <p className="text-2xl font-bold text-slate-900 tracking-tight">{card.value}</p>
            <p className="text-sm font-medium text-slate-500">{card.label}</p>
          </div>

          <div className="absolute -right-2 -bottom-2 opacity-5 transition-transform group-hover:scale-110">
            <card.icon size={80} />
          </div>
        </motion.section>
      ))}
    </div>
  );
}
