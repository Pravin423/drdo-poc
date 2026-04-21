import { motion } from "framer-motion";
import { FileText, CheckCircle2, XCircle } from "lucide-react";

const StatCard = ({ title, value, icon: Icon, colorClass, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.5, delay }}
        className="relative bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden group cursor-default hover:shadow-xl hover:border-slate-200 transition-all duration-300"
    >
        {/* Subtle Watermark Icon */}
        <div className="absolute -right-6 -bottom-6 text-slate-100/80 transform rotate-12 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
            <Icon size={140} strokeWidth={2} />
        </div>

        <div className="relative z-10 flex flex-col gap-4">
            <div className={`w-12 h-12 rounded-2xl ${colorClass} flex items-center justify-center shadow-sm`}>
                <Icon size={24} />
            </div>
            <div>
                <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{value}</h3>
                <p className="text-slate-500 font-bold text-sm tracking-wide mt-0.5">{title}</p>
            </div>
        </div>
    </motion.div>
);

export default function AllFormsStats({ stats }) {
    const { total = 0, active = 0, inactive = 0 } = stats || {};

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
                title="Total Forms"
                value={total}
                icon={FileText}
                colorClass="bg-blue-50 text-blue-600"
                delay={0.1}
            />
            <StatCard
                title="Active Forms"
                value={active}
                icon={CheckCircle2}
                colorClass="bg-emerald-50 text-emerald-600"
                delay={0.2}
            />
            <StatCard
                title="Inactive Forms"
                value={inactive}
                icon={XCircle}
                colorClass="bg-rose-50 text-rose-600"
                delay={0.3}
            />
        </div>
    );
}
