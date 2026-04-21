import { memo } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const StatsCard = memo(function StatsCard({ icon: Icon, label, value, subValue, delta, isPositive, accent }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-200"
    >
      {/* Top Row */}
      <div className="flex justify-between items-start relative z-10">
        <div className={`p-2 rounded-lg ${accent} border`}>
          <Icon size={18} strokeWidth={2} />
        </div>

        {isPositive !== null && (
          <div className={`flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-md 
            ${isPositive ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'}`}>
            {isPositive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
            {delta}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mt-5 space-y-0.5 relative z-10">
        <div className="flex items-baseline gap-2">
          <h4 className="text-2xl font-bold text-slate-900 tracking-tight">{value}</h4>
          {subValue && (
            <span className="text-xs font-semibold text-slate-400">{subValue}</span>
          )}
        </div>
        <p className="text-[13px] font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
      </div>

      {/* Background Decorative Icon */}
      <div className="absolute -right-2 -bottom-2 opacity-[0.06] text-slate-900 pointer-events-none">
        <Icon size={100} strokeWidth={2} />
      </div>
    </motion.section>
  );
});

export default StatsCard;
