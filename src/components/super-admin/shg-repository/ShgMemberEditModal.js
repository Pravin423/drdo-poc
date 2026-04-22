"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, User, Phone, Activity, Edit } from "lucide-react";

export default function ShgMemberEditModal({
  isOpen,
  onClose,
  editMemberData,
  setEditMemberData,
  handleSubmit,
  isUpdatingMember
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200/80 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="relative h-28 bg-gradient-to-r from-slate-800 to-slate-900 px-6 flex items-center gap-4 overflow-hidden">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white opacity-5 rounded-full blur-xl"></div>
              <div className="w-14 h-14 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center text-white font-black text-xl shrink-0">
                {editMemberData.member_name ? editMemberData.member_name.charAt(0).toUpperCase() : <User size={24} />}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white">Edit Member</h2>
                <p className="text-slate-400 text-xs mt-0.5 truncate">{editMemberData.member_name || "Member Details"}</p>
              </div>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Form Body */}
            <div className="p-6 bg-slate-50/50">
              <form id="edit-member-form" onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Member Name <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User size={16} />
                    </div>
                    <input
                      type="text"
                      value={editMemberData.member_name}
                      onChange={(e) => setEditMemberData(prev => ({ ...prev, member_name: e.target.value }))}
                      placeholder="Full Name"
                      required
                      className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Mobile Number <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Phone size={16} />
                    </div>
                    <input
                      type="tel"
                      value={editMemberData.mobile_no}
                      onChange={(e) => setEditMemberData(prev => ({ ...prev, mobile_no: e.target.value }))}
                      placeholder="10-digit number"
                      maxLength={10}
                      required
                      className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Designation <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Activity size={16} />
                    </div>
                    <input
                      type="text"
                      value={editMemberData.designation}
                      onChange={(e) => setEditMemberData(prev => ({ ...prev, designation: e.target.value }))}
                      placeholder="Role (e.g., President)"
                      required
                      className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all shadow-sm"
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-white flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 font-semibold text-sm rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="edit-member-form"
                disabled={isUpdatingMember}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isUpdatingMember ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <Edit size={16} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
