"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, Users, UserPlus, User, Phone, Edit, Trash2 } from "lucide-react";

export default function ShgRepositoryViewModal({
  isOpen,
  onClose,
  isLoading,
  viewSHGData,
  onAddMember,
  onEditMember,
  onDeleteMember,
  isViewOnly
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.25 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden relative z-10 border border-slate-100"
          >
            <div className="relative h-24 bg-gradient-to-r from-slate-800 to-slate-900 px-6 flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20">
                <Eye className="text-white" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">SHG Details</h3>
                <p className="text-slate-400 text-xs mt-0.5">Full profile information</p>
              </div>
              <button onClick={onClose}
                className="absolute top-5 right-5 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
                <X size={16} />
              </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-700 mb-4" />
                  <p className="text-sm font-semibold">Loading SHG details...</p>
                </div>
              ) : viewSHGData?.error ? (
                <div className="text-center py-10">
                  <p className="text-red-500 font-medium text-sm">{viewSHGData.error}</p>
                </div>
              ) : viewSHGData && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-white border-2 border-slate-100 shadow-md flex items-center justify-center">
                        <Users size={32} className="text-slate-300" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-slate-900">{viewSHGData.shgName}</p>
                        <p className="text-xs text-slate-500 mt-0.5">SHG ID: {viewSHGData.id}</p>
                        <div className="flex gap-2 mt-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${viewSHGData.status === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-500 border-slate-200"}`}>
                            {viewSHGData.status || "—"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right pr-4">
                      <p className="text-3xl font-black text-slate-800">{viewSHGData.memberCount}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Members</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Contact Information</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        { label: "Contact Person", value: viewSHGData.contactPersonName || "—" },
                        { label: "Mobile", value: viewSHGData.contactPersonMobile || "—" },
                        { label: "Created At", value: viewSHGData.timestamp && viewSHGData.timestamp !== "N/A" ? new Date(viewSHGData.timestamp).toLocaleDateString() : "—" },
                      ].map(item => (
                        <div key={item.label} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">{item.label}</p>
                          <p className="text-sm font-semibold text-slate-800 truncate">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Location Information</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        { label: "District", value: viewSHGData.district || "—" },
                        { label: "Taluka", value: viewSHGData.taluka || "—" },
                        { label: "Village", value: viewSHGData.village || "—" },
                      ].map(item => (
                        <div key={item.label} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">{item.label}</p>
                          <p className="text-sm font-semibold text-slate-800 truncate">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">SHG Members</p>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-bold px-2.5 py-0.5 rounded-full">{(viewSHGData.shgMembers || []).length} Members</span>
                        {!isViewOnly && (
                          <button
                            type="button"
                            onClick={() => onAddMember({ id: viewSHGData.id, name: viewSHGData.shgName })}
                            className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20 px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
                          >
                            <UserPlus size={14} /> Add Member
                          </button>
                        )}
                      </div>
                    </div>

                    {(!viewSHGData.shgMembers || viewSHGData.shgMembers.length === 0) ? (
                      <div className="p-6 text-center border border-slate-100 rounded-2xl bg-slate-50/50">
                        <div className="inline-flex items-center justify-center p-3 bg-white rounded-full shadow-sm border border-slate-100 mb-3">
                          <Users size={20} className="text-slate-300" />
                        </div>
                        <p className="text-sm font-semibold text-slate-500 block">No members added yet.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {viewSHGData.shgMembers.map((member, idx) => {
                          const designation = member.designation || member.role || "Member";
                          const isLeader = designation.toLowerCase().includes("president") || designation.toLowerCase().includes("leader") || designation.toLowerCase().includes("secretary");

                          return (
                            <motion.div
                              key={member.id || idx}
                              initial={{ opacity: 0, scale: 0.98, y: 10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              transition={{ delay: idx * 0.05, type: 'spring', stiffness: 300, damping: 20 }}
                              className="group flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm cursor-pointer transition-all duration-200 hover:border-blue-200 hover:bg-blue-50/30"
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 group-hover:border-blue-200 transition-colors">
                                  <User size={20} />
                                </div>
                                <div>
                                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{member.member_name || member.name || "—"}</h4>
                                  <span className={`inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${isLeader ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                                    {designation}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  {(member.mobile_no || member.mobile || member.member_mobile) ? (
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 group-hover:bg-white text-slate-700 rounded-xl text-xs font-semibold border border-slate-100 transition-colors shadow-sm">
                                      <Phone size={12} className="text-blue-500" />
                                      {member.mobile_no || member.mobile || member.member_mobile}
                                    </div>
                                  ) : (
                                    <span className="text-xs text-slate-400 font-medium bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">—</span>
                                  )}
                                </div>

                                {!isViewOnly && (
                                  <div className="flex items-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => onEditMember(member)}
                                      className="p-2 bg-slate-100 hover:bg-blue-100 text-slate-500 hover:text-blue-600 rounded-lg transition-colors border border-transparent hover:border-blue-200"
                                      title="Edit member"
                                    >
                                      <Edit size={14} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => onDeleteMember(member)}
                                      className="p-2 bg-slate-100 hover:bg-red-100 text-slate-500 hover:text-red-600 rounded-lg transition-colors border border-transparent hover:border-red-200"
                                      title="Delete member"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button onClick={onClose}
                className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-xl transition-colors">
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
