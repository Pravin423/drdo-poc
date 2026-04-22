"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Eye } from "lucide-react";
import StatusToggle from "./StatusToggle";

export default function CrpViewModal({ isOpen, onClose, viewCRPData, isViewLoading, onPreviewImage, fetchCRPs }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.25 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden relative z-10 border border-slate-100"
          >
            {/* Header */}
            <div className="relative h-24 bg-gradient-to-r from-slate-800 to-slate-900 px-6 flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20">
                <Eye className="text-white" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">CRP Details</h3>
                <p className="text-slate-400 text-xs mt-0.5">Full profile information</p>
              </div>
              <button onClick={onClose}
                className="absolute top-5 right-5 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              {isViewLoading ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-700 mb-4" />
                  <p className="text-sm font-semibold">Loading CRP details...</p>
                </div>
              ) : viewCRPData?.error ? (
                <div className="text-center py-10">
                  <p className="text-red-500 font-medium text-sm">{viewCRPData.error}</p>
                </div>
              ) : viewCRPData && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  {/* Profile row */}
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <img
                      src={viewCRPData.image || `https://i.pravatar.cc/80?u=${viewCRPData.id}`}
                      alt={viewCRPData.name}
                      onClick={() => onPreviewImage(viewCRPData.image || `https://i.pravatar.cc/80?u=${viewCRPData.id}`)}
                      className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md cursor-pointer hover:scale-105 transition-transform"
                    />
                    <div>
                      <p className="text-lg font-bold text-slate-900">{viewCRPData.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">CRP ID: {viewCRPData.id}</p>
                      <div className="flex flex-col gap-2 mt-2">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Adjust Status</p>
                        <StatusToggle
                          id={viewCRPData.numericId}
                          currentStatus={viewCRPData.status}
                          onStatusChange={(newStatus) => {/* handled by parent via fetchCRPs */}}
                          fetchList={fetchCRPs}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Personal Info */}
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Personal Information</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        { label: "Aadhaar", value: viewCRPData.aadhaar || "—" },
                        { label: "Mobile", value: viewCRPData.mobile || "—" },
                        { label: "Email", value: viewCRPData.email || "—" },
                        { label: "Gender", value: viewCRPData.gender || "—" },
                        { label: "DOB", value: viewCRPData.dob || "—" },
                      ].map((item) => (
                        <div key={item.label} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">{item.label}</p>
                          <p className="text-sm font-semibold text-slate-800 truncate">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Financial Info */}
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Financial Information</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        { label: "Bank Name", value: viewCRPData.bankName || "—" },
                        { label: "Branch Name", value: viewCRPData.branchName || "—" },
                        { label: "Acct. Number", value: viewCRPData.accountNumber || "—" },
                        { label: "IFSC", value: viewCRPData.ifsc || "—" },
                        { label: "PAN", value: viewCRPData.pan || "—" },
                      ].map((item) => (
                        <div key={item.label} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">{item.label}</p>
                          <p className="text-sm font-semibold text-slate-800 truncate">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Footer */}
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
