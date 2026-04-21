import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function EditVillageModal({
    isOpen,
    onClose,
    formData,
    onChange,
    onSave,
    formError,
    districts,
    modalTalukas,
    onDistrictChange,
}) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
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
                        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-800">Edit Village</h3>
                            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors">
                                <X size={16} className="stroke-2" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-5 flex flex-col items-center w-full">
                            {/* Village Name */}
                            <div className="w-full">
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Village Name</label>
                                <input
                                    type="text"
                                    maxLength={100}
                                    value={formData.name}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/[^a-zA-Z\s\-]/g, "");
                                        onChange({ ...formData, name: val });
                                    }}
                                    className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all text-slate-700 font-medium ${
                                        formError?.includes("Village Name") ? "border-red-400 focus:ring-2 focus:ring-red-400/20" : "border-slate-300 focus:border-tech-blue-500 focus:ring-2 focus:ring-tech-blue-500/20"
                                    }`}
                                    placeholder="e.g. Calangute"
                                />
                            </div>

                            {/* District */}
                            <div className="w-full">
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">District Name</label>
                                <select
                                    value={formData.districtName}
                                    onChange={(e) => onDistrictChange(e.target.value)}
                                    className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all text-slate-700 font-medium bg-white ${
                                        formError?.includes("District Name") ? "border-red-400 focus:ring-2 focus:ring-red-400/20" : "border-slate-300 focus:border-tech-blue-500 focus:ring-2 focus:ring-tech-blue-500/20"
                                    }`}
                                >
                                    <option value="">Select District</option>
                                    {districts.map((d) => (
                                        <option key={d.id} value={d.name}>{d.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Taluka */}
                            <div className="w-full">
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Taluka Name</label>
                                <select
                                    value={formData.talukaName}
                                    onChange={(e) => onChange({ ...formData, talukaName: e.target.value })}
                                    className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all text-slate-700 font-medium bg-white ${
                                        formError?.includes("Taluka Name") ? "border-red-400 focus:ring-2 focus:ring-red-400/20" : "border-slate-300 focus:border-tech-blue-500 focus:ring-2 focus:ring-tech-blue-500/20"
                                    }`}
                                >
                                    <option value="">Select Taluka</option>
                                    {modalTalukas.map((t) => (
                                        <option key={t.name} value={t.name}>{t.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Census Code */}
                            <div className="w-full">
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Census Code</label>
                                <input
                                    type="text"
                                    maxLength={6}
                                    value={formData.censusCode}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, "");
                                        onChange({ ...formData, censusCode: val });
                                    }}
                                    className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all text-slate-700 font-medium ${
                                        formError?.includes("Census Code") ? "border-red-400 focus:ring-2 focus:ring-red-400/20" : "border-slate-300 focus:border-tech-blue-500 focus:ring-2 focus:ring-tech-blue-500/20"
                                    }`}
                                    placeholder="Max 6 digits"
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
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                            <button onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-xl transition-colors">Cancel</button>
                            <button onClick={onSave} className="px-5 py-2.5 text-sm font-bold text-white bg-tech-blue-600 hover:bg-tech-blue-700 rounded-xl shadow-sm transition-colors">Save Changes</button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
