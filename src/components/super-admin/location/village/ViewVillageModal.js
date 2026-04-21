import { Eye, X, Map, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ViewVillageModal({ isOpen, onClose, villageDetails, isLoading, viewError, districts, talukasOptions }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]"
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
                                <Eye size={18} className="text-emerald-600" /> Village Details
                            </h3>
                            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-white hover:bg-slate-100 p-2 rounded-full transition-colors shadow-sm mb-1">
                                <X size={16} className="stroke-2" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6">
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center py-10">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mb-4" />
                                    <p className="text-sm font-semibold text-slate-500">Loading village details...</p>
                                </div>
                            ) : viewError ? (
                                <div className="text-center py-6">
                                    <div className="inline-flex py-3 px-4 bg-red-50 text-red-600 rounded-xl border border-red-100 items-center justify-center gap-2 text-sm font-medium mb-4 w-full">
                                        <span>{viewError}</span>
                                    </div>
                                </div>
                            ) : villageDetails ? (
                                <div className="space-y-4">
                                    {/* Village Name */}
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-2 transition-all hover:shadow-sm">
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Village Name</p>
                                        <p className="text-base font-bold text-slate-800">
                                            {villageDetails.villageName || villageDetails.name || villageDetails.village_name || villageDetails.village || "N/A"}
                                        </p>
                                    </div>

                                    {/* Census Code + Status */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 transition-all hover:shadow-sm">
                                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Census Code</p>
                                            <p className="text-[15px] font-semibold text-slate-700">
                                                {villageDetails.censusCode || villageDetails.census_code || "N/A"}
                                            </p>
                                        </div>
                                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 transition-all hover:shadow-sm">
                                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status</p>
                                            <p className="text-[15px] font-semibold text-slate-700">
                                                {villageDetails.status === 1 || villageDetails.status === "1" ? (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-green-50 text-green-700 text-xs font-bold border border-green-200">Active</span>
                                                ) : typeof villageDetails.status !== "undefined" ? (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">Inactive</span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-green-50 text-green-700 text-xs font-bold border border-green-200">Active</span>
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Taluka + District */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 transition-all hover:shadow-sm">
                                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Taluka</p>
                                            <p className="text-[15px] font-semibold text-slate-800 flex items-center gap-2">
                                                <Map size={14} className="text-emerald-500" />
                                                {villageDetails.talukaName ||
                                                    villageDetails.taluka_name ||
                                                    villageDetails.taluka?.name ||
                                                    talukasOptions?.find((t) => t.id == (villageDetails.taluka_id || villageDetails.talukaID))?.name ||
                                                    "N/A"}
                                            </p>
                                        </div>
                                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 transition-all hover:shadow-sm">
                                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">District</p>
                                            <p className="text-[15px] font-semibold text-slate-800 flex items-center gap-2">
                                                <MapPin size={14} className="text-blue-500" />
                                                {villageDetails.districtName ||
                                                    villageDetails.district_name ||
                                                    villageDetails.district?.name ||
                                                    districts?.find((d) => d.id == (villageDetails.district_id || villageDetails.districtID))?.name ||
                                                    "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : null}
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                            <button onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-xl transition-colors w-full sm:w-auto">
                                Close
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
