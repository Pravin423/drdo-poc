import { FileUp, FileText, Download, Upload, CheckCircle2, AlertCircle, Map, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FormModal, FormHeader, FormSelect, FormActions } from "@/components/common/FormUI";

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
        <FormModal isOpen={isOpen} onClose={onClose}>
            <FormHeader 
                title="Import Villages" 
                subtitle="Upload a CSV file to bulk-add villages" 
                icon={FileUp} 
                onClose={onClose} 
            />

            <div className="p-8 space-y-6">
                {/* Template Download */}
                <div className="flex items-center justify-between p-5 bg-indigo-50/50 border border-indigo-100 rounded-[24px]">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                            <FileText size={24} className="text-indigo-600" />
                        </div>
                        <div>
                            <p className="text-[15px] font-bold text-slate-800">Download Template</p>
                            <p className="text-xs font-medium text-slate-500">CSV with required column headers</p>
                        </div>
                    </div>
                    <button
                        onClick={onTemplateDownload}
                        className="flex items-center gap-2 px-4 py-2 text-[13px] font-bold text-indigo-700 bg-white border border-indigo-100 rounded-xl hover:bg-indigo-50 transition-all shadow-sm active:scale-95"
                    >
                        <Download size={14} /> Template
                    </button>
                </div>

                {/* Location Selectors */}
                <div className="grid grid-cols-2 gap-4">
                    <FormSelect
                        label="District *"
                        icon={Map}
                        placeholder="Select District"
                        value={selectedDistrict}
                        onChange={(e) => onDistrictChange(e.target.value)}
                        options={districts.map(d => ({ label: d.name, value: d.id }))}
                    />
                    <FormSelect
                        label="Taluka *"
                        icon={MapPin}
                        placeholder={selectedDistrict ? "Select Taluka" : "Select District first"}
                        value={selectedTaluka}
                        disabled={!selectedDistrict}
                        onChange={(e) => onTalukaChange(e.target.value)}
                        options={talukasOptions.map(t => ({ label: t.name, value: t.id }))}
                    />
                </div>

                {/* File Drop Zone */}
                <div
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                    onClick={() => document.getElementById("village-csv-input").click()}
                    className={`relative border-2 border-dashed rounded-[24px] p-10 text-center transition-all cursor-pointer group ${
                        importDragOver
                            ? "border-indigo-400 bg-indigo-50"
                            : importFile
                                ? "border-emerald-400 bg-emerald-50"
                                : "border-slate-200 bg-slate-50/50 hover:border-indigo-300 hover:bg-indigo-50/30"
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
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center shadow-inner">
                                <CheckCircle2 size={28} className="text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-[15px] font-bold text-slate-800">{importFile.name}</p>
                                <p className="text-xs font-medium text-slate-500 mt-1">
                                    {(importFile.size / 1024).toFixed(1)} KB · Click to change file
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                <Upload size={28} className="text-slate-400 group-hover:text-indigo-500" />
                            </div>
                            <div>
                                <p className="text-[15px] font-bold text-slate-700">Drag & drop your CSV here</p>
                                <p className="text-xs font-medium text-slate-400 mt-1">or click to browse · .csv files only</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Format hint */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-center">
                    <code className="text-xs font-medium text-slate-400">Village Name, Census Code, Latitude, Longitude</code>
                </div>

                {/* Import Result */}
                <AnimatePresence>
                    {importResult && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="space-y-4"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-4 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                                        <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black text-emerald-700 tracking-tight">{importResult.added}</p>
                                        <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Added</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 bg-amber-50 border border-amber-100 rounded-2xl">
                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                                        <AlertCircle size={20} className="text-amber-600 shrink-0" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black text-amber-700 tracking-tight">{importResult.skipped}</p>
                                        <p className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Skipped</p>
                                    </div>
                                </div>
                            </div>
                            {importResult.errors.length > 0 && (
                                <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 max-h-40 overflow-y-auto">
                                    <p className="text-xs font-bold text-rose-700 mb-2 flex items-center gap-2">
                                        <AlertCircle size={14} /> Import Issues:
                                    </p>
                                    <div className="space-y-1.5">
                                        {importResult.errors.map((err, i) => (
                                            <p key={i} className="text-[13px] font-medium text-rose-600/80 leading-relaxed flex items-start gap-2">
                                                <span className="w-1 h-1 rounded-full bg-rose-300 mt-1.5 shrink-0" /> {err}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                <FormActions 
                    onCancel={onClose} 
                    onConfirm={onImport} 
                    confirmIcon={Upload}
                    confirmText={importLoading ? "Processing..." : "Start Import"}
                    disabled={!importFile || !selectedDistrict || !selectedTaluka || importLoading || importResult}
                    cancelText={importResult ? "Close" : "Cancel"}
                />
            </div>
        </FormModal>
    );
}

