import React, { useMemo, memo } from "react";
import { Users, CheckCircle2, XCircle, Clock } from "lucide-react";
import SummaryCard from "@/components/common/SummaryCard";

const OverviewGrid = memo(function OverviewGrid({ employees = [], loading = false }) {
  const today = new Date().getDate();

  const stats = useMemo(() => {
    // Calculate stats from employees data
    const presentCount = employees.filter(emp => emp.days?.[today] === "P").length;
    const absentCount = employees.filter(emp => emp.days?.[today] === "A").length;

    return [
      {
        label: "Total CRPs",
        value: loading ? "..." : employees.length.toString(),
        icon: Users,
        variant: "indigo"
      },
      {
        label: "Present Today",
        value: loading ? "..." : presentCount.toString(),
        icon: CheckCircle2,
        variant: "emerald"
      },
      {
        label: "Absent Today",
        value: loading ? "..." : absentCount.toString(),
        icon: XCircle,
        variant: "rose"
      },
      {
        label: "Pending Approvals",
        value: "24",
        icon: Clock,
        variant: "amber"
      },
    ];
  }, [employees, loading, today]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((card, index) => (
        <SummaryCard
          key={card.label}
          title={card.label}
          value={card.value}
          icon={card.icon}
          variant={card.variant}
          delay={index * 0.1}
        />
      ))}
    </div>
  );
});

export default OverviewGrid;
