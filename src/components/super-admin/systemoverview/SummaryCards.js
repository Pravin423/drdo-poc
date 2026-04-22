import { useState, useEffect } from "react";
import SummaryCard from "@/components/common/SummaryCard";
import { Users, Activity, CreditCard, ShieldCheck, Zap } from "lucide-react";

// AnimatedCounter stays same

function AnimatedCounter({ to }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (to === 0) return;
    let startTime = null;
    let animationFrame;
    const duration = 1500;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeProgress * to));

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(step);
      } else {
        setCount(to);
      }
    };

    animationFrame = window.requestAnimationFrame(step);

    return () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, [to]);

  return <>{count.toLocaleString()}</>;
}

function buildCards(data) {
  return [
    {
      title: "Total CRPs",
      value: data?.totalCrps ?? 0,
      icon: Users,
      variant: "emerald",
    },
    {
      title: "Total Attendance",
      value: data?.totalAttendance ?? 0,
      icon: Activity,
      variant: "blue",
    },
    {
      title: "Regular Tasks",
      value: data?.regularTaskCount ?? 0,
      icon: CreditCard,
      variant: "amber",
    },
    {
      title: "Total Users",
      value: data?.totalUsers ?? 0,
      icon: ShieldCheck,
      variant: "rose",
    },
    {
      title: "Special Tasks",
      value: data?.specialTaskCount ?? 0,
      icon: Zap,
      variant: "indigo",
    },
  ];
}

export default function SummaryCards() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("authToken");

        const res = await fetch("/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const json = await res.json();

        if (json.status && json.data) {
          setDashboardData(json.data);
        }
      } catch (err) {
        console.error("Dashboard fetch failed:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const cards = buildCards(dashboardData);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, index) => (
        <SummaryCard
          key={card.title}
          title={card.title}
          value={
            loading ? (
              <div className="h-8 w-20 bg-slate-100 animate-pulse rounded-md" />
            ) : (
              <AnimatedCounter to={card.value} />
            )
          }
          icon={card.icon}
          variant={card.variant}
          delay={index * 0.1}
        />
      ))}
    </div>
  );
}