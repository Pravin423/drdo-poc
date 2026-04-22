"use client";

import { Users, Activity, MapPin, UserPlus } from "lucide-react";
import SummaryCard from "@/components/common/SummaryCard";

export default function ShgRepositoryStats({ shgs }) {
  const totalSHGs = shgs.length;
  const activeSHGs = shgs.filter(s => s.status === "Active").length;
  const villagesCovered = new Set(shgs.map(s => s.village)).size;
  const totalMembers = shgs.reduce((acc, shg) => acc + Number(shg.memberCount || 0), 0);

  const summaryCards = [
    { title: "Total SHGs", value: totalSHGs, icon: Users, variant: "blue" },
    { title: "Active SHGs", value: activeSHGs, icon: Activity, variant: "emerald" },
    { title: "Villages Covered", value: villagesCovered, icon: MapPin, variant: "amber" },
    { title: "Total Members", value: totalMembers, icon: UserPlus, variant: "rose" },
  ];

  return (
    <div className="grid px-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
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