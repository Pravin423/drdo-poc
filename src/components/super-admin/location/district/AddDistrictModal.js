import { MapPin, Map, Hash, X, XCircle, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AddDistrictModal({ isOpen, onClose, formData, onChange, onConfirm, formError }) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-md px-4 overflow-y-auto py-8">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-white rounded-[28px] shadow-2xl w-full max-w-lg overflow-hidden relative z-10"
                >
                    {/* Modal Header with Gradient */}
                    <div className="bg-gradient-to-r from-[#1a2e7a] to-[#2a44a1] p-8 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <MapPin className="w-24 h-24 rotate-12" />
                        </div>
                        <div className="relative z-10 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-black tracking-tight">Add District</h2>
                                <p className="text-indigo-100/80 text-sm font-medium mt-1">Register a new district in the system</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all backdrop-blur-sm"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="p-8">
                        {/* Error Message */}
                        <AnimatePresence>
                            {formError && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mb-6 px-5 py-4 bg-rose-50 border border-rose-100 text-rose-600 text-sm font-semibold rounded-2xl flex items-center gap-3"
                                >
                                    <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                                        <XCircle className="w-4 h-4" />
                                    </div>
                                    {formError}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Form Fields */}
                        <div className="space-y-6">
                            {/* District Name */}
                            <div className="space-y-2">
                                <label className="text-[13px] font-bold text-slate-500 uppercase tracking-wider ml-1">District Name</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                        <Map className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="text"
                                        maxLength={100}
                                        placeholder="e.g. North Goa"
                                        value={formData.name}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/[^a-zA-Z\s\-]/g, "");
                                            onChange({ ...formData, name: val });
                                        }}
                                        className={`w-full pl-12 pr-4 py-4 rounded-2xl border bg-slate-50/50 text-[15px] font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all ${
                                            formError?.includes("District Name")
                                                ? "border-rose-300 focus:border-rose-500"
                                                : "border-slate-200 focus:border-indigo-500 focus:bg-white"
                                        }`}
                                    />
                                </div>
                            </div>

                            {/* Census Code */}
                            <div className="space-y-2">
                                <label className="text-[13px] font-bold text-slate-500 uppercase tracking-wider ml-1">Census Code</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                        <Hash className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="text"
                                        maxLength={5}
                                        placeholder="Max 5 digits"
                                        value={formData.censusCode}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, "");
                                            onChange({ ...formData, censusCode: val });
                                        }}
                                        className={`w-full pl-12 pr-4 py-4 rounded-2xl border bg-slate-50/50 text-[15px] font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all ${
                                            formError?.includes("Census Code")
                                                ? "border-rose-300 focus:border-rose-500"
                                                : "border-slate-200 focus:border-indigo-500 focus:bg-white"
                                        }`}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="flex items-center gap-4 mt-10">
                            <button
                                onClick={onClose}
                                className="flex-1 py-4 text-[15px] font-bold text-slate-600 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all active:scale-[0.98]"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onConfirm}
                                className="flex-[1.5] py-4 text-[15px] font-bold text-white bg-gradient-to-r from-[#1a2e7a] to-[#2a44a1] rounded-2xl shadow-xl shadow-indigo-900/20 hover:shadow-2xl hover:shadow-indigo-900/30 hover:-translate-y-0.5 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                <CheckCircle2 className="w-5 h-5" />
                                <span>Confirm &amp; Save</span>
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
