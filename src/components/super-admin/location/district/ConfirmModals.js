import { Save, Trash2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * SaveConfirmModal — confirmation dialog before saving edits.
 */
export function SaveConfirmModal({ isOpen, onClose, onConfirm }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ type: "spring", duration: 0.5, bounce: 0.4 }}
                        className="bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden z-10"
                    >
                        <div className="p-8 text-center flex flex-col items-center">
                            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-5 rotate-3">
                                <Save size={32} />
                            </div>
                            <h3 className="text-xl font-extrabold text-slate-800 mb-2">Confirm Save</h3>
                            <p className="text-sm font-medium text-slate-500 mb-8 px-2">
                                Are you sure you want to save these changes to the district form?
                            </p>
                            <div className="flex gap-3 justify-center w-full">
                                <button
                                    onClick={onClose}
                                    className="flex-1 px-4 py-3 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={onConfirm}
                                    className="flex-1 px-4 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-colors active:scale-95"
                                >
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

/**
 * DeleteConfirmModal — confirmation dialog before deleting a district.
 */
export function DeleteConfirmModal({ isOpen, onClose, onConfirm, isDeleting, deleteError }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        transition={{ type: "spring", duration: 0.5, bounce: 0.4 }}
                        className="bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden z-10"
                    >
                        <div className="p-8 text-center flex flex-col items-center">
                            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-5 -rotate-3">
                                <Trash2 size={32} />
                            </div>
                            <h3 className="text-xl font-extrabold text-slate-800 mb-2">Delete District?</h3>
                            <p className="text-sm font-medium text-slate-500 mb-8">
                                This action cannot be undone. Are you sure you want to permanently delete this district?
                            </p>

                            <AnimatePresence>
                                {deleteError && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="w-full text-sm font-medium text-red-500 bg-red-50 p-3 rounded-xl border border-red-100 mb-6"
                                    >
                                        {deleteError}
                                    </motion.p>
                                )}
                            </AnimatePresence>

                            <div className="flex gap-3 justify-center w-full">
                                <button
                                    onClick={onClose}
                                    disabled={isDeleting}
                                    className="flex-1 px-4 py-3 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50"
                                >
                                    Keep It
                                </button>
                                <button
                                    onClick={onConfirm}
                                    disabled={isDeleting}
                                    className="flex-1 px-4 py-3 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md shadow-red-500/20 transition-colors active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isDeleting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Deleting...
                                        </>
                                    ) : (
                                        "Yes, Delete"
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
