import React from 'react';

export const StatusBadge = ({ status }) => {
  const normStatus = status ? status.toLowerCase() : "";

  const styles = {
    approved: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    active: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    completed: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    closed: "bg-slate-50 text-slate-700 border border-slate-200",
    pending: "bg-amber-50 text-amber-700 border border-amber-300/60",
    "pending review": "bg-amber-50 text-amber-700 border border-amber-300/60",
    inprogress: "bg-blue-50 text-blue-700 border border-blue-200",
    overdue: "bg-rose-50 text-rose-700 border border-rose-200",
    deleted: "bg-rose-50 text-rose-700 border border-rose-200",
    rejected: "bg-rose-50 text-rose-700 border border-rose-200",
    "info requested": "bg-blue-50 text-blue-700 border border-blue-200",
  };

  const badgeStyle = styles[normStatus] || "bg-slate-50 text-slate-700 border border-slate-200";

  return (
    <div className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-[12px] font-bold capitalize ${badgeStyle}`}>
      {status}
    </div>
  );
};

export const TaskTypeBadge = ({ type }) => {
  const t = type ? type.toUpperCase() : '';
  const isSpecial = t.includes('SPECIAL');
  const isRegular = t.includes('REGULAR');

  let colorClass = "bg-slate-500";
  if (isSpecial) colorClass = "bg-[#f43f5e]";
  else if (isRegular) colorClass = "bg-[#10b981]";

  return (
    <span className={`${colorClass} text-white px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide inline-block`}>
      {type}
    </span>
  );
};

export const ActivityFormBadge = ({ formName }) => {
  return (
    <span className="bg-[#00d0e4] text-white px-3.5 py-1.5 rounded-full text-[12px] font-bold inline-block whitespace-nowrap">
      {formName}
    </span>
  );
};
