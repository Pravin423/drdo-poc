"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw } from "lucide-react";

export default function StatusToggle({ id, currentStatus, onStatusChange, fetchList }) {
  const [isUpdating, setIsUpdating] = useState(false);

  const statusToCode = { Active: 0, Inactive: 1, Deleted: 2 };
  const codeToStatus = { 0: "Active", 1: "Inactive", 2: "Deleted" };

  const handleToggle = async (newCode) => {
    if (isUpdating || statusToCode[currentStatus] === newCode) return;

    setIsUpdating(true);
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch("/api/update-user-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, status: newCode }),
      });

      const result = await res.json();
      if (result.status === true || result.success || result.status === 1) {
        onStatusChange(codeToStatus[newCode]);
        if (fetchList) fetchList();
      } else {
        alert(result.message || "Failed to update status");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const currentCode = statusToCode[currentStatus] ?? 0;

  return (
    <div className="flex items-center gap-1.5 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200 w-fit h-fit relative shadow-inner">
      <AnimatePresence mode="wait">
        {isUpdating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex items-center justify-center bg-white/40 rounded-2xl backdrop-blur-[1px]"
          >
            <RefreshCw size={14} className="animate-spin text-slate-800" />
          </motion.div>
        )}
      </AnimatePresence>

      {[
        { code: 0, label: "Active", color: "bg-emerald-500", shadow: "shadow-emerald-200" },
        { code: 1, label: "Inactive", color: "bg-amber-500", shadow: "shadow-amber-200" },
        { code: 2, label: "Deleted", color: "bg-rose-500", shadow: "shadow-rose-200" },
      ].map((stage) => {
        const isActive = currentCode === stage.code;
        return (
          <motion.button
            key={stage.code}
            onClick={() => handleToggle(stage.code)}
            disabled={isUpdating}
            whileHover={!isActive && !isUpdating ? { scale: 1.02, backgroundColor: "rgba(255,255,255,0.8)" } : {}}
            whileTap={!isUpdating ? { scale: 0.95 } : {}}
            className={`relative px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center min-w-[80px] ${
              isActive ? "text-white" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {isActive && (
              <motion.div
                initial={false}
                animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.9 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className={`absolute inset-0 ${stage.color} rounded-xl shadow-sm`}
              />
            )}
            <span className="relative z-10">{stage.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
