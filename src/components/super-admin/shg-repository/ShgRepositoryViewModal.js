import { 
  FormModal, FormHeader 
} from "../../common/FormUI";
import { Eye, Users, UserPlus, User, Phone, Edit, Trash2, Calendar, MapPin, ShieldCheck, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

export default function ShgRepositoryViewModal({
  isOpen,
  onClose,
  isLoading,
  viewSHGData,
  onAddMember,
  onEditMember,
  onDeleteMember,
  onStatusToggle,
  isViewOnly
}) {
  return (
    <FormModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-3xl">
      <FormHeader 
        title="SHG Details" 
        subtitle="Full profile information" 
        icon={Eye} 
        onClose={onClose} 
      />
      
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8 overscroll-contain transform-gpu">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-100 border-b-[#3b52ab] mb-6" />
            <p className="text-sm font-black uppercase tracking-widest text-slate-500">Loading SHG Profile...</p>
          </div>
        ) : viewSHGData?.error ? (
          <div className="text-center py-16 bg-rose-50 rounded-[32px] border border-rose-100">
            <ShieldAlert size={48} className="mx-auto text-rose-500 mb-4" />
            <p className="text-rose-600 font-black uppercase tracking-wider">{viewSHGData.error}</p>
          </div>
        ) : viewSHGData && (
          <div className="space-y-10">
            {/* Profile Header Card */}
            <div className="relative group p-8 rounded-[40px] bg-slate-50 border border-slate-100 overflow-hidden">
              <div className="absolute top-0 right-0 p-8">
                <div className="text-right">
                  <p className="text-4xl font-black text-slate-900 leading-none">{viewSHGData.memberCount}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Total Members</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-[32px] bg-white shadow-xl shadow-slate-200 flex items-center justify-center border border-slate-100 group-hover:scale-105 transition-transform duration-500">
                  <Users size={40} className="text-[#3b52ab] opacity-20" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 leading-tight">{viewSHGData.shgName}</h3>
                  <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">SHG ID: {viewSHGData.id}</p>
                  
                  <div className="flex items-center gap-8 mt-6">
                    <div className="flex flex-col">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">SHG Status</p>
                      {!isViewOnly ? (
                        <button
                          onClick={() => onStatusToggle?.(viewSHGData.id, viewSHGData.status === "Active" ? 1 : 0)}
                          className={`px-5 py-2 rounded-2xl text-[11px] font-black tracking-wider transition-all border shadow-sm flex items-center gap-3 active:scale-95 ${
                            viewSHGData.status === "Active" 
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300" 
                              : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 hover:border-rose-300"
                          }`}
                        >
                          <div className={`w-2 h-2 rounded-full ${viewSHGData.status === "Active" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]"}`} />
                          {(viewSHGData.status || "").toUpperCase()}
                        </button>
                      ) : (
                        <span className={`px-4 py-1.5 rounded-xl text-[11px] font-black border uppercase tracking-wider ${viewSHGData.status === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-500 border-slate-200"}`}>
                          {viewSHGData.status}
                        </span>
                      )}
                    </div>
                    <div className="h-10 w-px bg-slate-200" />
                    <div className="flex flex-col">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Quick Action</p>
                      <p className="text-[11px] font-bold text-slate-500 leading-tight">
                        Click to {viewSHGData.status === "Active" ? "deactivate" : "activate"} account
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <section>
                <div className="flex items-center gap-2 mb-4 px-2">
                  <ShieldCheck size={14} className="text-[#3b52ab]" />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Information</p>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "Contact Person", value: viewSHGData.contactPersonName || "—", icon: User },
                    { label: "Mobile", value: viewSHGData.contactPersonMobile || "—", icon: Phone },
                    { label: "Created At", value: viewSHGData.timestamp && viewSHGData.timestamp !== "N/A" ? new Date(viewSHGData.timestamp).toLocaleDateString() : "—", icon: Calendar },
                  ].map(item => (
                    <div key={item.label} className="p-4 rounded-[24px] bg-white border border-slate-100 hover:border-indigo-100 transition-colors flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                        <item.icon size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                        <p className="text-sm font-black text-slate-900 truncate">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-4 px-2">
                  <MapPin size={14} className="text-[#3b52ab]" />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location Information</p>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "District", value: viewSHGData.district || "—" },
                    { label: "Taluka", value: viewSHGData.taluka || "—" },
                    { label: "Village", value: viewSHGData.village || "—" },
                  ].map(item => (
                    <div key={item.label} className="p-4 rounded-[24px] bg-white border border-slate-100 hover:border-indigo-100 transition-colors flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 font-black text-xs">
                        {item.label.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                        <p className="text-sm font-black text-slate-900 truncate">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Members Section */}
            <section>
              <div className="flex items-center justify-between mb-6 px-2">
                <div className="flex items-center gap-3">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SHG Members</p>
                  <span className="bg-indigo-50 text-[#3b52ab] border border-indigo-100 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                    {(viewSHGData.shgMembers || []).length} Total
                  </span>
                </div>
                {!isViewOnly && (
                  <button
                    type="button"
                    onClick={() => onAddMember({ id: viewSHGData.id, name: viewSHGData.shgName })}
                    className="bg-[#3b52ab] hover:bg-[#2d418a] text-white shadow-xl shadow-indigo-200 px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 active:scale-95"
                  >
                    <UserPlus size={16} /> Add Member
                  </button>
                )}
              </div>

              {(!viewSHGData.shgMembers || viewSHGData.shgMembers.length === 0) ? (
                <div className="p-12 text-center border-2 border-dashed border-slate-100 rounded-[40px] bg-slate-50/30">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-[24px] shadow-sm border border-slate-100 mb-4">
                    <Users size={28} className="text-slate-300" />
                  </div>
                  <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No members registered yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {viewSHGData.shgMembers.map((member, idx) => {
                    const designation = member.designation || member.role || "Member";
                    const isLeader = designation.toLowerCase().match(/president|leader|secretary|head/);

                    return (
                      <motion.div
                        key={member.id || idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="group flex items-center justify-between p-5 bg-white border border-slate-100 rounded-[32px] hover:border-indigo-200 hover:shadow-xl hover:shadow-slate-100 transition-all duration-300"
                      >
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-[#3b52ab] group-hover:border-indigo-100 transition-all duration-500">
                            <User size={24} />
                          </div>
                          <div>
                            <h4 className="text-base font-black text-slate-900 group-hover:text-[#3b52ab] transition-colors">{member.member_name || member.name || "—"}</h4>
                            <span className={`inline-block mt-1 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${isLeader ? 'bg-indigo-50 text-[#3b52ab] border-indigo-100 shadow-sm' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>
                              {designation}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          {(member.mobile_no || member.mobile) && (
                            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-50 group-hover:bg-white text-slate-700 rounded-2xl text-[11px] font-black uppercase tracking-wider border border-slate-100 shadow-sm transition-all">
                              <Phone size={14} className="text-[#3b52ab]" />
                              {member.mobile_no || member.mobile}
                            </div>
                          )}

                          {!isViewOnly && (
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                              <button
                                type="button"
                                onClick={() => onEditMember(member)}
                                className="w-10 h-10 flex items-center justify-center bg-white hover:bg-indigo-50 text-slate-400 hover:text-[#3b52ab] rounded-xl transition-all border border-slate-100 hover:border-indigo-200 shadow-sm"
                                title="Edit member"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                type="button"
                                onClick={() => onDeleteMember(member)}
                                className="w-10 h-10 flex items-center justify-center bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl transition-all border border-slate-100 hover:border-rose-200 shadow-sm"
                                title="Delete member"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        )}

        <div className="mt-12 flex justify-end">
          <button 
            onClick={onClose}
            className="px-10 py-3.5 text-sm font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-[20px] transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </FormModal>
  );
}
