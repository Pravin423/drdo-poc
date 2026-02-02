import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-10 page-fade">
      <div className="max-w-5xl w-full grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] items-center">
        {/* Left: Hero copy */}
        <div className="space-y-6">
          <span className="pill-badge">GoaDRDA · CRP Portal</span>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-slate-900">
            A calmer way to{" "}
            <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
              manage field insights
            </span>{" "}
            and rural programmes.
          </h1>
          <p className="text-sm sm:text-base leading-relaxed text-slate-600 max-w-xl">
            Log in to a focused workspace crafted for State, District, Finance,
            Supervisors and CRPs to review progress, surface bottlenecks and
            act with clarity.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link href="/login" className="primary-button">
              Proceed to secure login
            </Link>
            <button type="button" className="secondary-button">
              View access guidelines
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 pt-3">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]" />
              <span>Verified government access only</span>
            </div>
            <div className="h-3 w-px bg-slate-300/80" />
            <span>© 2026 GoaDRDA · CRP Management System</span>
          </div>
        </div>

        {/* Right: Status / overview card */}
        <div className="glass-panel p-6  sm:p-7 md:p-8 card-float">
          <div className="flex items-start justify-between gap-3 mb-6">
            <div>
              <p className="text-xs font-medium text-slate-500">
                Environment
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                Production workspace
              </p>
            </div>
            <div className="rounded-full border border-emerald-500/40 bg-emerald-50/90 px-3 py-1 text-[11px] font-medium text-emerald-700 live-pulse">
              All systems stable
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-4 text-xs sm:text-[13px]">
            <div className="space-y-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <dt className="text-slate-500">Active roles</dt>
              <dd className="text-slate-900 font-medium">State · District</dd>
              <dd className="text-[11px] text-slate-500">
                Plus Finance, Supervisors &amp; CRPs
              </dd>
            </div>
            <div className="space-y-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <dt className="text-slate-500">Last sync window</dt>
              <dd className="text-slate-900 font-medium">Real-time updates</dd>
              <dd className="text-[11px] text-slate-500">
                Data refreshes as field entries arrive
              </dd>
            </div>
            <div className="space-y-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <dt className="text-slate-500">Monitoring focus</dt>
              <dd className="text-slate-900 font-medium">CRP performance</dd>
              <dd className="text-[11px] text-slate-500">
                Coverage, visits &amp; intervention trails
              </dd>
            </div>
            <div className="space-y-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <dt className="text-slate-500">Security</dt>
              <dd className="text-slate-900 font-medium">Role-based access</dd>
              <dd className="text-[11px] text-slate-500">
                Enforced through supervised logins
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}