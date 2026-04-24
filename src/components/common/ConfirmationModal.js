import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, CheckCircle2, X } from "lucide-react";

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  type = "delete", // 'delete', 'close', 'success'
  confirmText = "Yes, Action",
  cancelText = "Keep It"
}) => {
  const isSuccess = type === "success";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#1e293b]/40 backdrop-blur-[2px]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-[400px] bg-white rounded-[2rem] p-10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] text-center overflow-hidden"
          >
            <div className="flex justify-center mb-6">
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center 
                ${type === 'delete' ? 'bg-[#fff1f1] text-[#e60000]' : 
                  isSuccess ? 'bg-[#f0fdf4] text-[#16a34a]' : 
                  'bg-[#f0f9ff] text-[#0ea5e9]'}`}>
                {type === 'delete' ? <Trash2 className="w-10 h-10" /> : <CheckCircle2 className="w-10 h-10" />}
              </div>
            </div>

            <h3 className="text-[1.75rem] font-black text-[#1e293b] mb-4 tracking-tight leading-tight">
              {title}
            </h3>
            <p className="text-[#64748b] font-medium leading-relaxed mb-10 px-2 text-[0.95rem]">
              {message}
            </p>

            <div className={`grid ${isSuccess ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}>
              {!isSuccess && (
                <button
                  onClick={onClose}
                  className="px-6 py-4 bg-[#eff3f7] text-[#475569] rounded-2xl text-[0.95rem] font-bold transition-all active:scale-95 hover:bg-[#e2e8f0]"
                >
                  {cancelText}
                </button>
              )}
              <button
                onClick={() => {
                  if (onConfirm) onConfirm();
                  onClose();
                }}
                className={`px-6 py-4 text-white rounded-2xl text-[0.95rem] font-bold transition-all active:scale-95 shadow-md
                  ${type === 'delete' ? 'bg-[#e60000] hover:bg-[#cc0000]' : 
                    isSuccess ? 'bg-[#16a34a] hover:bg-[#15803d]' : 
                    'bg-[#1a2e7a] hover:bg-[#111e54]'}`}
              >
                {isSuccess ? "Great!" : confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;
