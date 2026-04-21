import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Activity, CreditCard, ShieldCheck, Zap } from "lucide-react";

// ─── Animated Number Counter ──────────────────────────────────────────────────
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

// ─── Card Definitions (built at runtime from API data) ────────────────────────
function buildCards(data) {
  return [
    {
      label:    "Total CRPs",
      rawValue: data?.totalCrps ?? 0,
      icon:     Users,
      accent:   "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
    {
      label:    "Total Attendance",
      rawValue: data?.totalAttendance ?? 0,
      icon:     Activity,
      accent:   "text-blue-600 bg-blue-50 border-blue-100",
    },
    {
      label:    "Regular Tasks",
      rawValue: data?.regularTaskCount ?? 0,
      icon:     CreditCard,
      accent:   "text-amber-600 bg-amber-50 border-amber-100",
    },
    {
      label:    "Total Users",
      rawValue: data?.totalUsers ?? 0,
      icon:     ShieldCheck,
      accent:   "text-rose-600 bg-rose-50 border-rose-100",
    },
    {
      label:    "Special Tasks",
      rawValue: data?.specialTaskCount ?? 0,
      icon:     Zap,
      accent:   "text-purple-600 bg-purple-50 border-purple-100",
    },
  ];
}

// ─── SummaryCards ─────────────────────────────────────────────────────────────
/**
 * Fetches /api/dashboard on mount and renders the 5 summary stat cards.
 */
export default function SummaryCards() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading]             = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res   = await fetch("/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (json.status && json.data) setDashboardData(json.data);
      } catch (err) {
        console.error("Dashboard fetch failed:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const cards = buildCards(dashboardData);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
      {cards.map((card, index) => (
        <motion.section
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
          className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300"
        >
          <div className="flex justify-between items-start">
            <div className={`p-2.5 rounded-2xl ${card.accent} border`}>
              <card.icon size={20} />
            </div>
          </div>

          <div className="mt-5 space-y-1">
            {loading ? (
              <div className="h-8 w-24 rounded-lg bg-slate-100 animate-pulse" />
            ) : (
              <p className="text-2xl font-bold text-slate-900 tracking-tight">
                <AnimatedCounter to={card.rawValue} />
              </p>
            )}
            <p className="text-sm font-medium text-slate-500">{card.label}</p>
          </div>

          {/* Watermark icon */}
          <div className="absolute -right-2 -bottom-2 opacity-5 transition-transform group-hover:scale-110">
            <card.icon size={80} />
          </div>
        </motion.section>
      ))}
    </div>
  );
}
