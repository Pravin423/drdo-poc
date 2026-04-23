import { motion } from "framer-motion";

/**
 * PageHeader
 * Renders the top title + "Download Report" button row.
 */
export default function PageHeader({roleName}) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          {roleName}{" "}
          <span className="bg-gradient-to-b from-[#3b52ab] to-[#1a2e7a] bg-clip-text text-transparent">
            Overview
          </span>
        </h1>
        <p className="text-slate-500 font-medium">
          System-wide analytics and multi-state configuration oversight.
        </p>
      </div>

      <button className="w-fit px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-all active:scale-95">
        Download Report
      </button>
    </motion.header>
  );
}
