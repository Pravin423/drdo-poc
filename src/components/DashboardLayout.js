import { useState } from "react";
import Sidebar, { MobileSidebar } from "./Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, MapPin, RefreshCw, Menu, Activity } from "lucide-react";

export default function DashboardLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] text-slate-900 flex overflow-hidden">
      {/* Navigation */}
      <Sidebar />
      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <main className="flex-1 bg-gray-100 flex flex-col min-w-0 overflow-y-auto">
        <div className="px-4 py-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* 1. Top Compact Status Bar (The "Img" Look) */}
            <motion.header 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between px-4 py-2 bg-white border border-slate-200/60 rounded-xl shadow-sm"
            >
              <div className="flex items-center gap-4">
                {/* Mobile Menu Toggle */}
                <button
                  type="button"
                  className="p-2 -ml-2 text-slate-500 hover:bg-slate-50 rounded-lg md:hidden transition-colors"
                  onClick={() => setMobileOpen(true)}
                >
                  <Menu size={20} />
                </button>

                {/* Identity Badges */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 bg-[#0a3d62] text-white px-3 py-1 rounded-full shadow-sm">
                    <Shield size={12} className="text-blue-300" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Super Admin</span>
                  </div>
                  
                  <div className="h-3 w-px bg-slate-200 mx-1" />
                  
                  <div className="flex items-center gap-1 text-slate-500">
                    <MapPin size={13} />
                    <span className="text-xs font-medium">State Level — <span className="text-slate-900">Goa</span></span>
                  </div>
                </div>
              </div>

              {/* Sync Status */}
              <div className="flex items-center gap-2 text-[10px] sm:text-xs font-medium text-slate-400">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <RefreshCw size={12} className="text-slate-300" />
                </motion.div>
                <span className="hidden sm:inline">Last sync: 2026-01-30</span>
                <span className="text-slate-300 hidden sm:inline">|</span>
                <span>12:15 PM</span>
              </div>
            </motion.header>

            {/* 2. Main Heading Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight"> SuperAdmin Dashboard </h1>
                <p className="text-sm text-slate-500">Monitor CRP activity with a calm, focused workspace.</p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-700">Logged In</span>
              </div>
            </div>

            {/* 3. Main Content Area */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative min-h-[500px] rounded-[2rem] border border-white bg-white/60 shadow-xl shadow-slate-200/50 backdrop-blur-xl overflow-hidden"
            >
              {/* Inner container with padding for children */}
             
                 <div className="bg-white rounded-[1.5rem] border border-slate-100 p-6 shadow-sm min-h-[480px]">
                    {children}
                 </div>
              
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}