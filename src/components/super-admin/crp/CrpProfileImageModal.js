"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function CrpProfileImageModal({ previewImage, onClose }) {
  return (
    <AnimatePresence>
      {previewImage && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm cursor-pointer"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
            className="relative max-w-4xl max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={previewImage}
              alt="Profile Preview"
              className="max-w-[85vw] max-h-[85vh] aspect-square object-cover rounded-full shadow-2xl border-4 border-white"
            />
            <button
              onClick={onClose}
              className="absolute -top-4 -right-4 p-2 bg-white text-slate-900 rounded-full shadow-lg hover:bg-slate-100 transition-colors z-[100000]"
            >
              <X size={20} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
