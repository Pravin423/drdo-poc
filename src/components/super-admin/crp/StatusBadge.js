"use client";

export default function StatusBadge({ status }) {
  const styles = {
    Active: "bg-emerald-50 text-emerald-700 border-emerald-100",
    Inactive: "bg-amber-50 text-amber-500 border-amber-100",
    "On Leave": "bg-amber-50 text-amber-700 border-amber-100",
    Blacklisted: "bg-red-50 text-red-700 border-red-100",
    Deleted: "bg-rose-50 text-rose-700 border-rose-100",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-[11px] font-bold border ${styles[status] || "bg-slate-100 text-slate-600 border-slate-200"}`}
    >
      {status}
    </span>
  );
}
