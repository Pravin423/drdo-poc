import React from "react";
import { motion } from "framer-motion";

/**
 * Universal SummaryCard Component
 * 
 * @param {string} title - The label for the statistic
 * @param {string|number} value - The main statistic value
 * @param {LucideIcon} icon - The icon component from lucide-react
 * @param {string} variant - Preset color variant: 'blue', 'emerald', 'rose', 'amber', 'indigo', 'slate'
 * @param {number} delay - Animation delay for staggered entrance
 */
const variants = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    rose: "bg-rose-50 text-rose-600",
    amber: "bg-amber-50 text-amber-600",
    indigo: "bg-[#eff2ff] text-[#3b52ab]",
    slate: "bg-slate-50 text-slate-600",
};

export default function SummaryCard({ 
    title, 
    value, 
    icon: Icon, 
    variant = "blue", 
    delay = 0 
}) {
    const colorClass = variants[variant] || variants.blue;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.5, delay }}
            className="relative bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden group cursor-default hover:shadow-xl hover:border-slate-200 transition-all duration-300 w-full"
        >
            {/* Subtle Watermark Icon */}
            <div className="absolute -right-6 -bottom-6 text-slate-100/80 transform rotate-12 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                {Icon && <Icon size={140} strokeWidth={2} />}
            </div>

            <div className="relative z-10 flex flex-col gap-4">
                <div className={`w-12 h-12 rounded-2xl ${colorClass} flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:scale-110`}>
                    {Icon && <Icon size={24} />}
                </div>
                <div>
                    <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none">{value}</h3>
                    <p className="text-slate-500 font-bold text-sm tracking-wide mt-2 uppercase">{title}</p>
                </div>
            </div>
        </motion.div>
    );
}
