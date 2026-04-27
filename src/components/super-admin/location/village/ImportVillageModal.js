import { X, FileUp, FileText, Download, Upload, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ImportVillageModal({
    isOpen,
    onClose,
    importFile,
    onFileChange,
    importDragOver,
    onDragOver,
    onDragLeave,
    onDrop,
    importResult,
    importLoading,
    onImport,
    onTemplateDownload,
    districts = [],
    talukasOptions = [],
    selectedDistrict,
    selectedTaluka,
    onDistrictChange,
    onTalukaChange,
}) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
                        onClick={() => { if (!importLoading) onClose(); }}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                        className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden relative z-10"
                    >
                        {/* Header */}
                        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-tech-blue-50 flex items-center justify-center">
                                    <FileUp size={18} className="text-tech-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800">Import Villages</h3>
                                    <p className="text-xs text-slate-500">Upload a CSV file to bulk-add villages</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                disabled={importLoading}
                                className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors disabled:opacity-40"
                            >
                                <X size={16} className="stroke-2" />
                            </button>
                        </div>

                        <div className="p-6 space-y-5">
                            {/* Template Download */}
                            <div className="flex items-center justify-between p-3.5 bg-blue-50 border border-blue-100 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <FileText size={18} className="text-blue-600 shrink-0" />
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800">Download Template</p>
                                        <p className="text-xs text-slate-500">CSV with required column headers</p>
                                    </div>
                                </div>
                                <button
                                    onClick={onTemplateDownload}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-700 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors shadow-sm"
                                >
                                    <Download size={13} /> Template
                                </button>
                            </div>

                            {/* Location Selectors */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">District <span className="text-rose-500">*</span></label>
                                    <select
                                        value={selectedDistrict}
                                        onChange={(e) => onDistrictChange(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-2 focus:ring-tech-blue-500/20 focus:border-tech-blue-500 block p-2.5 outline-none transition-all"
                                    >
                                        <option value="">Select District</option>
                                        {districts.map((d) => (
                                            <option key={d.id} value={d.id}>{d.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Taluka <span className="text-rose-500">*</span></label>
                                    <select
                                        value={selectedTaluka}
                                        onChange={(e) => onTalukaChange(e.target.value)}
                                        disabled={!selectedDistrict}
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-2 focus:ring-tech-blue-500/20 focus:border-tech-blue-500 block p-2.5 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <option value="">Select Taluka</option>
                                        {talukasOptions.map((t) => (
                                            <option key={t.id} value={t.id}>{t.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* File Drop Zone */}
                            <div
                                onDragOver={onDragOver}
                                onDragLeave={onDragLeave}
                                onDrop={onDrop}
                                onClick={() => document.getElementById("village-csv-input").click()}
                                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                                    importDragOver
                                        ? "border-tech-blue-400 bg-tech-blue-50"
                                        : importFile
                                            ? "border-emerald-400 bg-emerald-50"
                                            : "border-slate-200 bg-slate-50 hover:border-tech-blue-300 hover:bg-tech-blue-50/30"
                                }`}
                            >
                                <input
                                    id="village-csv-input"
                                    type="file"
                                    accept=".csv"
                                    className="hidden"
                                    onChange={(e) => {
                                        onFileChange(e.target.files[0] || null);
                                        e.target.value = "";
                                    }}
                                />
                                {importFile ? (
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                                            <CheckCircle2 size={24} className="text-emerald-600" />
                                        </div>
                                        <p className="text-sm font-bold text-slate-800">{importFile.name}</p>
                                        <p className="text-xs text-slate-500">{(importFile.size / 1024).toFixed(1)} KB · Click to change file</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                                            <Upload size={22} className="text-slate-400" />
                                        </div>
                                        <p className="text-sm font-semibold text-slate-700">Drag &amp; drop your CSV here</p>
                                        <p className="text-xs text-slate-400">or click to browse · .csv files only</p>
                                    </div>
                                )}
                            </div>

                            {/* Format hint */}
                            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                                <code className="text-xs text-slate-500">Village Name, Census Code, Latitude, Longitude</code>
                            </div>

                            {/* Import Result */}
                            <AnimatePresence>
                                {importResult && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                        className="space-y-3"
                                    >
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                                                <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                                                <div>
                                                    <p className="text-lg font-extrabold text-emerald-700">{importResult.added}</p>
                                                    <p className="text-xs font-semibold text-emerald-600">Rows Added</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                                                <AlertCircle size={18} className="text-amber-600 shrink-0" />
                                                <div>
                                                    <p className="text-lg font-extrabold text-amber-700">{importResult.skipped}</p>
                                                    <p className="text-xs font-semibold text-amber-600">Rows Skipped</p>
                                                </div>
                                            </div>
                                        </div>
                                        {importResult.errors.length > 0 && (
                                            <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 max-h-32 overflow-y-auto">
                                                <p className="text-xs font-bold text-rose-700 mb-1.5">Issues:</p>
                                                {importResult.errors.map((err, i) => (
                                                    <p key={i} className="text-xs text-rose-600 flex items-start gap-1.5">
                                                        <AlertCircle size={11} className="mt-0.5 shrink-0" />{err}
                                                    </p>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                            <button onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-xl transition-colors">
                                {importResult ? "Close" : "Cancel"}
                            </button>
                            {!importResult && (
                                <button
                                    onClick={onImport}
                                    disabled={!importFile || !selectedDistrict || !selectedTaluka || importLoading}
                                    className="px-5 py-2.5 text-sm font-bold text-white bg-tech-blue-600 hover:bg-tech-blue-700 rounded-xl shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {importLoading ? (
                                        <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}><Upload size={15} /></motion.div> Processing...</>
                                    ) : (
                                        <><Upload size={15} /> Import Villages</>
                                    )}
                                </button>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
