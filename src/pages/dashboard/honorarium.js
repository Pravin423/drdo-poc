"use client";

import { useState, useMemo, memo, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, IndianRupee, Calendar, CheckCircle2, Eye, Download,
  ChevronDown, Clock, Search, RefreshCw, Star, FileText,
  AlertCircle, BadgeCheck, Building2, Hash, Phone, Landmark, X,
} from "lucide-react";
import ProtectedRoute from "../../components/ProtectedRoute";
import DashboardLayout from "../../components/DashboardLayout";

/* ── helpers ── */
const fmtRs = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";
const fmtDT = (d) => d ? new Date(d).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";

/* ════════════════════════════════════════
   STATUS BADGE
════════════════════════════════════════ */
const StatusBadge = ({ status }) => {
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
   SUMMARY CARD
════════════════════════════════════════ */
const SummaryCard = memo(({ label, value, icon: Icon, index }) => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.08, duration: 0.4, ease: "easeOut" }}
    className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300"
  >
    <div className="p-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-slate-600 w-fit">
      <Icon size={20} />
    </div>
    <div className="mt-5 space-y-1">
      <p className="text-2xl font-bold text-slate-900 tracking-tight">{value}</p>
      <p className="text-sm font-medium text-slate-500">{label}</p>
    </div>
    <div className="absolute -right-2 -bottom-2 opacity-[0.04] transition-transform group-hover:scale-110">
      <Icon size={80} />
    </div>
  </motion.section>
));

/* ════════════════════════════════════════
   TABLE SKELETON
════════════════════════════════════════ */
const TableSkeleton = () => (
  <>
    {Array.from({ length: 4 }).map((_, i) => (
      <tr key={i} className="animate-pulse">
        {Array.from({ length: 9 }).map((_, j) => (
          <td key={j} className="px-4 py-4">
            <div className="h-4 bg-slate-100 rounded-lg" style={{ width: j === 1 ? "120px" : j === 2 ? "90px" : "70px" }} />
          </td>
        ))}
      </tr>
    ))}
  </>
);

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
   BREAKDOWN CONTENT  (used inside modal)
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
        console.log("[BreakdownContent]", json);
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

  /* ── LEFT column ── */
  const LeftPanel = (
    <div className="space-y-4">

      {/* CRP info bar */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
        {crp?.profile
          ? <img src={crp.profile} alt={crp.fullname} className="w-11 h-11 rounded-full object-cover ring-2 ring-white shadow shrink-0" />
          : <div className="w-11 h-11 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-base shadow-sm shrink-0">
            {(crp?.fullname || calc.name).charAt(0)}
          </div>
        }
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-900">{crp?.fullname || calc.name}</p>
          <p className="text-[11px] font-mono text-slate-400">{crp?.crp_id || calc.crpCode}</p>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1.5">
          {[
            { icon: Phone, v: crp?.mobile },
            { icon: Building2, v: crp?.bank_name },
            { icon: Hash, v: crp?.account_number, mono: true },
          ].filter(f => f.v).map((f, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <f.icon size={12} className="text-slate-400" />
              <span className={`text-xs font-semibold text-slate-600 ${f.mono ? "font-mono" : ""}`}>{f.v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Attendance */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Clock, label: "WORKING HOURS", value: `${totalWorkingHours} hrs`, border: "border-blue-100", ic: "text-blue-500" },
          { icon: Calendar, label: "WORKING DAYS", value: `${totalWorkingDays} days`, border: "border-violet-100", ic: "text-violet-500" },
          { icon: CheckCircle2, label: "DAYS PAYABLE", value: `${daysPayable} days`, border: "border-emerald-100", ic: "text-emerald-500" },
        ].map((f, i) => (
          <div key={i} className={`flex items-center gap-3 p-3.5 rounded-2xl border ${f.bg} ${f.border}`}>
            <div className={`p-1.5 rounded-xl bg-white/70 ${f.ic}`}>
              <f.icon size={13} strokeWidth={2.5} />
            </div>
            <div>
              <p className={`text-[9px] font-bold uppercase tracking-widest mb-0.5 ${f.ic}`}>{f.label}</p>
              <p className="text-lg font-extrabold text-slate-900 leading-tight">{f.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Special Tasks */}
      {specialTasks.length > 0 && (
        <div className="rounded-2xl border border-slate-100 overflow-hidden">
          <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
            
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-600">Approved Special Tasks</p>
            <span className="ml-auto text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">{specialTasks.length}</span>
          </div>
          <table className="w-full">
            <thead className="bg-white border-b border-slate-100">
              <tr>
                {["#", "Task Name", "Activity Form", "Task Date", "Submitted At", "Amount"].map(h => (
                  <th key={h} className="px-3 py-2 text-[9px] font-bold text-slate-400 uppercase tracking-wider text-left whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 bg-white">
              {specialTasks.map((task, i) => (
                <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-3 py-2.5 text-xs text-slate-400">{i + 1}</td>
                  <td className="px-3 py-2.5 text-xs font-semibold text-slate-900">{task.task_name}</td>
                  <td className="px-3 py-2.5 text-xs text-slate-500">{task.form_name}</td>
                  <td className="px-3 py-2.5 text-xs text-slate-500 whitespace-nowrap">{fmtDate(task.task_date)}</td>
                  <td className="px-3 py-2.5 text-xs text-slate-400 whitespace-nowrap">{fmtDT(task.submitted_at)}</td>
                  <td className="px-3 py-2.5 text-xs font-bold text-amber-600">{fmtRs(task.honorarium_amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Amount Summary */}
      <div className="rounded-2xl border border-slate-100 overflow-hidden">
        <div className="divide-y divide-slate-100">
          <div className="flex justify-between items-center px-4 py-3.5 bg-white hover:bg-slate-50/40 transition-colors">
            <p className="text-sm text-slate-600">Total Special Amount</p>
            <p className="text-sm font-bold text-amber-600">{fmtRs(specialAmount)}</p>
          </div>
          <div className="flex justify-between items-start px-4 py-3.5 bg-white hover:bg-slate-50/40 transition-colors">
            <div>
              <p className="text-sm text-slate-600">Total Regular Amount</p>
              {ratePerDay > 0 && <p className="text-xs text-slate-400 mt-0.5">₹{ratePerDay}/day × {daysPayable} days</p>}
            </div>
            <p className="text-sm font-bold text-emerald-600">{fmtRs(regularAmount)}</p>
          </div>
          <div className="flex justify-between items-center px-4 py-4 bg-[#0f172a]">
            <p className="text-sm font-bold text-white">Total Honorarium</p>
            <p className="text-sm font-extrabold text-white">{fmtRs(totalHonorarium)}</p>
          </div>
        </div>
      </div>
    </div>
  );

  /* ── RIGHT column: Payment ── */
  const RightPanel = payment ? (
    <div className="h-full">
      {/* Payment header */}
      <div className={`flex items-center justify-between px-4 py-3.5 rounded-t-2xl ${isPaid ? "bg-emerald-600" : "bg-slate-700"}`}>
        <div className="flex items-center gap-2">
          <BadgeCheck size={14} className="text-white" />
          <p className="text-sm font-bold text-white">Payment {isPaid ? "Completed" : "Pending"}</p>
        </div>
        {isPaid && payment.paid_at && (
          <p className="text-[11px] text-white/75 font-medium">Paid on {fmtDate(payment.paid_at)}</p>
        )}
      </div>

      {/* Payment body */}
      <div className="p-4 border border-t-0 border-slate-100 rounded-b-2xl bg-white space-y-4">
        {/* Bank details */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: Hash, label: "Transaction No.", value: payment.transaction_number, mono: true },
            { icon: Building2, label: "Bank Name", value: payment.bank_name },
            { icon: Hash, label: "Account No.", value: payment.account_number, mono: true },
            { icon: Landmark, label: "IFSC Code", value: payment.ifsc_code, mono: true },
          ].map((f, i) => (
            <div key={i} className="flex items-start gap-2">
              <f.icon size={11} className="text-slate-300 mt-1 shrink-0" />
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">{f.label}</p>
                <p className={`text-sm font-semibold text-slate-800 ${f.mono ? "font-mono" : ""}`}>{f.value || "—"}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-100" />

        {/* Amount chips — 2×3 */}
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { label: "Status", custom: <StatusBadge status={payment.payment_status} /> },
            { label: "Total Amount", value: fmtRs(payment.total_amount), color: "text-slate-900" },
            { label: "Bonus", value: fmtRs(payment.bonus), color: "text-emerald-600" },
            { label: "Deduction", value: fmtRs(payment.deduction_amount), color: "text-red-500" },
            { label: "Paid Amount", value: fmtRs(paidAmt), color: "text-slate-900 font-extrabold" },
            { label: "Paid At", value: fmtDT(payment.paid_at), color: "text-slate-600", small: true },
          ].map((f, i) => (
            <div key={i} className="rounded-xl border border-slate-100 bg-slate-50/60 p-3">
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">{f.label}</p>
              {f.custom ? f.custom : (
                <p className={`font-bold ${f.small ? "text-xs leading-snug" : "text-sm"} ${f.color}`}>{f.value}</p>
              )}
            </div>
          ))}
        </div>

        {/* Remarks */}
        {payment.remarks && (
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">Remarks</p>
            <p className="text-sm text-slate-600 italic">"{payment.remarks}"</p>
          </div>
        )}

        {/* Payment Slip */}
        {payment.payment_slip && (
          <a
            href={`https://goadrda.runtime-solutions.net/public/uploads/payment_slips/${payment.payment_slip}`}
            target="_blank" rel="noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm w-full"
          >
            <FileText size={13} className="text-slate-400" />
            View Payment Slip
          </a>
        )}
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center h-full min-h-[200px] border border-dashed border-slate-200 rounded-2xl text-slate-400">
      <BadgeCheck size={30} className="opacity-20 mb-2" />
      <p className="text-sm font-medium">No payment recorded</p>
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
   BREAKDOWN MODAL  (portalled to body)
════════════════════════════════════════ */
function BreakdownModal({ calc, month, onClose }) {
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
          className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto"
        >
          {/* Dark navy header — matches SHG Details reference */}
          <div className="flex items-center justify-between px-6 py-5" style={{ background: "#0f172a" }}>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
                <Eye size={18} className="text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Honorarium Details</h2>
                <p className="text-xs text-slate-400">{calc.crpCode} · {month}</p>
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
          <div className="p-6 bg-white max-h-[80vh] overflow-y-auto">
            <BreakdownContent calc={calc} month={month} />
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/60 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-white transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  if (typeof document === "undefined") return null;
  return createPortal(modal, document.body);
}

/* ════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════ */
export default function HonorariumCalculation() {
  const [selectedMonth, setSelectedMonth] = useState("March 2026");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [modalCalc, setModalCalc] = useState(null);   // open modal for this calc
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setModalCalc(null);
      try {
        const [mn, yr] = selectedMonth.split(" ");
        const m = new Date(`${mn} 1, ${yr}`).getMonth() + 1;
        const res = await fetch(`/api/honorarium?month=${m}&year=${yr}`);
        const json = await res.json();
        if (json.status === 1 && json.data) {
          setData(json.data.map((item, idx) => ({
            id: item.crp_id ?? idx,
            name: item.crp_name ?? "N/A",
            crpCode: item.crp_code ?? `CRP-${idx}`,
            totalWorkingHours: Number(item.total_working_hours) || 0,
            totalWorkingDays: Number(item.total_working_days) || 0,
            daysPayable: Number(item.days_payable) || 0,
            regularAmount: Number(item.regular_amount) || 0,
            approvedRegularCount: Number(item.approved_regular_count) || 0,
            approvedSpecialCount: Number(item.approved_special_count) || 0,
            specialAmount: Number(item.special_amount) || 0,
            totalHonorarium: Number(item.total_honorarium) || 0,
            paymentStatus: item.payment_status ?? "Pending",
          })));
        } else setData([]);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    run();
  }, [selectedMonth]);

  const filtered = useMemo(() => data.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = !q || c.name.toLowerCase().includes(q) || c.crpCode.toLowerCase().includes(q);
    const matchStatus = statusFilter === "All Status" || c.paymentStatus?.toLowerCase() === statusFilter.toLowerCase();
    return matchSearch && matchStatus;
  }), [data, search, statusFilter]);

  const totalAmt = filtered.reduce((s, c) => s + c.totalHonorarium, 0);
  const paidCnt = filtered.filter(c => c.paymentStatus?.toLowerCase() === "paid").length;

  const summaryCards = [
    { label: "Total CRPs", value: filtered.length, icon: Users },
    { label: "Total Honorarium", value: fmtRs(totalAmt), icon: IndianRupee },
    { label: "Paid", value: paidCnt, icon: CheckCircle2 },
    { label: "Pending", value: filtered.length - paidCnt, icon: Clock },
  ];

  const exportCSV = () => {
    const h = ["CRP Code", "CRP Name", "Working Hrs", "Working Days", "Days Payable", "Regular Amt", "Special Amt", "Total Honorarium", "Payment Status"];
    const r = filtered.map(c => [c.crpCode, c.name, c.totalWorkingHours, c.totalWorkingDays, c.daysPayable, c.regularAmount, c.specialAmount, c.totalHonorarium, c.paymentStatus]);
    const csv = [h, ...r].map(row => row.join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    Object.assign(document.createElement("a"), { href: url, download: `Honorarium_${selectedMonth.replace(/ /g, "_")}.csv` }).click();
    URL.revokeObjectURL(url);
  };

  return (
    <ProtectedRoute allowedRole="super-admin">
      {/* Modal — portalled to document.body, outside DashboardLayout */}
      {modalCalc && (
        <BreakdownModal
          calc={modalCalc}
          month={selectedMonth}
          onClose={() => setModalCalc(null)}
        />
      )}

      <DashboardLayout>
        <div className="max-w-[1600px] mx-auto space-y-8 p-6">

          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Honorarium{" "}
                <span className="bg-gradient-to-b from-[#3b52ab] to-[#1a2e7a] bg-clip-text text-transparent">
                  Calculation
                </span>
              </h1>
              <p className="text-slate-500 font-medium mt-0.5">
                Automated honorarium processing for Community Resource Persons
              </p>
            </div>
            <button
              onClick={exportCSV}
              className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-slate-50 transition-colors text-slate-700"
            >
              <Download size={15} /> Export CSV
            </button>
          </motion.header>

          {/* Summary Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {summaryCards.map((card, i) => <SummaryCard key={card.label} {...card} index={i} />)}
          </div>

          {/* Filter Panel */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Filter Records</h3>
            </div>
            <div className="p-6">
              <div className="flex flex-col md:flex-row items-end gap-5">
                {/* Search */}
                <div className="flex-1 w-full">
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 ml-1">Search</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Search size={15} className="text-slate-400 group-focus-within:text-slate-600 transition-colors" />
                    </div>
                    <input
                      placeholder="CRP name or code..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-4 focus:ring-slate-200 focus:border-slate-400 transition-all outline-none bg-slate-50/30 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Month */}
                <div className="w-full md:w-44">
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 ml-1">Month</label>
                  <div className="relative">
                    <select
                      value={selectedMonth}
                      onChange={e => setSelectedMonth(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-4 focus:ring-slate-200 focus:border-slate-400 outline-none appearance-none bg-slate-50/30 focus:bg-white cursor-pointer"
                    >
                      <option>January 2026</option>
                      <option>February 2026</option>
                      <option>March 2026</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Status */}
                <div className="w-full md:w-44">
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 ml-1">Status</label>
                  <div className="relative">
                    <select
                      value={statusFilter}
                      onChange={e => setStatusFilter(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-4 focus:ring-slate-200 focus:border-slate-400 outline-none appearance-none bg-slate-50/30 focus:bg-white cursor-pointer"
                    >
                      {["All Status", "Paid", "Pending", "Failed", "Processing"].map(o => <option key={o}>{o}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Clear */}
                <button
                  onClick={() => { setSearch(""); setStatusFilter("All Status"); }}
                  className="w-full md:w-auto text-slate-500 border border-slate-200 hover:text-slate-800 hover:bg-slate-50 rounded-xl px-5 py-2.5 text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <RefreshCw size={14} /> Clear
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="bg-slate-50/60 border-b border-slate-100">
                  <tr>
                    {["CRP Code", "Name", "Working Hrs", "Working Days", "Days Payable", "Regular Amt", "Special Amt", "Total Honorarium", "Status", ""].map(h => (
                      <th key={h} className={`px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wide whitespace-nowrap ${h === "" ? "text-right" : "text-left"}`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {loading ? <TableSkeleton /> : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="px-4 py-16 text-center">
                        <div className="flex flex-col items-center gap-3 text-slate-400">
                          <Users size={34} className="opacity-25" />
                          <p className="text-sm font-semibold">No records found</p>
                          <p className="text-xs opacity-70">Try adjusting your filters</p>
                        </div>
                      </td>
                    </tr>
                  ) : filtered.map((calc, idx) => (
                    <motion.tr
                      key={calc.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.03 }}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="px-4 py-4 text-xs font-mono text-slate-500">{calc.crpCode}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs shrink-0">
                            {calc.name.charAt(0)}
                          </div>
                          <span className="text-sm font-semibold text-slate-900 whitespace-nowrap">{calc.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-600 tabular-nums">{calc.totalWorkingHours} hrs</td>
                      <td className="px-4 py-4 text-sm text-slate-600 tabular-nums">{calc.totalWorkingDays} days</td>
                      <td className="px-4 py-4 text-sm text-slate-600 tabular-nums">{calc.daysPayable} days</td>
                      <td className="px-4 py-4 text-sm text-slate-700 font-medium tabular-nums">{fmtRs(calc.regularAmount)}</td>
                      <td className="px-4 py-4 text-sm text-slate-700 font-medium tabular-nums">{fmtRs(calc.specialAmount)}</td>
                      <td className="px-4 py-4 text-sm font-bold text-slate-900 tabular-nums">{fmtRs(calc.totalHonorarium)}</td>
                      <td className="px-4 py-4"><StatusBadge status={calc.paymentStatus} /></td>
                      <td className="px-4 py-4 text-right">
                        <button
                          onClick={() => setModalCalc(calc)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold border border-slate-200 bg-white text-slate-600 hover:border-slate-400 hover:text-slate-900 transition-all"
                        >
                          <Eye size={11} /> View
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            {!loading && filtered.length > 0 && (
              <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/40 flex justify-between items-center">
                <p className="text-xs text-slate-500">
                  Showing <span className="font-bold text-slate-700">{filtered.length}</span> of{" "}
                  <span className="font-bold text-slate-700">{data.length}</span> records
                </p>
                <p className="text-xs font-bold text-slate-700">
                  Total Payable: <span className="text-slate-900">{fmtRs(totalAmt)}</span>
                </p>
              </div>
            )}
          </div>

        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
