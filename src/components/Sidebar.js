import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard } from "lucide-react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import { SIDEBAR_CONFIG } from "../config/sidebarConfig";

function SidebarContent({ onNavigate }) {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) return null;

  const menus = SIDEBAR_CONFIG[user.role] || [];

  return (
    <>
      {/* Logo / Brand */}
      <div className="flex items-center justify-between gap-3 px-6 py-5 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl overflow-hidden bg-white  border border-white/20 flex items-center justify-center">
            <Image
              src="/Seal_of_Goa.webp"
              alt="DRDA Goa CRP logo"
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-50 leading-tight">
              DRDA Goa CRP
            </p>
            <p className="text-[11px] text-slate-400">
              Cohesive Rural Program
            </p>
          </div>
        </div>
        <span className="rounded-full border border-emerald-400/70 bg-emerald-400/15 px-2 py-0.5 text-[10px] font-medium text-emerald-100 live-pulse">
          Live
        </span>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 py-5 overflow-y-auto space-y-6">
        {menus.map((group, idx) => (
          <nav key={idx} className="space-y-2">
            <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400/80">
              {group.section}
            </p>

            <ul className="space-y-1.5">
              {group.items.map((item, i) => {
                const isActive = router.pathname === item.path;

                return (
                  <li key={i}>
                    <Link
                      href={item.path}
                      onClick={onNavigate}
                      className={`group flex items-center gap-2.5 rounded-2xl px-3 py-2.5 text-sm transition-all duration-200 ${
                        isActive
                          ? "bg-white/10 text-blue-50 shadow-[0_16px_45px_rgba(15,23,42,0.95)] border border-blue-400/60"
                          : "text-slate-200 hover:text-white hover:bg-white/5 border border-transparent"
                      }`}
                    >
                      <LayoutDashboard
                        size={16}
                        className="shrink-0 text-blue-200 group-hover:text-blue-100"
                      />
                      <span className="truncate">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        ))}
      </div>

      {/* User Footer */}
      <div className="border-t border-slate-800/80 px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-xs font-semibold uppercase text-slate-100">
              {user.email?.slice(0, 2) || "CR"}
            </div>
            <div className="leading-tight">
              <p className="text-xs font-medium text-slate-100">
                {user.email}
              </p>
              <p className="text-[11px] text-slate-400 capitalize">
                {user.role} role
              </p>
            </div>
          </div>
          <button
             onClick={() => {
    logout();
    router.push("/login");
  }}
            className="text-[11px] font-medium text-slate-300 hover:text-rose-300 rounded-full border border-slate-700/80 bg-slate-900/80 px-3 py-1 transition hover:border-rose-500/80 hover:bg-rose-500/10"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
}

export default function Sidebar() {
  return (
    <aside className="hidden md:flex md:w-72 xl:w-80 min-h-screen flex-col border-r border-slate-200 bg-gradient-to-b from-blue-950 via-blue-900 to-slate-950 text-slate-50 backdrop-blur-xl">
      <SidebarContent />
    </aside>
  );
}

export function MobileSidebar({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex md:hidden">
      <button
        type="button"
        aria-label="Close menu"
        className="flex-1 bg-black/30"
        onClick={onClose}
      />
      <aside className="w-72 max-w-[80%] min-h-full flex flex-col border-r border-slate-800 bg-gradient-to-b from-blue-950 via-blue-900 to-slate-950 text-slate-50 shadow-2xl animate-slide-in">
        <SidebarContent onNavigate={onClose} />
      </aside>
    </div>
  );
}
