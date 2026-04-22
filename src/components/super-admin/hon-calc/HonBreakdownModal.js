import React, { useState, useEffect, useRef, memo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock, Calendar, CheckCircle2, AlertCircle, Eye, X, Download,
  BadgeCheck, Hash, Building2, Landmark
} from "lucide-react";

const fmtRs = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

/* ════════════════════════════════════════
   STATUS BADGE
   ════════════════════════════════════════ */
export const StatusBadge = ({ status }) => {
  const s = (status || "").toLowerCase();
  const styles = {
    paid: "bg-emerald-50 text-emerald-700 border-emerald-100",
    pending: "bg-slate-100 text-slate-600 border-slate-200",
    failed: "bg-red-50 text-red-600 border-red-100",
    processing: "bg-slate-100 text-slate-600 border-slate-200",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${styles[s] || "bg-slate-100 text-slate-600 border-slate-200"}`}>
      {(status || "").charAt(0).toUpperCase() + (status || "").slice(1)}
    </span>
  );
};

/* ════════════════════════════════════════
   BREAKDOWN SKELETON
   ════════════════════════════════════════ */
const BreakdownSkeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-14 bg-slate-100 rounded-2xl" />
    <div className="grid grid-cols-3 gap-3">
      {[1, 2, 3].map(i => <div key={i} className="h-20 bg-slate-100 rounded-2xl" />)}
    </div>
    <div className="h-40 bg-slate-100 rounded-2xl" />
    <div className="h-32 bg-slate-100 rounded-2xl" />
  </div>
);

/* ════════════════════════════════════════
   BREAKDOWN CONTENT
   ════════════════════════════════════════ */
const BreakdownContent = memo(function BreakdownContent({ calc, month }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    (async () => {
      try {
        const [mName, mYear] = month.split(" ");
        const mNum = new Date(`${mName} 1, ${mYear}`).getMonth() + 1;
        const res = await fetch(`/api/honorarium/show/${calc.id}?month=${mNum}&year=${parseInt(mYear)}`);
        const json = await res.json();
        if (json.status === 1 && json.data) setDetail(json.data);
        else setError(json.message || "No data returned");
      } catch (e) {
        console.error(e);
        setError("Failed to load. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, [calc.id, month]);

  if (loading) return <BreakdownSkeleton />;

  if (error) return (
    <div className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
      <AlertCircle size={15} className="text-slate-400 mt-0.5 shrink-0" />
      <div>
        <p className="text-sm font-semibold text-slate-700">Failed to load breakdown</p>
        <p className="text-xs text-slate-400 mt-0.5">{error}</p>
      </div>
    </div>
  );

  const {
    crp, specialTasks = [], payment,
    totalWorkingHours, totalWorkingDays, daysPayable,
    regularAmount, specialAmount, totalHonorarium,
  } = detail;

  const ratePerDay = daysPayable > 0 ? Math.round(regularAmount / daysPayable) : 0;
  const isPaid = payment?.payment_status?.toLowerCase() === "paid";
  const paidAmt = payment
    ? parseFloat(payment.total_amount || 0) + parseFloat(payment.bonus || 0) - parseFloat(payment.deduction_amount || 0)
    : 0;

  const LeftPanel = (
    <div className="space-y-4">
      {/* Compact Profile */}
      <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm">
        {crp?.profile
          ? <img src={crp.profile} alt={crp.fullname} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm shrink-0" />
          : <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-lg shrink-0">
              {(crp?.fullname || calc.name).charAt(0)}
            </div>
        }
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-slate-900 truncate">{crp?.fullname || calc.name}</h3>
          <p className="text-xs text-slate-500 font-medium">
            <span className="font-mono">{crp?.crp_id || calc.crpCode}</span> · 
            <span className="ml-1 text-emerald-600 font-bold uppercase tracking-wider text-[10px]">Active</span>
          </p>
        </div>
        <div className="hidden sm:flex flex-col items-end px-4 border-l border-slate-200">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Work Days</p>
          <p className="text-xl font-bold text-slate-900 leading-none mt-1">{totalWorkingDays}</p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "HRS WORKED",    value: `${totalWorkingHours} hrs`,  ic: Clock,        color: "text-blue-600",    bg: "bg-blue-50"    },
          { label: "DAYS LOGGED",   value: `${totalWorkingDays} d`,    ic: Calendar,     color: "text-indigo-600",  bg: "bg-indigo-50"  },
          { label: "WORKING DAYS",  value: `${daysPayable} d`,         ic: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
        ].map((f, i) => (
          <div key={i} className="group relative overflow-hidden p-3 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all h-full min-h-[85px] flex flex-col justify-between">
            <div className={`w-8 h-8 rounded-lg ${f.bg} ${f.color} flex items-center justify-center shadow-sm relative z-10`}>
              <f.ic size={16} strokeWidth={2.5} />
            </div>
            <div className="relative z-10">
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">{f.label}</p>
              <p className="text-base font-black text-slate-900 leading-none">{f.value}</p>
            </div>
            <div className={`absolute -right-2 -bottom-2 ${f.color} opacity-[0.05] transition-transform group-hover:scale-110 pointer-events-none`}>
              <f.ic size={60} strokeWidth={1} />
            </div>
          </div>
        ))}
      </div>

      {/* Tasks Table (Compact) */}
      {specialTasks.length > 0 && (
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Special Tasks</p>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">{specialTasks.length}</span>
          </div>
          <table className="w-full text-[11px]">
            <thead className="bg-slate-50/50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-1.5 text-slate-400 font-bold text-left uppercase">Task Name</th>
                <th className="px-4 py-1.5 text-slate-400 font-bold text-left uppercase">Activity</th>
                <th className="px-4 py-1.5 text-slate-400 font-bold text-right uppercase">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {specialTasks.map((task, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-2 font-semibold text-slate-800">{task.task_name}</td>
                  <td className="px-4 py-2 text-slate-500">{task.form_name}</td>
                  <td className="px-4 py-2 font-bold text-amber-600 text-right">{fmtRs(task.honorarium_amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Honorarium Calculation */}
      <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
        <div className="divide-y divide-slate-100">
          <div className="flex justify-between items-center px-4 py-2.5">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider text-[10px]">Special Honors</p>
            <p className="text-xs font-bold text-slate-900">{fmtRs(specialAmount)}</p>
          </div>
          <div className="flex justify-between items-center px-4 py-2.5">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider text-[10px]">Regular Honors</p>
              {ratePerDay > 0 && <p className="text-[9px] text-slate-400 font-medium">₹{ratePerDay}/day × {daysPayable} days</p>}
            </div>
            <p className="text-xs font-bold text-slate-900">{fmtRs(regularAmount)}</p>
          </div>
          <div className="flex justify-between items-center px-4 py-3.5 bg-slate-900">
            <p className="text-xs font-bold text-white uppercase tracking-[0.2em]">Net Honorarium</p>
            <p className="text-xl font-black text-white">{fmtRs(totalHonorarium)}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const RightPanel = payment ? (
    <div className="space-y-4">
      {/* Payment Banner */}
      <div className={`p-3.5 rounded-xl border flex items-center justify-between ${isPaid ? "bg-emerald-50 border-emerald-100" : "bg-slate-50 border-slate-200"}`}>
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isPaid ? "bg-emerald-600 text-white shadow-sm" : "bg-slate-400 text-white"}`}>
            <BadgeCheck size={16} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900 uppercase tracking-tight">Payment {isPaid ? "Disbursed" : "In Progress"}</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{fmtDate(payment.paid_at) || "Processing"}</p>
          </div>
        </div>
        {isPaid && <StatusBadge status="paid" />}
      </div>

      {/* Bank & Settlement Card */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 grid grid-cols-2 gap-y-4 border-b border-slate-100">
          {[
            { icon: Hash, label: "Transaction ID", value: payment.transaction_number, mono: true },
            { icon: Building2, label: "Bank Name", value: payment.bank_name },
            { icon: Hash, label: "Account No.", value: payment.account_number, mono: true },
            { icon: Landmark, label: "IFSC Code", value: payment.ifsc_code, mono: true },
          ].map((f, i) => (
            <div key={i} className="min-w-0 pr-2">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{f.label}</p>
              <p className={`text-xs font-bold text-slate-800 truncate ${f.mono ? "font-mono" : ""}`}>{f.value || "—"}</p>
            </div>
          ))}
        </div>

        <div className="p-4 bg-slate-50/50 border-b border-slate-100">
          <div className="grid grid-cols-2 gap-3 text-center">
            {[
              { label: "Bonus Amount", value: fmtRs(payment.bonus), color: "text-emerald-600" },
              { label: "Deductions", value: fmtRs(payment.deduction_amount), color: "text-red-500" },
            ].map((f, i) => (
              <div key={i} className="p-2 bg-white border border-slate-100 rounded-lg">
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">{f.label}</p>
                <p className={`text-xs font-bold ${f.color}`}>{f.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 flex items-center justify-between">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Settlement</p>
          <p className="text-xl font-bold text-slate-900">{fmtRs(paidAmt)}</p>
        </div>
      </div>

      {/* Remarks */}
      {payment.remarks && (
        <div className="p-4 bg-amber-50/50 border border-amber-100/50 rounded-xl">
          <p className="text-[9px] font-bold text-amber-700 uppercase tracking-widest mb-1">Remarks</p>
          <p className="text-xs text-slate-700 italic leading-snug font-medium">"{payment.remarks}"</p>
        </div>
      )}
    </div>
  ) : (
    <div className="h-full min-h-[250px] flex flex-col items-center justify-center p-8 bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400">
      <BadgeCheck size={32} className="opacity-10 mb-4" />
      <p className="text-xs font-bold uppercase tracking-widest">Awaiting Payment Data</p>
    </div>
  );

  return (
    <div className="grid grid-cols-5 gap-5">
      <div className="col-span-3">{LeftPanel}</div>
      <div className="col-span-2">{RightPanel}</div>
    </div>
  );
});

/* ════════════════════════════════════════
   BREAKDOWN MODAL
   ════════════════════════════════════════ */
export default function HonBreakdownModal({ calc, month, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const h = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const modal = (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4 py-8 overflow-y-auto"
        onClick={e => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          key="panel"
          initial={{ opacity: 0, y: 28, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.97 }}
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
          className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto honorarium-content"
        >
          {/* Dark navy header */}
          <div className="flex items-center justify-between px-6 py-5 bg-[#0f172a]">
            <div className="flex items-center gap-4 text-white">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
                <Eye size={18} strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-base font-bold tracking-tight">Honorarium Details</h2>
                <p className="text-xs text-slate-400 font-medium">{calc.crpCode} · {month}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-white"
            >
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 bg-white max-h-[85vh] overflow-y-auto">
            <BreakdownContent calc={calc} month={month} onClose={onClose} />
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/60 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-white transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                const [mName, mYear] = month.split(" ");
                const mNum = new Date(`${mName} 1, ${mYear}`).getMonth() + 1;
                const url = `/api/honorarium/show-pdf/${calc.id}?month=${mNum}&year=${parseInt(mYear)}`;
                window.open(url, "_blank");
              }}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#0f172a] text-sm font-bold text-white hover:bg-slate-800 transition-shadow shadow-sm active:scale-[0.95]"
            >
              <Download size={14} />
               PDF Report
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  if (typeof document === "undefined") return null;
  return (
    <>
      {createPortal(modal, document.body)}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        .honorarium-content {
          font-family: 'Inter', system-ui, -apple-system, sans-serif !important;
        }
      `}</style>
    </>
  );
}
