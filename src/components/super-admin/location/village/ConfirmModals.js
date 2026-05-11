import { Save, Trash2, X, AlertTriangle, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function SaveConfirmModal({ isOpen, onClose, onConfirm, isSaving }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", duration: 0.5, bounce: 0.4 }}
                        className="bg-white rounded-[32px] shadow-2xl w-full max-w-sm overflow-hidden relative z-10 border border-slate-100"
                    >
                        <div className="p-8 text-center flex flex-col items-center">
                            <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
                                <Save size={36} className="animate-pulse" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">Confirm Save</h3>
                            <p className="text-[15px] font-medium text-slate-500 mb-8 px-4 leading-relaxed">
                                Are you sure you want to save these changes to the village record?
                            </p>

                            <div className="flex flex-col gap-3 w-full">
                                <button
                                    onClick={onConfirm}
                                    disabled={isSaving}
                                    className="w-full py-4 text-[15px] font-bold text-white bg-gradient-to-r from-[#1a2e7a] to-[#2a44a1] rounded-2xl shadow-xl shadow-indigo-900/20 hover:shadow-2xl hover:-translate-y-0.5 transition-all active:scale-[0.98] disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-2"
                                >
                                    {isSaving ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>Saving...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Save size={18} />
                                            <span>Yes, Save Village</span>
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={onClose}
                                    disabled={isSaving}
                                    className="w-full py-4 text-[15px] font-bold text-slate-500 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all"
                                >
                                    Cancel
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
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        onClick={() => !isDeleting && onClose()}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", duration: 0.5, bounce: 0.4 }}
                        className="bg-white rounded-[32px] shadow-2xl w-full max-w-sm overflow-hidden relative z-10 border border-rose-50"
                    >
                        <div className="p-8 text-center flex flex-col items-center">
                            <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
                                <AlertTriangle size={36} className="animate-bounce" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">{title || "Delete Record?"}</h3>
                            <p className="text-[15px] font-medium text-slate-500 mb-8 px-4 leading-relaxed">
                                {message || "This action cannot be undone. Are you sure you want to permanently delete this record?"}
                            </p>

                            <AnimatePresence>
                                {deleteError && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="w-full text-sm font-semibold text-rose-600 bg-rose-50 p-4 rounded-2xl border border-rose-100 mb-6 flex items-center gap-2"
                                    >
                                        <X size={16} />
                                        <span>{deleteError}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="flex flex-col gap-3 w-full">
                                <button
                                    onClick={onConfirm}
                                    disabled={isDeleting}
                                    className="w-full py-4 text-[15px] font-bold text-white bg-rose-600 rounded-2xl shadow-xl shadow-rose-900/20 hover:shadow-2xl hover:-translate-y-0.5 transition-all active:scale-[0.98] disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-2"
                                >
                                    {isDeleting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>Processing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 size={18} />
                                            <span>Yes, Delete Record</span>
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={onClose}
                                    disabled={isDeleting}
                                    className="w-full py-4 text-[15px] font-bold text-slate-500 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all"
                                >
                                    Keep It
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
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", duration: 0.5, bounce: 0.4 }}
                        className="bg-white rounded-[32px] shadow-2xl w-full max-w-sm overflow-hidden relative z-10 border border-emerald-50"
                    >
                        <div className="p-8 text-center flex flex-col items-center">
                            <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
                                <CheckCircle2 size={36} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">{title || "Success!"}</h3>
                            <p className="text-[15px] font-medium text-slate-500 mb-8 px-4 leading-relaxed">
                                {message || "The action was completed successfully."}
                            </p>
                            <button
                                onClick={onClose}
                                className="w-full py-4 text-[15px] font-bold text-white bg-emerald-600 rounded-2xl shadow-xl shadow-emerald-900/20 hover:shadow-2xl hover:-translate-y-0.5 transition-all active:scale-[0.98]"
                            >
                                Continue
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

