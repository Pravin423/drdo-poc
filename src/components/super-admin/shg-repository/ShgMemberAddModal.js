"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, UserPlus, User, Phone, Activity, Plus, UploadCloud, Users } from "lucide-react";

export default function ShgMemberAddModal({
  isOpen,
  onClose,
  shg,
  addMembersList,
  handleMemberChange,
  addMemberRow,
  removeMemberRow,
  handleSubmit,
  isAddingMember
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="bg-white w-full max-w-4xl rounded-xl shadow-2xl border border-slate-200 flex flex-col max-h-full"
          >
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0 rounded-t-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100/50">
                  <UserPlus size={24} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Add Members</h2>
                  <p className="text-sm text-slate-500 mt-0.5">Adding members to SHG: <span className="font-semibold text-slate-700">{shg?.name}</span></p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50">
              <form id="add-members-form" onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-4">
                
                <div className="hidden md:grid md:grid-cols-[1fr_1fr_1fr_40px] gap-4 px-3 mb-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5"><User size={12} /> Member Name <span className="text-red-500">*</span></label>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5"><Phone size={12} /> Mobile Number <span className="text-red-500">*</span></label>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5"><Activity size={12} /> Designation <span className="text-red-500">*</span></label>
                  <div></div>
                </div>

                <AnimatePresence>
                  {addMembersList.map((member, idx) => (
                    <motion.div 
                      layout
                      key={member.id} 
                      initial={{ opacity: 0, y: -10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, height: 0, overflow: "hidden", marginTop: 0, marginBottom: 0 }}
                      transition={{ duration: 0.2 }}
                      className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_40px] gap-4 items-start bg-white p-4 md:p-3 border border-slate-200 rounded-xl hover:border-blue-200 transition-colors shadow-sm group"
                    >
                      <div className="space-y-1">
                        <label className="block md:hidden text-xs font-bold text-slate-600 flex items-center gap-1.5"><User size={12} /> Name <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <User size={16} />
                          </div>
                          <input
                            type="text"
                            value={member.member_name}
                            onChange={(e) => handleMemberChange(idx, "member_name", e.target.value)}
                            placeholder="Full Name"
                            className={`w-full bg-slate-50/50 border ${member.errors?.member_name ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'} rounded-lg pl-10 pr-3 py-2 text-sm text-slate-900 font-medium focus:bg-white focus:ring-2 outline-none transition-all placeholder:font-normal`}
                          />
                        </div>
                        {member.errors?.member_name && <p className="text-xs text-red-500 mt-1 ml-1">{member.errors.member_name}</p>}
                      </div>
                      
                      <div className="space-y-1">
                        <label className="block md:hidden text-xs font-bold text-slate-600 flex items-center gap-1.5"><Phone size={12} /> Mobile <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Phone size={16} />
                          </div>
                          <input
                            type="tel"
                            value={member.mobile_no}
                            onChange={(e) => handleMemberChange(idx, "mobile_no", e.target.value)}
                            placeholder="10-digit number"
                            maxLength={10}
                            className={`w-full bg-slate-50/50 border ${member.errors?.mobile_no ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'} rounded-lg pl-10 pr-3 py-2 text-sm text-slate-900 font-medium focus:bg-white focus:ring-2 outline-none transition-all placeholder:font-normal`}
                          />
                        </div>
                        {member.errors?.mobile_no && <p className="text-xs text-red-500 mt-1 ml-1">{member.errors.mobile_no}</p>}
                      </div>

                      <div className="space-y-1">
                        <label className="block md:hidden text-xs font-bold text-slate-600 flex items-center gap-1.5"><Activity size={12} /> Designation <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Activity size={16} />
                          </div>
                          <input
                            type="text"
                            value={member.designation}
                            onChange={(e) => handleMemberChange(idx, "designation", e.target.value)}
                            placeholder="Role (e.g., President)"
                            className={`w-full bg-slate-50/50 border ${member.errors?.designation ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'} rounded-lg pl-10 pr-3 py-2 text-sm text-slate-900 font-medium focus:bg-white focus:ring-2 outline-none transition-all placeholder:font-normal`}
                          />
                        </div>
                        {member.errors?.designation && <p className="text-xs text-red-500 mt-1 ml-1">{member.errors.designation}</p>}
                      </div>

                      <div className="flex justify-end md:justify-center md:pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {addMembersList.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeMemberRow(idx)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Remove member"
                          >
                            <X size={18} />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <div className="pt-2 px-1">
                  <button
                    type="button"
                    onClick={addMemberRow}
                    className="inline-flex items-center gap-2 px-4 py-2 mt-2 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-sm font-semibold text-slate-700 rounded-lg transition-all shadow-sm"
                  >
                    <Plus size={16} className="text-blue-600" />
                    Add Another Row
                  </button>
                </div>
              </form>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-white shrink-0 flex items-center justify-between rounded-b-xl">
              <div className="text-sm font-semibold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 flex items-center gap-2">
                <Users size={16} className="text-blue-500"/> 
                {addMembersList.length} member{addMembersList.length !== 1 ? 's' : ''} queued
              </div>
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 font-semibold text-sm rounded-lg transition-all shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="add-members-form"
                  disabled={isAddingMember || addMembersList.length === 0}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg transition-all shadow-sm shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isAddingMember ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>
                        <UploadCloud size={16} />
                        Save Members
                      </>
                    )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
