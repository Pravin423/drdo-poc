"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Download, UploadCloud, Upload } from "lucide-react";

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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/50 backdrop-blur-md px-4">
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="bg-white w-full max-w-2xl rounded-3xl shadow-xl border border-slate-200 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Bulk Import CRPs</h2>
            <p className="text-sm text-slate-500 mt-1">Upload CRP details using a CSV or Excel file</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h4 className="font-semibold text-slate-800 mb-3">Before you upload</h4>
            <ul className="text-sm text-slate-600 space-y-2 list-disc list-inside">
              <li>Download the template and fill in CRP details</li>
              <li>All mandatory fields must be completed</li>
              <li>Aadhaar must be 12 digits and mobile number 10 digits</li>
              <li>Separate multiple villages or verticals using semicolons (;)</li>
              <li>Maximum file size allowed is 5MB</li>
            </ul>
          </div>

          <div className="flex justify-center">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold hover:bg-slate-100 transition">
              <Download size={16} />
              Download Import Template
            </button>
          </div>

          <label className="group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 p-8 cursor-pointer transition hover:border-slate-400 hover:bg-slate-50">
            <Upload size={34} className="text-slate-400 group-hover:text-slate-600 mb-3 transition" />

            {!bulkFile ? (
              <>
                <p className="text-sm font-medium text-slate-700">Click to upload or drag &amp; drop</p>
                <p className="text-xs text-slate-500 mt-1">CSV or XLSX (max 5MB)</p>
              </>
            ) : (
              <div className="flex items-center gap-3 bg-white border rounded-xl px-4 py-2">
                <span className="text-sm font-medium text-slate-700 truncate max-w-[200px]">{bulkFile.name}</span>
                <button
                  onClick={(e) => { e.preventDefault(); setBulkFile(null); }}
                  className="text-slate-400 hover:text-red-500"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            <input
              type="file"
              accept=".csv,.xlsx"
              className="hidden"
              onChange={(e) => setBulkFile(e.target.files[0])}
            />
          </label>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-slate-50">
          <button
            onClick={() => { onClose(); setBulkFile(null); }}
            className="px-4 py-2 rounded-xl cursor-pointer border text-sm font-semibold hover:bg-white transition"
          >
            Cancel
          </button>

          <button
            disabled={!bulkFile || isUploading}
            onClick={() => {
              setIsUploading(true);
              setTimeout(() => {
                setIsUploading(false);
                setUploadSuccess(true);
                setTimeout(() => {
                  setUploadSuccess(false);
                  setBulkFile(null);
                  onClose();
                }, 1200);
              }, 2000);
            }}
            className={`px-5 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition ${
              !bulkFile || isUploading
                ? "bg-slate-300 text-white cursor-not-allowed"
                : "bg-slate-900 text-white hover:bg-slate-800"
            }`}
          >
            {isUploading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Uploading...
              </>
            ) : uploadSuccess ? (
              <span className="text-emerald-200">Imported ✓</span>
            ) : (
              <>
                <UploadCloud size={16} />
                Import CRPs
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
