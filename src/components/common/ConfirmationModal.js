import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, CheckCircle2, X, AlertCircle } from "lucide-react";
import { createPortal } from "react-dom";

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  type = "delete", // 'delete', 'success', 'warning'
  confirmText = "Yes, Delete",
  cancelText = "Keep It",
  isLoading = false,
  children 
}) => {
  if (typeof window === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          {/* Backdrop with very subtle blur to match screenshot feel */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#1e293b]/40 backdrop-blur-[2px]"
          />
          
          {/* Modal Content - Very rounded corners [48px] */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative w-full max-w-[420px] bg-white rounded-[40px] p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] text-center overflow-hidden border border-slate-100"
          >
            {/* Top Icon - Soft rounded background */}
            <div className="flex justify-center mb-8">
              <div className={`w-24 h-24 rounded-[32px] flex items-center justify-center
                ${type === 'delete' ? 'bg-[#fff1f1] text-[#ee0000]' : 
                  type === 'success' ? 'bg-[#f0fdf4] text-[#16a34a]' : 
                  'bg-[#f0f9ff] text-[#0ea5e9]'}`}>
                {type === 'delete' ? (
                  <Trash2 className="w-10 h-10 stroke-[2]" />
                ) : type === 'success' ? (
                  <CheckCircle2 className="w-10 h-10 stroke-[2]" />
                ) : (
                  <AlertCircle className="w-10 h-10 stroke-[2]" />
                )}
              </div>
            </div>

            {/* Typography - Matching exact screenshot colors/spacing */}
            <div className="space-y-4 mb-10">
              <h3 className="text-[26px] font-bold text-[#1a2b4b] tracking-tight leading-tight">
                {title}
              </h3>
              <p className="text-[#677788] font-medium leading-relaxed px-2 text-[15px]">
                {message}
              </p>
            </div>

            {/* Custom Content Area */}
            {children && (
              <div className="mb-8 text-left">
                {children}
              </div>
            )}

            {/* Actions - Matching button styles exactly */}
            <div className="flex items-center gap-4">
              <button
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 py-4.5 bg-[#f0f5f9] text-[#4a5568] rounded-[20px] text-[15px] font-bold transition-all hover:bg-[#e2e8f0] active:scale-95 disabled:opacity-50"
              >
                {cancelText}
              </button>
              
              <button
                onClick={() => {
                  if (onConfirm) onConfirm();
                }}
                disabled={isLoading}
                className={`flex-1 py-4.5 text-white rounded-[20px] text-[15px] font-bold transition-all active:scale-95 shadow-lg
                  ${type === 'delete' ? 'bg-[#ee0000] shadow-[0_8px_16px_-4px_rgba(238,0,0,0.25)] hover:bg-[#cc0000]' : 
                    type === 'success' ? 'bg-[#16a34a] shadow-[0_8px_16px_-4px_rgba(22,163,74,0.25)] hover:bg-[#15803d]' : 
                    'bg-[#3b52ab] shadow-[0_8px_16px_-4px_rgba(59,82,171,0.25)] hover:bg-[#2a44a1]'}`}
              >
                <div className="flex items-center justify-center gap-2">
                  {isLoading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  <span>{isLoading ? "Wait..." : confirmText}</span>
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
