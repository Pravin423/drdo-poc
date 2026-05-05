import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, User, Landmark, ShieldCheck, Mail, Phone, Calendar, CreditCard, Hash } from "lucide-react";
import { FormModal, FormHeader, FormInfo } from "@/components/common/FormUI";
import StatusToggle from "./StatusToggle";

export default function CrpViewModal({ isOpen, onClose, viewCRPData, isViewLoading, onPreviewImage, fetchCRPs, onStatusChange }) {

  return (
    <FormModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-xl">
        <FormHeader 
            title="CRP Profile"
            subtitle="Detailed Community Resource Person overview"
            icon={Eye}
            onClose={onClose}
        />

        <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
            {isViewLoading ? (
                <div className="flex flex-col items-center justify-center py-16">
                    <motion.div 
                        animate={{ scale: [1, 1.2, 1], opacity: [1, 0.4, 1] }} 
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="w-16 h-16 rounded-3xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4"
                    >
                        <Eye size={32} />
                    </motion.div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Fetching Profile...</p>
                </div>
            ) : viewCRPData?.error ? (
                <div className="text-center py-10">
                    <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 mx-auto mb-3">
                        <X size={24} />
                    </div>
                    <p className="text-rose-500 font-bold text-sm">{viewCRPData.error}</p>
                </div>
            ) : viewCRPData && (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="space-y-8"
                >
                    {/* Header Profile Card - Light Clean Version */}
                    <div className="relative group p-6 rounded-[32px] bg-slate-50 border border-slate-100 overflow-hidden shadow-sm">
                        {/* Decorative Background Accent */}
                        <div className="absolute -right-6 -bottom-6 opacity-[0.03] -rotate-12 transition-transform group-hover:rotate-0 duration-700 pointer-events-none">
                            <User size={160} />
                        </div>

                        <div className="relative flex items-center gap-6">
                            <div className="relative">
                                <motion.img
                                    whileHover={{ scale: 1.05 }}
                                    src={viewCRPData.image || `https://i.pravatar.cc/100?u=${viewCRPData.id}`}
                                    alt={viewCRPData.name}
                                    onClick={() => onPreviewImage(viewCRPData.image || `https://i.pravatar.cc/100?u=${viewCRPData.id}`)}
                                    className="w-20 h-20 rounded-[24px] object-cover border-4 border-white shadow-xl shadow-slate-200/50 cursor-pointer"
                                />
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-emerald-500 border-2 border-white flex items-center justify-center shadow-lg">
                                    <ShieldCheck size={12} className="text-white" />
                                </div>
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-xl font-bold text-slate-900 leading-none">{viewCRPData.name}</h3>
                                <div className="mt-2.5 flex items-center gap-2">
                                    <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-wider border border-indigo-100">
                                        ID: {viewCRPData.id}
                                    </span>
                                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                                    <span className="text-[11px] font-bold text-slate-400">Community Resource Person</span>
                                </div>
                                <div className="mt-4 flex flex-col gap-2">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Status Control</p>
                                    <StatusToggle
                                        id={viewCRPData.numericId}
                                        currentStatus={viewCRPData.status}
                                        onStatusChange={onStatusChange}
                                        fetchList={fetchCRPs}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Information Grid */}
                    <div className="space-y-6">
                        {/* Section: Personal */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 px-1">
                                <div className="w-1 h-3 rounded-full bg-indigo-500" />
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Personal Details</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <FormInfo label="Aadhaar Number" value={viewCRPData.aadhaar} icon={Hash} />
                                <FormInfo label="Mobile Contact" value={viewCRPData.mobile} icon={Phone} />
                                <div className="col-span-2">
                                    <FormInfo label="Email Address" value={viewCRPData.email} icon={Mail} />
                                </div>
                                <FormInfo label="Gender" value={viewCRPData.gender} icon={User} />
                                <FormInfo label="Date of Birth" value={viewCRPData.dob} icon={Calendar} />
                            </div>
                        </div>

                        {/* Section: Financial */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 px-1">
                                <div className="w-1 h-3 rounded-full bg-indigo-500" />
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Financial Details</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="col-span-2">
                                    <FormInfo label="Bank Name" value={viewCRPData.bankName} icon={Landmark} />
                                </div>
                                <FormInfo label="Branch" value={viewCRPData.branchName} icon={Landmark} />
                                <FormInfo label="IFSC Code" value={viewCRPData.ifsc} icon={Hash} />
                                <FormInfo label="Account Number" value={viewCRPData.accountNumber} icon={CreditCard} />
                                <FormInfo label="PAN Number" value={viewCRPData.pan} icon={Hash} />
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>

        <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex justify-end">
            <button 
                onClick={onClose}
                className="px-8 py-3.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all active:scale-[0.98] shadow-sm"
            >
                Close Profile
            </button>
        </div>
    </FormModal>
  );
}

