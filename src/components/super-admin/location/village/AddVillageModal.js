import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AddVillageModal({
    isOpen,
    onClose,
    formData,
    onChange,
    onConfirm,
    formError,
    isSubmitting,
    districts,
    modalTalukas,
    onDistrictChange,
}) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
                    onClick={() => !isSubmitting && onClose()}
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                    className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden relative z-10"
                >
                    {/* Header */}
                    <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center">
                        <h3 className="text-xl font-medium text-slate-800">Add Village</h3>
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                            <X size={20} className="stroke-2" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6 space-y-5 flex flex-col items-center w-full">
                        {/* Village Name */}
                        <div className="w-full">
                            <label className="block text-[15px] font-normal text-slate-700 mb-2">Village Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/[^a-zA-Z\s\-]/g, "");
                                    onChange({ ...formData, name: val });
                                }}
                                className={`w-full border rounded-lg px-3 py-2 text-[15px] outline-none transition-all text-slate-700 ${
                                    formError?.includes("Village Name") ? "border-red-400 focus:ring-1 focus:ring-red-400" : "border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                                }`}
                                placeholder="e.g. Calangute"
                            />
                        </div>

                        {/* District */}
                        <div className="w-full">
                            <label className="block text-[15px] font-normal text-slate-700 mb-2">District Name</label>
                            <select
                                value={formData.districtID}
                                onChange={(e) => onDistrictChange(e.target.value)}
                                className={`w-full border rounded-lg px-3 py-2 text-[15px] outline-none transition-all text-slate-700 bg-white ${
                                    formError?.includes("District") ? "border-red-400 focus:ring-1 focus:ring-red-400" : "border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                                }`}
                            >
                                <option value="">Select District</option>
                                {districts.map((d) => (
                                    <option key={d.id} value={d.id}>{d.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Taluka */}
                        <div className="w-full">
                            <label className="block text-[15px] font-normal text-slate-700 mb-2">Taluka Name</label>
                            <select
                                value={formData.talukaID}
                                onChange={(e) => onChange({ ...formData, talukaID: e.target.value })}
                                disabled={!formData.districtID}
                                className={`w-full border rounded-lg px-3 py-2 text-[15px] outline-none transition-all text-slate-700 bg-white ${
                                    formError?.includes("Taluka") ? "border-red-400 focus:ring-1 focus:ring-red-400" : "border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                                }`}
                            >
                                <option value="">Select Taluka</option>
                                {modalTalukas.map((t) => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                            {!formData.districtID && (
                                <p className="text-xs text-amber-600 mt-1.5">Please select a district first.</p>
                            )}
                        </div>

                        {/* Census Code */}
                        <div className="w-full">
                            <label className="block text-[15px] font-normal text-slate-700 mb-2">Census Code</label>
                            <input
                                type="text"
                                maxLength={6}
                                value={formData.censusCode}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, "");
                                    onChange({ ...formData, censusCode: val });
                                }}
                                className={`w-full border rounded-lg px-3 py-2 text-[15px] outline-none transition-all text-slate-700 ${
                                    formError?.includes("Census Code") ? "border-red-400 focus:ring-1 focus:ring-red-400" : "border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                                }`}
                                placeholder="e.g. 627023"
                            />
                        </div>

                        <AnimatePresence>
                            {formError && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                    className="w-full text-sm font-medium text-red-500 bg-red-50 p-2.5 rounded-lg border border-red-100"
                                >
                                    {formError}
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-5 border-t border-slate-200 flex justify-end gap-3">
                        <button
                            onClick={onConfirm}
                            disabled={isSubmitting}
                            className="px-5 py-2 text-[15px] font-medium text-white bg-[#0d6efd] hover:bg-blue-600 rounded-lg shadow-sm transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {isSubmitting ? (
                                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Submitting...</>
                            ) : "Submit"}
                        </button>
                        <button
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="px-5 py-2 text-[15px] font-medium text-white bg-[#6c757d] hover:bg-slate-600 rounded-lg text-center transition-colors disabled:opacity-50"
                        >
                            Close
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
