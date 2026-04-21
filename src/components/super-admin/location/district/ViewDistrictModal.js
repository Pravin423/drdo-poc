import { Eye, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ViewDistrictModal({ isOpen, onClose, districtData, isLoading }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                        className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative z-10"
                    >
                        {/* Header */}
                        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <Eye className="text-emerald-500" size={18} /> District Details
                            </h3>
                            <button
                                onClick={onClose}
                                className="text-slate-400 hover:text-slate-600 bg-white hover:bg-slate-100 p-1.5 rounded-full border border-slate-200 transition-colors shadow-sm"
                            >
                                <X size={16} className="stroke-2" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6">
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mb-3" />
                                    <p className="text-sm font-semibold">Loading details...</p>
                                </div>
                            ) : districtData?.error ? (
                                <div className="text-center py-6">
                                    <p className="text-red-500 font-medium text-sm">{districtData.error}</p>
                                </div>
                            ) : districtData && (
                                <div className="space-y-4">
                                    {[
                                        { label: "District ID", value: districtData.id },
                                        { label: "District Name", value: districtData.name },
                                        { label: "Census Code", value: districtData.censusCode },
                                    ].map(({ label, value }) => (
                                        <div key={label} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
                                            <p className="text-base font-semibold text-slate-900">{value}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                            <button
                                onClick={onClose}
                                className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-xl transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
