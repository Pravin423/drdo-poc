import { motion } from "framer-motion";
import { X, Eye, User, Mail, Phone, Calendar, Shield, MapPin, CheckCircle, Map } from "lucide-react";
import { FormModal, FormHeader, FormInfo } from "../../common/FormUI";
import StatusToggle from "../crp/StatusToggle";

export default function UserViewModal({ isOpen, onClose, userData, isLoading, onStatusChange, fetchList }) {
  return (
    <FormModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-2xl">
      <FormHeader 
        title="User Profile Details"
        subtitle="Detailed system user overview"
        icon={Eye}
        onClose={onClose}
      />

      <div 
        className="p-8 max-h-[75vh] overflow-y-auto custom-scrollbar overscroll-contain transform-gpu" 
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [1, 0.4, 1] }} 
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-16 h-16 rounded-3xl bg-tech-blue-50 flex items-center justify-center text-tech-blue-600 mb-4"
            >
              <Eye size={32} />
            </motion.div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest animate-pulse">Fetching Profile Information...</p>
          </div>
        ) : !userData ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 mx-auto mb-3">
              <X size={24} />
            </div>
            <p className="text-rose-500 font-black text-sm">Failed to load user profile.</p>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 12 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="space-y-8"
          >
            {/* Header Profile Overview Card */}
            <div className="relative group p-6 rounded-[2rem] bg-slate-50 border border-slate-100 overflow-hidden shadow-sm flex items-center gap-6">
              <div className="absolute -right-8 -bottom-8 opacity-[0.03] -rotate-12 transition-transform group-hover:rotate-0 duration-700 pointer-events-none">
                <User size={160} />
              </div>

              <div className="relative">
                {userData.profile ? (
                  <img 
                    src={userData.profile} 
                    alt={userData.fullname} 
                    className="w-24 h-24 rounded-[2rem] object-cover border-4 border-white shadow-xl shadow-slate-200/50"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-tech-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-black border-4 border-white shadow-xl shadow-slate-200/50">
                    {(userData.fullname || "?").slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-xl ${userData.status === "Active" ? "bg-emerald-500" : "bg-rose-500"} border-2 border-white flex items-center justify-center shadow-lg text-white`}>
                  <CheckCircle size={14} />
                </div>
              </div>

              <div className="min-w-0">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">{userData.fullname || "—"}</h3>
                <div className="mt-2 flex flex-wrap items-center gap-2.5">
                  <span className="px-3 py-1 rounded-lg bg-tech-blue-50 text-tech-blue-700 text-[10px] font-black uppercase tracking-widest border border-tech-blue-100">
                    {userData.role_name || userData.rolename || "USER"}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-slate-300" />
                  <span className="text-[11px] font-bold text-slate-400 whitespace-nowrap">Emp ID: {userData.id}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300" />
                  <span className={`px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-md border ${
                    userData.signature_status === "Approved" 
                      ? "bg-emerald-50 border-emerald-100 text-emerald-600" 
                      : userData.signature_status === "Rejected"
                      ? "bg-rose-50 border-rose-100 text-rose-600"
                      : "bg-amber-50 border-amber-100 text-amber-600"
                  }`}>
                    {userData.signature_status || "Pending"}
                  </span>
                </div>
                
                <div className="mt-5 space-y-1.5">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Status Control</p>
                  <StatusToggle
                    id={userData.id}
                    currentStatus={userData.status}
                    onStatusChange={onStatusChange}
                    fetchList={fetchList}
                  />
                </div>
              </div>
            </div>

            {/* Identity Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 px-1">
                <div className="w-1.5 h-3.5 rounded-full bg-tech-blue-500" />
                <p className="text-xs font-black text-slate-800 uppercase tracking-widest">Identity & Contact</p>
              </div>
              <div className="grid grid-cols-2 gap-4 bg-white p-6 border border-slate-100 rounded-[2rem]">
                <div className="col-span-2 md:col-span-1">
                  <FormInfo label="Mobile Number" value={userData.mobile} icon={Phone} />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <FormInfo label="Email Address" value={userData.email} icon={Mail} />
                </div>
                <FormInfo label="Gender" value={userData.gender} icon={User} />
                <FormInfo label="Date of Birth" value={userData.date_of_birth || userData.dob || "—"} icon={Calendar} />
              </div>
            </div>

            {/* Territory / Permissions Mapping */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 px-1">
                <div className="w-1.5 h-3.5 rounded-full bg-tech-blue-500" />
                <p className="text-xs font-black text-slate-800 uppercase tracking-widest">Operations Mapping</p>
              </div>
              <div className="grid grid-cols-2 gap-4 bg-white p-6 border border-slate-100 rounded-[2rem]">
                <div className="col-span-2">
                  <FormInfo label="Assigned District" value={userData.district_name || userData.district || "All Districts"} icon={MapPin} />
                </div>
                
                <div className="col-span-2 space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Map size={12} /> Assigned Talukas
                  </p>
                  {userData.talukas && userData.talukas.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {userData.talukas.map((t, i) => (
                        <span key={i} className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-50 border border-slate-100 rounded-xl shadow-sm">
                          {t.taluka_name || t.name || t}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm font-medium text-slate-500 bg-slate-50 p-3.5 rounded-xl border border-dashed border-slate-200">
                      No specific talukas mapped. (All Talukas assigned or None selected)
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Meta info */}
            <div className="flex justify-between items-center px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest pt-2">
              <p>Joined System: {userData.joined || userData.created_at?.split("T")[0] || "—"}</p>
            </div>
          </motion.div>
        )}
      </div>

      <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex justify-end">
        <button 
          onClick={onClose}
          className="px-8 py-3 text-sm font-extrabold text-slate-600 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 hover:text-slate-800 hover:shadow-md transition-all active:scale-95"
        >
          Close Overview
        </button>
      </div>
    </FormModal>
  );
}
