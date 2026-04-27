import React, { useMemo, memo } from "react";
import { motion } from "framer-motion";
import { Users, CheckCircle2, XCircle, Clock } from "lucide-react";

const OverviewGrid = memo(function OverviewGrid({ employees = [], loading = false }) {
  const today = new Date().getDate();

  const stats = useMemo(() => {
    // Calculate stats from employees data
    const presentCount = employees.filter(emp => emp.days?.[today] === "P").length;
    const absentCount = employees.filter(emp => emp.days?.[today] === "A").length;

    return [
      {
        label: "Total CRPs",
        value: loading ? "..." : employees.length.toString(),
        accent: "text-emerald-600 bg-emerald-50",
        icon: Users,
      },
      {
        label: "Present Today",
        value: loading ? "..." : presentCount.toString(),
        accent: "text-blue-600 bg-blue-50",
        icon: CheckCircle2,
      },
      {
        label: "Absent Today",
        value: loading ? "..." : absentCount.toString(),
        accent: "text-rose-600 bg-rose-50",
        icon: XCircle,
      },
      {
        label: "Pending Approvals",
        value: "24", // This could also be calculated if data is available
        accent: "text-orange-600 bg-orange-50",
        icon: Clock,
      },
    ];
  }, [employees, loading, today]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((card, index) => (
        <motion.section
          key={card.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.3 }}
          className="group relative overflow-hidden rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between min-h-[140px]"
        >
          {/* Top Row: Circular Icon */}
          <div className="relative z-10 mb-4 transition-transform duration-300 group-hover:scale-[1.15] origin-top-left">
            <div className={`w-10 h-10 flex items-center justify-center rounded-full ${card.accent}`}>
              <card.icon size={20} strokeWidth={2} />
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10 mt-auto">
            <h4 className="text-2xl font-extrabold text-[#111827] leading-tight mb-1">{card.value}</h4>
            <p className="text-[13px] font-bold text-slate-500">{card.label}</p>
          </div>

          {/* Large Faint Background Icon */}
          <div className="absolute -right-4 -bottom-4 opacity-[0.03] text-slate-900 pointer-events-none transition-transform duration-500 ease-out group-hover:scale-[1.4] group-hover:-rotate-6">
            <card.icon size={90} strokeWidth={2.5} />
          </div>
        </motion.section>
      ))}
    </div>
  );
});

export default OverviewGrid;
