"use client";

import React from "react";
import SummaryCard from "@/components/common/SummaryCard";
import { Users, IndianRupee, CheckCircle2, Clock } from "lucide-react";

const fmtRs = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

export default function HonSummaryCards({ filteredLength, totalAmt, paidCnt }) {
  const cards = [
    {
      title: "Total CRPs",
      value: filteredLength,
      icon: Users,
      variant: "emerald"
    },
    {
      title: "Total Honorarium",
      value: fmtRs(totalAmt),
      icon: IndianRupee,
      variant: "blue"
    },
    {
      title: "Paid",
      value: paidCnt,
      icon: CheckCircle2,
      variant: "indigo"
    },
    {
      title: "Pending",
      value: filteredLength - paidCnt,
      icon: Clock,
      variant: "rose"
    }
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