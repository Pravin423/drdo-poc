import { MapPin, Tag, Hash, Map, X, XCircle, CheckCircle2, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AddTalukaModal({
    isOpen,
    onClose,
    formData,
    onChange,
    onConfirm,
    formError,
    isSubmitting,
    districts,
}) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-md px-4 overflow-y-auto py-8">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => !isSubmitting && onClose()}
                    className="absolute inset-0"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-white rounded-[28px] shadow-2xl w-full max-w-lg overflow-hidden relative z-10"
                >
                    {/* Modal Header */}
                    <div className="bg-gradient-to-r from-[#1a2e7a] to-[#2a44a1] p-8 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <MapPin className="w-24 h-24 rotate-12" />
                        </div>
                        <div className="relative z-10 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-black tracking-tight">Add New Taluka</h2>
                                <p className="text-indigo-100/80 text-sm font-medium mt-1">Create a new sub-district entry</p>
                            </div>
                            <button
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all backdrop-blur-sm disabled:opacity-50"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="p-8">
                        {/* Error */}
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

                        <div className="space-y-6">
                            {/* Taluka Name */}
                            <div className="space-y-2">
                                <label className="text-[13px] font-bold text-slate-500 uppercase tracking-wider ml-1">Taluka Name</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                        <Tag className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="text"
                                        maxLength={100}
                                        placeholder="e.g. Tiswadi"
                                        value={formData.name}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/[^a-zA-Z\s\-]/g, "");
                                            onChange({ ...formData, name: val });
                                        }}
                                        className={`w-full pl-12 pr-4 py-4 rounded-2xl border bg-slate-50/50 text-[15px] font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all ${
                                            formError?.includes("Taluka Name")
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

                            {/* Parent District */}
                            <div className="space-y-2">
                                <label className="text-[13px] font-bold text-slate-500 uppercase tracking-wider ml-1">Parent District</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                        <Map className="w-5 h-5" />
                                    </div>
                                    <select
                                        value={formData.districtID}
                                        onChange={(e) => onChange({ ...formData, districtID: e.target.value })}
                                        className={`w-full pl-12 pr-10 py-4 rounded-2xl border bg-slate-50/50 text-[15px] font-semibold text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all appearance-none cursor-pointer ${
                                            formError?.includes("District")
                                                ? "border-rose-300 focus:border-rose-500"
                                                : "border-slate-200 focus:border-indigo-500 focus:bg-white"
                                        }`}
                                    >
                                        <option value="">Select District</option>
                                        {districts.map((d) => (
                                            <option key={d.id} value={d.id}>{d.name}</option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                                        <ChevronDown className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center gap-4 mt-10">
                            <button
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="flex-1 py-4 text-[15px] font-bold text-slate-600 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all active:scale-[0.98] disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onConfirm}
                                disabled={isSubmitting}
                                className="flex-[1.5] py-4 text-[15px] font-bold text-white bg-gradient-to-r from-[#1a2e7a] to-[#2a44a1] rounded-2xl shadow-xl shadow-indigo-900/20 hover:shadow-2xl hover:shadow-indigo-900/30 hover:-translate-y-0.5 transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="w-5 h-5" />
                                        <span>Confirm &amp; Save</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
