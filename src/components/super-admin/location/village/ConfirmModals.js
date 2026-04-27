import { Save, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function SaveConfirmModal({ isOpen, onClose, onConfirm }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ type: "spring", duration: 0.5, bounce: 0.4 }}
                        className="bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden z-10"
                    >
                        <div className="p-8 text-center flex flex-col items-center">
                            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-5 rotate-3">
                                <Save size={32} />
                            </div>
                            <h3 className="text-xl font-extrabold text-slate-800 mb-2">Confirm Save</h3>
                            <p className="text-sm font-medium text-slate-500 mb-8 px-2">
                                Are you sure you want to save these changes to the village record?
                            </p>
                            <div className="flex gap-3 justify-center w-full">
                                <button onClick={onClose} className="flex-1 px-4 py-3 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
                                    Cancel
                                </button>
                                <button onClick={onConfirm} className="flex-1 px-4 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-colors active:scale-95">
                                    Yes, Save
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

export function DeleteConfirmModal({ isOpen, onClose, onConfirm, isDeleting, deleteError, title, message }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        transition={{ type: "spring", duration: 0.5, bounce: 0.4 }}
                        className="bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden z-10"
                    >
                        <div className="p-8 text-center flex flex-col items-center">
                            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-5 -rotate-3">
                                <Trash2 size={32} />
                            </div>
                            <h3 className="text-xl font-extrabold text-slate-800 mb-2">{title || "Delete Record?"}</h3>
                            <p className="text-sm font-medium text-slate-500 mb-8">
                                {message || "This action cannot be undone. Are you sure you want to permanently delete this record?"}
                            </p>
                            <AnimatePresence>
                                {deleteError && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                        className="w-full text-sm font-medium text-red-500 bg-red-50 p-2.5 rounded-lg border border-red-100 mb-6 text-center"
                                    >
                                        {deleteError}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                            <div className="flex gap-3 justify-center w-full">
                                <button onClick={onClose} disabled={isDeleting} className="flex-1 px-4 py-3 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50">
                                    Keep It
                                </button>
                                <button onClick={onConfirm} disabled={isDeleting} className="flex-1 px-4 py-3 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md shadow-red-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                    {isDeleting ? (
                                        <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Deleting...</>
                                    ) : "Yes, Delete"}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

export function SuccessModal({ isOpen, onClose, title, message }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        transition={{ type: "spring", duration: 0.5, bounce: 0.4 }}
                        className="bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden z-10"
                    >
                        <div className="p-8 text-center flex flex-col items-center">
                            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-5 rotate-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle-2"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
                            </div>
                            <h3 className="text-xl font-extrabold text-slate-800 mb-2">{title || "Success!"}</h3>
                            <p className="text-sm font-medium text-slate-500 mb-8 px-2">
                                {message || "The action was completed successfully."}
                            </p>
                            <button onClick={onClose} className="w-full px-4 py-3 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-500/20 transition-colors active:scale-95">
                                Continue
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
