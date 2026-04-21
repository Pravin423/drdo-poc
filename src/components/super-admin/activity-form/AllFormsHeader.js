import { motion } from "framer-motion";
import Link from "next/link";
import { FileText, Plus } from "lucide-react";

export default function AllFormsHeader() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-md shadow-blue-500/20">
          <FileText size={22} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">All Activity Forms</h1>
          <p className="text-slate-500 text-sm font-medium">View and manage all created forms</p>
        </div>
      </div>
      <Link
        href="/dashboard/activity-forms/create"
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 active:scale-95 w-fit"
      >
        <Plus size={16} /> Create New Form
      </Link>
    </motion.header>
  );
}
