"use client";

import { Users ,ShieldCheck, ShieldOff   } from "lucide-react";
import SummaryCard from "@/components/common/SummaryCard";
export default function CrpStatsCards({ totalCRPs, activeCRPs, inactiveCRPs }) {
  const summaryCards = [
    { title: "Total CRPs", value: totalCRPs, icon: Users, variant: "blue" },
    { title: "Active CRPs", value: activeCRPs, icon: ShieldCheck, variant: "emerald" },
    { title: "Inactive CRPs", value: inactiveCRPs, icon: ShieldOff , variant: "rose" },
  ];

  return (
    <div className="grid gap-y-8 gap-x-6 md:grid-cols-3 lg:grid-cols-3">
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
