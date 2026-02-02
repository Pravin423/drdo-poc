import ProtectedRoute from "../../components/ProtectedRoute";
import DashboardLayout from "../../components/DashboardLayout";

const SUMMARY_CARDS = [
  {
    label: "Total CRPs (All States)",
    value: "12,847",
    delta: "+8.2%",
    deltaLabel: "vs last month",
    accent: "text-emerald-600 bg-emerald-50",
  },
  {
    label: "Overall Attendance Rate",
    value: "87.3%",
    delta: "+2.1%",
    deltaLabel: "Current month",
    accent: "text-emerald-600 bg-emerald-50",
  },
  {
    label: "Honorarium Processing",
    value: "₹42.8L",
    delta: "Pending",
    deltaLabel: "This month",
    accent: "text-amber-600 bg-amber-50",
  },
  {
    label: "System Health Score",
    value: "98.5%",
    delta: "-0.3%",
    deltaLabel: "Last 24 hours",
    accent: "text-rose-600 bg-rose-50",
  },
];

export default function SuperAdmin() {
  return (
    <ProtectedRoute allowedRole="super-admin">
      <DashboardLayout>
        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">
              Super Admin Dashboard
            </h1>
            <p className="text-sm text-slate-600 max-w-2xl">
              System-wide analytics and multi-state configuration oversight.
            </p>
          </div>

          {/* Summary cards */}
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {SUMMARY_CARDS.map((card) => (
              <section
                key={card.label}
                className="rounded-3xl border border-slate-200  px-5 py-4 shadow-sm"
              >
                <p className="text-xs font-medium text-slate-500">
                  {card.label}
                </p>
                <div className="mt-4 flex items-end justify-between gap-2">
                  <p className="text-2xl font-semibold text-slate-900">
                    {card.value}
                  </p>
                  <div
                    className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${card.accent}`}
                  >
                    {card.delta}
                  </div>
                </div>
                <p className="mt-2 text-[11px] text-slate-500">
                  {card.deltaLabel}
                </p>
              </section>
            ))}
          </div>

          {/* Lower charts layout (static placeholders) */}
          <div className="grid gap-4 lg:grid-cols-2">
            <section className="rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-sm h-[320px] flex flex-col">
              <header className="mb-3">
                <h2 className="text-sm font-semibold text-slate-900">
                  State-wise CRP Distribution
                </h2>
                <p className="text-[11px] text-slate-500">
                  Active CRPs across different states
                </p>
              </header>
              <div className="flex-1 rounded-2xl bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center text-xs text-slate-400">
                Chart area (connect to real data later)
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-sm h-[320px] flex flex-col">
              <header className="mb-3">
                <h2 className="text-sm font-semibold text-slate-900">
                  Monthly Attendance Trends
                </h2>
                <p className="text-[11px] text-slate-500">
                  Attendance percentage over the last 6 months
                </p>
              </header>
              <div className="flex-1 rounded-2xl bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center text-xs text-slate-400">
                Line chart placeholder
              </div>
            </section>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
