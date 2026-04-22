"use client";

import React from "react";
import SummaryCard from "@/components/common/SummaryCard";
import { Users, UserCheck, UserX, Shield,ShieldCheck ,ShieldOff , ShieldX  } from "lucide-react";

export default function UserSummaryCards({ 
  totalUsers = 0, 
  activeUsers = 0, 
  inactiveUsers = 0, 
  rolesCount = 0 
}) {

  const cards = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: Users,
      variant: "blue",
    },
    {
      title: "Active Users",
      value: activeUsers,
      icon: ShieldCheck ,
      variant: "emerald",
    },
    {
      title: "Inactive Users",
      value: inactiveUsers,
      icon: ShieldX  ,
      variant: "rose",
    },
    {
      title: "Roles Defined",
      value: rolesCount,
      icon: ShieldOff ,
      variant: "indigo",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
      {cards.map((card, i) => (
        <SummaryCard
          key={card.title}
          {...card}
          delay={i * 0.1}
        />
      ))}
    </div>
  );
}