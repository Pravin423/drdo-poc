import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  MapPin,
  PanelLeftClose,
  PanelLeftOpen,
  User,
} from "lucide-react";
import { useState, createContext, useContext } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import { SIDEBAR_CONFIG } from "../config/sidebarConfig";
import { motion, AnimatePresence } from "framer-motion";

// Context to share collapsed state with sub-components
const SidebarContext = createContext({ collapsed: false });

/* ─────────────────────────────── SidebarItem ─────────────────────────────── */
function SidebarItem({ item, isActive, onNavigate, depth = 0 }) {
  const router = useRouter();
  const { collapsed } = useContext(SidebarContext);
  const [isOpen, setIsOpen] = useState(false);

  const hasSubItems = item.subItems && item.subItems.length > 0;
  const isSubItemActive =
    hasSubItems && item.subItems.some((sub) => router.pathname === sub.path);

  useState(() => {
    if (isSubItemActive) setIsOpen(true);
  }, [isSubItemActive]);

  const handleToggle = (e) => {
    if (hasSubItems) {
      e.preventDefault();
      if (!collapsed) setIsOpen(!isOpen);
    } else {
      onNavigate?.();
    }
  };

  const icon =
    item.name === "Goa Location" ? (
      <MapPin
        size={16}
        className={`shrink-0 ${isActive || isSubItemActive
          ? "text-tech-blue-400"
          : "text-blue-200 group-hover:text-blue-100"
          }`}
      />
    ) : depth === 0 ? (
      <LayoutDashboard
        size={16}
        className={`shrink-0 ${isActive && !hasSubItems
          ? "text-tech-blue-400"
          : "text-blue-200 group-hover:text-blue-100"
          }`}
      />
    ) : (
      <ChevronRight
        size={12}
        className={`shrink-0 ${isActive ? "text-tech-blue-400" : "text-slate-500 group-hover:text-slate-300"
          }`}
      />
    );

  return (
    <li className="list-none relative group/item">
      <Link
        href={hasSubItems ? "#" : item.path}
        onClick={handleToggle}
        title={collapsed ? item.name : undefined}
        className={`group flex items-center justify-between gap-2.5 rounded-2xl px-3 py-2.5 text-sm transition-all duration-200 ${isActive && !hasSubItems
          ? "bg-white/10 text-blue-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_2px_8px_rgba(0,0,0,0.25)] border border-blue-400/40"
          : "text-slate-200 hover:text-white hover:bg-white/5 border border-transparent"
          } ${depth > 0 ? (collapsed ? "" : "ml-4") : ""}`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {icon}
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className={`truncate whitespace-nowrap overflow-hidden ${isActive || isSubItemActive ? "font-semibold text-white" : ""
                  }`}
              >
                {item.name}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {hasSubItems && !collapsed && (
          <ChevronDown
            size={14}
            className={`transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180" : ""
              } text-slate-400 group-hover:text-white`}
          />
        )}
      </Link>

      {/* Tooltip when collapsed */}
      {collapsed && depth === 0 && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded-lg whitespace-nowrap opacity-0 group-hover/item:opacity-100 pointer-events-none transition-opacity duration-150 shadow-lg border border-slate-700 z-50">
          {item.name}
        </div>
      )}

      {/* Sub menu */}
      <AnimatePresence initial={false}>
        {hasSubItems && isOpen && !collapsed && (
          <motion.ul
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden mt-1 mb-2 space-y-1"
          >
            {item.subItems.map((subItem, i) => (
              <SidebarItem
                key={i}
                item={subItem}
                isActive={router.pathname === subItem.path}
                onNavigate={onNavigate}
                depth={depth + 1}
              />
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
}

/* ─────────────────────────────── SidebarContent ─────────────────────────────── */
function SidebarContent({ onNavigate, onToggle }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { collapsed } = useContext(SidebarContext);

  if (!user) return null;

  const menus = SIDEBAR_CONFIG[user.role] || [];

  return (
    <div className="flex flex-col h-full">
      {/* Logo / Brand */}
      <div
        className={`flex border-b border-slate-800/80 transition-all duration-300 ${collapsed
          ? "flex-col items-center gap-3 px-3 py-4"
          : "flex-row items-center justify-between gap-3 px-5 py-5"
          }`}
      >
        {/* Left: logo + name */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-10 w-10 rounded-2xl overflow-hidden bg-white border border-white/20 flex items-center justify-center shrink-0">
            <Image
              src="/Seal_of_Goa.webp"
              alt="DRDA Goa CRP logo"
              width={28}
              height={28}
              className="object-contain"
            />
          </div>
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden whitespace-nowrap"
              >
                <p className="text-sm font-semibold text-slate-50 leading-tight">DRDA Goa CRP</p>
                <p className="text-[11px] text-slate-400">Cohesive Rural Program</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right (expanded): Live badge + collapse button inline */}
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-1.5 shrink-0"
            >
              <span className="rounded-full border border-emerald-400/70 bg-emerald-400/15 px-2 py-0.5 text-[10px] font-medium text-emerald-100 live-pulse">
                Live
              </span>
              <button
                onClick={onToggle}
                title="Collapse sidebar"
                className="flex items-center justify-center w-7 h-7 cursor-pointer rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                <PanelLeftClose size={15} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapsed: expand button appears below the logo */}
        {collapsed && (
          <button
            onClick={onToggle}
            title="Expand sidebar"
            className="flex items-center justify-center w-8 h-8 cursor-pointer rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-200"
          >
            <PanelLeftOpen size={16} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 py-3 overflow-y-auto space-y-5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {menus.map((group, idx) => (
          <nav key={idx} className="space-y-1.5">
            <AnimatePresence initial={false}>
              {!collapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="px-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400/80"
                >
                  {group.section}
                </motion.p>
              )}
            </AnimatePresence>
            {collapsed && (
              <div className="border-t border-slate-700/40 mb-1" />
            )}

            <ul className="space-y-1">
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
      <div className="border-t border-slate-800/80 px-3 py-4">
        <div
          className={`flex items-center gap-3 ${collapsed ? "justify-center" : "justify-between"
            }`}
        >
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs font-semibold uppercase text-slate-100"
            title={collapsed ? user.name : undefined}
          >
            {user.name?.slice(0, 2) || "CR"}
          </div>

          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-between gap-2 flex-1 overflow-hidden"
              >
                <div className="leading-tight min-w-0">
                  <p className="text-xs font-medium text-slate-100 truncate">{user.name}</p>
                  <p className="text-[11px] text-slate-400 capitalize">{user.role} role</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Link
                    href="/dashboard/profile"
                    title="View Profile"
                    className="flex items-center justify-center w-7 h-7 rounded-full border border-slate-700/80 bg-slate-900/80 text-slate-300 hover:text-blue-300 hover:border-blue-500/60 hover:bg-blue-500/10 transition-all duration-200"
                  >
                    <User size={13} />
                  </Link>
                  <button
                    onClick={async () => {
                      await logout();
                      router.push("/login");
                    }}
                    className="shrink-0 text-[11px] font-medium text-slate-300 hover:text-rose-300 rounded-full border border-slate-700/80 bg-slate-900/80 px-3 py-1 transition hover:border-rose-500/80 hover:bg-rose-500/10 whitespace-nowrap"
                  >
                    Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────── Desktop Sidebar ─────────────────────────────── */
export default function Sidebar({ collapsed, onToggle }) {
  return (
    <SidebarContext.Provider value={{ collapsed }}>
      <motion.aside
        animate={{ width: collapsed ? 72 : 320 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="hidden lg:flex fixed z-20 h-screen flex-col border-r border-slate-800/60 bg-gradient-to-b from-blue-950 via-blue-900 to-slate-950 text-slate-50 overflow-hidden"
      >
        <SidebarContent onToggle={onToggle} />
      </motion.aside>
    </SidebarContext.Provider>
  );
}

/* ─────────────────────────────── Mobile Sidebar ─────────────────────────────── */
export function MobileSidebar({ open, onClose }) {
  if (!open) return null;

  return (
    <SidebarContext.Provider value={{ collapsed: false }}>
      <div className="fixed inset-0 z-40 flex lg:hidden">
        {/* Overlay matches absolute inset-0 to cover screen */}
        <button
          type="button"
          aria-label="Close menu"
          className="absolute inset-0 bg-black/30 backdrop-blur-sm w-full h-full"
          onClick={onClose}
        />
        {/* Aside stays stacked above due to relative positioning */}
        <aside className="w-72 max-w-[80%] min-h-full flex flex-col border-r border-slate-800 bg-gradient-to-b from-blue-950 via-blue-900 to-slate-950 text-slate-50 shadow-2xl relative z-10">
          <SidebarContent onNavigate={onClose} />
        </aside>
      </div>
    </SidebarContext.Provider>
  );
}
