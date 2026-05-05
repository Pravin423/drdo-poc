import { 
  FormModal, FormHeader, FormSelect, FormActions 
} from "../../common/FormUI";
import { X, FileUp, FileText, Download, Upload, CheckCircle2, AlertCircle, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ShgBulkImportModal({
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
    villagesOptions = [],
    selectedDistrict,
    selectedTaluka,
    selectedVillage,
    onDistrictChange,
    onTalukaChange,
    onVillageChange,
}) {
    return (
        <FormModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-xl">
            <FormHeader 
                title="Bulk Import SHGs" 
                subtitle="Upload multiple groups via CSV" 
                icon={FileUp} 
                onClose={onClose} 
            />

            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 overscroll-contain transform-gpu">
                <div className="space-y-8">
                    {/* Template Download */}
                    <div className="relative group p-6 rounded-[32px] bg-slate-50 border border-slate-100 transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-100 overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                            <FileText size={48} />
                        </div>
                        <div className="flex items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#3b52ab] border border-slate-100 group-hover:scale-105 transition-transform">
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-slate-900 uppercase tracking-wider">Download Template</p>
                                    <p className="text-[11px] font-bold text-slate-400 mt-0.5">CSV with required headers</p>
                                </div>
                            </div>
                            <button
                                onClick={onTemplateDownload}
                                className="flex items-center gap-2 px-5 py-2.5 text-[11px] font-black text-[#3b52ab] bg-white border border-indigo-100 rounded-2xl hover:bg-indigo-50 transition-all shadow-sm active:scale-95 uppercase tracking-widest"
                            >
                                <Download size={14} /> Template
                            </button>
                        </div>
                    </div>

                    {/* Location Selectors */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormSelect
                            label="District"
                            icon={MapPin}
                            value={selectedDistrict}
                            onChange={(e) => onDistrictChange(e.target.value)}
                            options={districts.map(d => ({ label: d.name, value: d.id }))}
                            required
                        />
                        <FormSelect
                            label="Taluka"
                            icon={MapPin}
                            value={selectedTaluka}
                            onChange={(e) => onTalukaChange(e.target.value)}
                            disabled={!selectedDistrict}
                            options={talukasOptions.map(t => ({ label: t.name, value: t.id }))}
                            required
                        />
                        <FormSelect
                            label="Village"
                            icon={MapPin}
                            value={selectedVillage}
                            onChange={(e) => onVillageChange?.(e.target.value)}
                            disabled={!selectedTaluka}
                            options={(villagesOptions || []).map(v => ({ label: v.name, value: v.id }))}
                            required
                        />
                    </div>

                    {/* File Drop Zone */}
                    <div className="space-y-3">
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Upload File</p>
                        <div
                            onDragOver={onDragOver}
                            onDragLeave={onDragLeave}
                            onDrop={onDrop}
                            onClick={() => document.getElementById("shg-csv-input").click()}
                            className={`relative border-2 border-dashed rounded-[40px] p-12 text-center transition-all cursor-pointer group ${
                                importDragOver
                                    ? "border-[#3b52ab] bg-indigo-50/50"
                                    : importFile
                                        ? "border-emerald-400 bg-emerald-50/30"
                                        : "border-slate-100 bg-slate-50/50 hover:border-indigo-300 hover:bg-indigo-50/20"
                            }`}
                        >
                            <input
                                id="shg-csv-input"
                                type="file"
                                accept=".csv"
                                className="hidden"
                                onChange={(e) => {
                                    onFileChange(e.target.files[0] || null);
                                    e.target.value = "";
                                }}
                            />
                            {importFile ? (
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-16 h-16 rounded-3xl bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-lg shadow-emerald-200">
                                        <CheckCircle2 size={32} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-base font-black text-slate-900 tracking-tight">{importFile.name}</p>
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{(importFile.size / 1024).toFixed(1)} KB · Click to change</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-16 h-16 rounded-3xl bg-white shadow-xl shadow-slate-200 flex items-center justify-center text-slate-400 group-hover:scale-110 group-hover:text-[#3b52ab] transition-all duration-500 border border-slate-100">
                                        <Upload size={30} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-base font-black text-slate-700 tracking-tight">Drag & drop your CSV here</p>
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">or click to browse files</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Format hint */}
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-center">
                        <code className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed block overflow-x-auto whitespace-nowrap">
                            SHGName, contactPersonName, contactPersonMobile
                        </code>
                    </div>

                    {/* Import Result */}
                    <AnimatePresence>
                        {importResult && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }} 
                                animate={{ opacity: 1, scale: 1 }} 
                                exit={{ opacity: 0 }}
                                className="space-y-4"
                            >
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-4 p-5 bg-emerald-50 border border-emerald-100 rounded-[32px]">
                                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-emerald-600 shadow-sm">
                                            <CheckCircle2 size={20} />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-black text-emerald-900 leading-none">{importResult.added || 0}</p>
                                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1">Rows Added</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-5 bg-amber-50 border border-amber-100 rounded-[32px]">
                                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-amber-600 shadow-sm">
                                            <AlertCircle size={20} />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-black text-amber-900 leading-none">{importResult.skipped || 0}</p>
                                            <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mt-1">Rows Skipped</p>
                                        </div>
                                    </div>
                                </div>
                                {importResult.errors && importResult.errors.length > 0 && (
                                    <div className="bg-rose-50 border border-rose-100 rounded-[32px] p-6 max-h-48 overflow-y-auto custom-scrollbar">
                                        <p className="text-[11px] font-black text-rose-700 uppercase tracking-widest mb-3 flex items-center gap-2">
                                            <AlertCircle size={14} /> Critical Issues
                                        </p>
                                        <div className="space-y-2">
                                            {importResult.errors.map((err, i) => (
                                                <p key={i} className="text-xs font-bold text-rose-600/80 flex items-start gap-3">
                                                    <span className="w-1 h-1 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                                                    {err}
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
                        isLoading={importLoading} 
                        confirmText={importResult ? "Close" : "Start Import"}
                        cancelText={importResult ? "Done" : "Cancel"}
                        confirmIcon={Upload}
                        // If result is shown, maybe we change the confirm behavior
                        {...(importResult ? { onConfirm: onClose, confirmText: "Close", confirmIcon: null } : {})}
                    />
                </div>
            </div>
        </FormModal>
    );
}
