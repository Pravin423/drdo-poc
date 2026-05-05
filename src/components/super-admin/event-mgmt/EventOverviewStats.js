import React from "react";
import { Calendar, Users, Clock, Award } from "lucide-react";
import SummaryCard from "../../common/SummaryCard";

export default function EventOverviewStats({ stats }) {
  const statCards = [
    {
      label: "Total Events",
      value: stats.totalEvents.toLocaleString(),
      delta: "+3 THIS MONTH",
      variant: "blue",
      icon: Calendar,
    },
    {
      label: "Total Participants",
      value: stats.totalParticipants.toLocaleString(),
      delta: "+12%",
      variant: "emerald",
      icon: Users,
    },
    {
      label: "Upcoming Events",
      value: stats.upcomingEvents.toString(),
      subValue: "Next 30 days",
      variant: "amber",
      icon: Clock,
    },
    {
      label: "Certificates",
      value: stats.certificatesIssued.toLocaleString(),
      delta: "89% RATE",
      variant: "indigo",
      icon: Award,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((card, index) => (
        <SummaryCard
          key={card.label}
          title={card.label}
          value={card.value}
          icon={card.icon}
          variant={card.variant}
          delta={card.delta}
          subValue={card.subValue}
          delay={index * 0.1}
        />
      ))}
    </div>
  );
}
