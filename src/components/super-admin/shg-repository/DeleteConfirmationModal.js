"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2 } from "lucide-react";

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  title,
  message,
  onConfirm,
  isDeleting,
  confirmLabel = "Yes, Delete"
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
          >
            {/* Red danger header */}
            <div className="bg-red-50 px-6 pt-6 pb-5 flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-red-100 border border-red-200 rounded-full flex items-center justify-center mb-4">
                <Trash2 size={26} className="text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">{title}</h3>
              <div className="text-sm text-slate-500 mt-2 leading-relaxed">
                {message}
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 py-4 flex gap-3 border-t border-slate-100 bg-white">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    {confirmLabel}
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
