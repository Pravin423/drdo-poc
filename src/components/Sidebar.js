import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard, ChevronDown, ChevronRight, MapPin } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import { SIDEBAR_CONFIG } from "../config/sidebarConfig";

function SidebarItem({ item, isActive, onNavigate, depth = 0 }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const hasSubItems = item.subItems && item.subItems.length > 0;

  // Check if any subitem is active to keep the menu open
  const isSubItemActive = hasSubItems && item.subItems.some(sub => router.pathname === sub.path);

  // Initialize open state based on active route
  useState(() => {
    if (isSubItemActive) setIsOpen(true);
  }, [isSubItemActive]);

  const handleToggle = (e) => {
    if (hasSubItems) {
      e.preventDefault();
      setIsOpen(!isOpen);
    } else {
      onNavigate?.();
    }
  };

  return (
    <li className="list-none">
      <Link
        href={hasSubItems ? "#" : item.path}
        onClick={handleToggle}
        className={`group flex items-center justify-between gap-2.5 rounded-2xl px-3 py-2.5 text-sm transition-all duration-200 ${isActive && !hasSubItems
            ? "bg-white/10 text-blue-50 shadow-[0_16px_45px_rgba(15,23,42,0.95)] border border-blue-400/60"
            : "text-slate-200 hover:text-white hover:bg-white/5 border border-transparent"
          } ${depth > 0 ? 'ml-4' : ''}`}
      >
        <div className="flex items-center gap-2.5">
          {item.name === "Goa Location" ? (
            <MapPin size={16} className={`shrink-0 ${isActive || isSubItemActive ? "text-tech-blue-400" : "text-blue-200 group-hover:text-blue-100"}`} />
          ) : depth === 0 ? (
            <LayoutDashboard size={16} className={`shrink-0 ${isActive && !hasSubItems ? "text-tech-blue-400" : "text-blue-200 group-hover:text-blue-100"}`} />
          ) : (
            <ChevronRight size={12} className={`shrink-0 ${isActive ? "text-tech-blue-400" : "text-slate-500 group-hover:text-slate-300"}`} />
          )}
          <span className={`truncate ${isActive || isSubItemActive ? "font-semibold text-white" : ""}`}>{item.name}</span>
        </div>

        {hasSubItems && (
          <ChevronDown
            size={14}
            className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""} text-slate-400 group-hover:text-white`}
          />
        )}
      </Link>

      {/* Sub menu rendering */}
      {hasSubItems && isOpen && (
        <ul className="mt-1 mb-2 space-y-1">
          {item.subItems.map((subItem, i) => (
            <SidebarItem
              key={i}
              item={subItem}
              isActive={router.pathname === subItem.path}
              onNavigate={onNavigate}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

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
      <div className="flex-1 px-3 py-5 overflow-y-auto space-y-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {menus.map((group, idx) => (
          <nav key={idx} className="space-y-2">
            <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400/80">
              {group.section}
            </p>

            <ul className="space-y-1.5">
              {group.items.map((item, i) => (
                <SidebarItem
                  key={i}
                  item={item}
                  isActive={router.pathname === item.path}
                  onNavigate={onNavigate}
                />
              ))}
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
    <aside className="hidden lg:flex fixed z-2    md:flex md:w-72 xl:w-80 h-screen flex-col border-r border-slate-200 bg-gradient-to-b from-blue-950 via-blue-900 to-slate-950 text-slate-50 backdrop-blur-xl">
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
