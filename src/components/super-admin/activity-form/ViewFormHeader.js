import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function ViewFormHeader({ router, title, description }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center gap-4"
    >
      <button
        onClick={() => router.back()}
        className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
      >
        <ArrowLeft size={18} />
      </button>
      
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        <p className="text-slate-500 text-sm font-medium">{description || "No description provided."}</p>
      </div>
    </motion.header>
  );
}
