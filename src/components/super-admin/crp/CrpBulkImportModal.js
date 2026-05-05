import { motion, AnimatePresence } from "framer-motion";
import { X, Download, UploadCloud, Upload, FileSpreadsheet, CheckCircle2 } from "lucide-react";
import { FormModal, FormHeader, FormActions } from "@/components/common/FormUI";

export default function CrpBulkImportModal({
  isOpen,
  onClose,
  bulkFile,
  setBulkFile,
  isUploading,
  setIsUploading,
  uploadSuccess,
  setUploadSuccess,
}) {
  const handleUpload = () => {
    setIsUploading(true);
    // Simulate upload
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
      setTimeout(() => {
        setUploadSuccess(false);
        setBulkFile(null);
        onClose();
      }, 1500);
    }, 2500);
  };

  return (
    <FormModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-xl">
        <FormHeader 
            title="Bulk Import CRPs"
            subtitle="Upload CRP details via CSV or Excel"
            icon={UploadCloud}
            onClose={onClose}
        />

        <div className="p-6 space-y-6">
            <div className="rounded-[24px] border border-slate-100 bg-slate-50/50 p-5">
                <div className="flex items-center gap-3 mb-3">
                    <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600">
                        <FileSpreadsheet size={16} />
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm">Quick Instructions</h4>
                </div>
                <ul className="text-[12px] text-slate-500 space-y-2 font-medium">
                    <li className="flex items-center gap-2 leading-tight">
                        <div className="w-1 h-1 rounded-full bg-indigo-400 shrink-0" />
                        Use the provided template for data entry
                    </li>
                    <li className="flex items-center gap-2 leading-tight">
                        <div className="w-1 h-1 rounded-full bg-indigo-400 shrink-0" />
                        Complete all mandatory fields
                    </li>
                    <li className="flex items-center gap-2 leading-tight">
                        <div className="w-1 h-1 rounded-full bg-indigo-400 shrink-0" />
                        Separate multiple values with semicolons (;)
                    </li>
                </ul>
            </div>

            <div className="flex justify-center">
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-95 shadow-sm bg-white">
                    <Download size={16} />
                    Download Template
                </button>
            </div>

            <label className="group relative flex flex-col items-center justify-center rounded-[28px] border-2 border-dashed border-slate-200 p-8 cursor-pointer transition-all hover:border-indigo-400 hover:bg-indigo-50/20 overflow-hidden">
                <AnimatePresence mode="wait">
                    {!bulkFile ? (
                        <motion.div 
                            key="empty"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="flex flex-col items-center"
                        >
                            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-3 group-hover:scale-105 group-hover:bg-white group-hover:shadow-lg transition-all duration-300">
                                <Upload size={24} className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
                            </div>
                            <p className="text-[13px] font-bold text-slate-600 group-hover:text-indigo-900 transition-colors">Click to upload or drag & drop</p>
                            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-black">CSV or XLSX (max 5MB)</p>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="file"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="flex items-center gap-4 bg-white border border-indigo-100 shadow-lg shadow-indigo-900/5 rounded-2xl px-5 py-3"
                        >
                            <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                                <FileSpreadsheet size={18} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Selected</p>
                                <p className="text-xs font-bold text-slate-800 truncate max-w-[160px] mt-0.5">{bulkFile.name}</p>
                            </div>
                            <button
                                onClick={(e) => { e.preventDefault(); setBulkFile(null); }}
                                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-300 hover:bg-rose-50 hover:text-rose-500 transition-all"
                            >
                                <X size={14} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <input
                    type="file"
                    accept=".csv,.xlsx"
                    className="hidden"
                    onChange={(e) => setBulkFile(e.target.files[0])}
                />
            </label>

            <div className="flex items-center gap-3 pt-4">
                <button
                    onClick={() => { onClose(); setBulkFile(null); }}
                    className="flex-1 py-3.5 text-[14px] font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all active:scale-[0.98]"
                >
                    Cancel
                </button>
                <button
                    disabled={!bulkFile || isUploading}
                    onClick={handleUpload}
                    className={`flex-[1.5] py-3.5 text-[14px] font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] ${
                        !bulkFile || isUploading
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                            : uploadSuccess 
                                ? "bg-emerald-600 text-white shadow-emerald-900/20"
                                : "bg-gradient-to-r from-[#1a2e7a] to-[#2a44a1] text-white shadow-indigo-900/20 hover:shadow-xl hover:-translate-y-0.5"
                    }`}
                >
                    {isUploading ? (
                        <>
                            <motion.div 
                                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }} 
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <UploadCloud size={16} />
                            </motion.div> 
                            <span>Uploading...</span>
                        </>
                    ) : uploadSuccess ? (
                        <>
                            <CheckCircle2 size={16} />
                            <span>Imported</span>
                        </>
                    ) : (
                        <>
                            <UploadCloud size={16} />
                            <span>Start Import</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    </FormModal>

  );
}

