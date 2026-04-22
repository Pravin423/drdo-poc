"use client";

import { Users } from "lucide-react";
import SummaryCard from "@/components/common/SummaryCard";
export default function CrpStatsCards({ totalCRPs, activeCRPs, inactiveCRPs }) {
  const summaryCards = [
    { title: "Total CRPs", value: totalCRPs, icon: Users, variant: "bg-blue-50 text-blue-600 border-blue-200" },
    { title: "Active CRPs", value: activeCRPs, icon: Users, variant: "bg-emerald-50 text-emerald-600 border-emerald-200" },
    { title: "Inactive CRPs", value: inactiveCRPs, icon: Users, variant: "bg-rose-50 text-rose-600 border-rose-200" },
  ];

  return (
    <div className="grid gap-y-8 gap-x-6 md:grid-cols-2 lg:grid-cols-4">
      {summaryCards.map((card, index) => (
        <SummaryCard
          key={card.title}
          title={card.title}
          value={card.value}
          icon={card.icon}
          variant={card.variant}
          delay={index * 0.1}
        />
      ))}
    </div>
  );
}
