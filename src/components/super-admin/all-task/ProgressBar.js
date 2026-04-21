import React from 'react';

const ProgressBar = ({ percentage }) => {
  const getColor = (percent) => {
    if (percent >= 75) return "bg-emerald-500";
    if (percent >= 50) return "bg-blue-500";
    if (percent >= 25) return "bg-orange-500";
    return "bg-slate-400";
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-semibold text-slate-900">{percentage}%</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${getColor(percentage)}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
