import { useState } from "react";
import { motion } from "framer-motion";
import { Activity, ShieldCheck } from "lucide-react";

// ─── Health Row Sub-component ─────────────────────────────────────────────────
function HealthRow({ title, status, icon }) {
  const isOperational = status === "Operational";
  return (
    <div className="flex items-center justify-between p-3 rounded-2xl border border-slate-50 bg-slate-50/30 hover:bg-slate-50 transition-colors group">
      <div className="flex items-center gap-3">
        <div
          className={`p-2 rounded-lg bg-white shadow-sm border border-slate-100 ${
            isOperational ? "text-emerald-600" : "text-amber-600"
          }`}
        >
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-700 leading-none">{title}</h3>
          <p className="text-[11px] text-slate-500 mt-1 uppercase tracking-wider font-medium">
            Region: India-West
          </p>
        </div>
      </div>

      <div
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${
          isOperational
            ? "bg-emerald-50 text-emerald-700"
            : "bg-amber-50 text-amber-700 animate-pulse"
        }`}
      >
        {status}
      </div>
    </div>
  );
}

// ─── Service list ─────────────────────────────────────────────────────────────
const SERVICES = [
  "Database Cluster",
  "API Gateway",
  "Auth Service",
  "File Storage",
  "Cloud Backups",
];

// ─── SystemHealth ─────────────────────────────────────────────────────────────
/**
 * Displays live service health rows with an animated ping indicator
 * and a manual refresh button.
 */
export default function SystemHealth() {
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleString());

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col transition-all hover:shadow-md"
    >
      <header className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">System Health</h2>
          <p className="text-sm text-slate-500">Live service monitoring</p>
        </div>
        {/* Live pulse indicator */}
        <div className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </div>
      </header>

      <div className="flex-1 space-y-3">
        {SERVICES.map((item, i) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
          >
            <HealthRow
              title={item}
              status={item === "File Storage" ? "Degraded" : "Operational"}
              icon={i % 2 === 0 ? <ShieldCheck size={16} /> : <Activity size={16} />}
            />
          </motion.div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
        <span className="text-[11px] font-medium text-slate-400 italic">
          Synced: {lastUpdated.split(",")[1]}
        </span>
        <button
          onClick={() => setLastUpdated(new Date().toLocaleString())}
          className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
        >
          Refresh System
        </button>
      </div>
    </motion.section>
  );
}
