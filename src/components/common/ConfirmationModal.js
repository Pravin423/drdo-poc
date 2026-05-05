import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import { createPortal } from "react-dom";

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  type = "delete", // 'delete', 'success', 'warning'
  confirmText,
  cancelText,
  isLoading = false,
  children 
}) => {
  if (typeof window === 'undefined') return null;

  const isSuccess = type === "success";
  const finalConfirmText = confirmText || (isSuccess ? "Great, Continue" : "Yes, Delete");
  const finalCancelText = cancelText || "Keep It";

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 pointer-events-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-[4px] pointer-events-auto"
          />
          
          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-[440px] bg-white rounded-[40px] p-10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.2)] text-center border border-slate-100 pointer-events-auto"
          >
            {/* Top Icon */}
            <div className="flex justify-center mb-8">
              <div className={`w-24 h-24 rounded-[32px] flex items-center justify-center
                ${type === 'delete' ? 'bg-rose-50 text-rose-500' : 
                  type === 'success' ? 'bg-emerald-50 text-emerald-600' : 
                  'bg-amber-50 text-amber-600'}`}>
                {type === 'delete' ? (
                  <Trash2 className="w-10 h-10 stroke-[2.5]" />
                ) : type === 'success' ? (
                  <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
                ) : (
                  <AlertCircle className="w-10 h-10 stroke-[2.5]" />
                )}
              </div>
            </div>

            {/* Typography */}
            <div className="space-y-4 mb-10">
              <h3 className="text-3xl font-black text-slate-800 tracking-tight leading-tight">
                {title}
              </h3>
              <p className="text-slate-500 font-bold leading-relaxed px-4 text-[15px]">
                {message}
              </p>
            </div>

            {/* Custom Content Area */}
            {children && (
              <div className="mb-8 text-left">
                {children}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-4">
              {!isSuccess && (
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="flex-1 py-4.5 rounded-[20px] text-[11px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all disabled:opacity-50"
                >
                  {finalCancelText}
                </button>
              )}
              
              <button
                onClick={() => {
                  if (onConfirm) onConfirm();
                  onClose();
                }}
                disabled={isLoading}
                className={`${isSuccess ? 'w-full' : 'flex-1'} py-4.5 rounded-[20px] text-[11px] font-black uppercase tracking-widest text-white transition-all active:scale-95 shadow-xl
                  ${type === 'delete' ? 'bg-rose-500 shadow-rose-500/30 hover:bg-rose-600' : 
                    type === 'success' ? 'bg-emerald-600 shadow-emerald-500/30 hover:bg-emerald-700' : 
                    'bg-[#3b52ab] shadow-[#3b52ab]/30 hover:bg-[#1a2e7a]'}`}
              >
                <div className="flex items-center justify-center gap-2">
                  {isLoading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  <span>{isLoading ? "Synchronizing..." : finalConfirmText}</span>
                </div>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default ConfirmationModal;
