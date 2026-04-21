import { motion } from "framer-motion";
import { FilePlus2 } from "lucide-react";

export default function FormHeader({ isEditing }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center gap-4"
    >
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-md shadow-blue-500/20">
        <FilePlus2 size={22} className="text-white" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{isEditing ? "Edit Activity Form" : "Create New Activity Form"}</h1>
        <p className="text-slate-500 text-sm font-medium">{isEditing ? "Modify an existing form for CRP activity reporting" : "Build a new form for CRP activity reporting"}</p>
      </div>
    </motion.header>
  );
}
