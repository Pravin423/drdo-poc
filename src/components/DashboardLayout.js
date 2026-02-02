import { useState } from "react";
import Sidebar, { MobileSidebar } from "./Sidebar";

export default function DashboardLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-transparent text-slate-900 flex page-fade">
      <Sidebar />
      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <main className="flex-1 flex flex-col">
        <div className="flex-1 px-2 py-4 sm:px-6 sm:py-6 lg:px-12 lg:py-10">
          <div className="max-w-6xl mx-auto space-y-6">
            <header className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm hover:border-blue-500/70 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 md:hidden"
                  onClick={() => setMobileOpen(true)}
                  aria-label="Open navigation menu"
                >
                  <span className="flex flex-col gap-0.5">
                    <span className="h-0.5 w-4 rounded-full bg-current" />
                    <span className="h-0.5 w-3.5 rounded-full bg-current" />
                    <span className="h-0.5 w-4 rounded-full bg-current" />
                  </span>
                </button>
                <div>
                  <p className="pill-badge">Dashboard space</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Monitor CRP activity with a calm, focused workspace.
                  </p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-3 text-xs text-slate-500">
                <div className="flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50/70 px-3 py-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 live-pulse" />
                  <span>System status · Stable</span>
                </div>
              </div>
            </header>

            <section className="glass-panel p-5 sm:p-8 md:p-10 card-float">
              {children}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
