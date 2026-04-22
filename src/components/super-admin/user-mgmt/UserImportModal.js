import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, FileText, Download, AlertCircle, CheckCircle2 } from "lucide-react";

const IMPORT_ROLES = [
  { value: "",               label: "-- Select Role --" },
  { value: "Super Admin",    label: "Super Admin" },
  { value: "State Admin",    label: "State Admin" },
  { value: "District Admin", label: "District Admin" },
  { value: "Supervisor",     label: "Supervisor" },
  { value: "Finance",        label: "Finance" },
];

export default function UserImportModal({ isOpen, onClose, onImport, users }) {
  const [importRole, setImportRole] = useState("");
  const [importFile, setImportFile] = useState(null);
  const [importError, setImportError] = useState("");
  const [importSuccess, setImportSuccess] = useState("");
  const [importing, setImporting] = useState(false);
  const importFileRef = useRef(null);

  if (!isOpen) return null;

  const downloadTemplate = () => {
    const csv = "Full Name,Mobile,Email,Gender,Date of Birth (YYYY-MM-DD),Password\nJohn Doe,9876543210,john@example.com,Male,1990-01-15,Pass@1234";
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "user_import_template.csv";
    a.click(); URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    setImportError(""); setImportSuccess("");
    if (!importRole)  { setImportError("Please select a role."); return; }
    if (!importFile)  { setImportError("Please choose a CSV file."); return; }
    if (importFile.size > 5 * 1024 * 1024) { setImportError("File exceeds 5MB."); return; }

    setImporting(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const lines   = e.target.result.split(/\r?\n/).filter(Boolean);
        const existingMobiles = new Set(users.map(u => String(u.mobile).trim()));
        const added = [];
        let skipped = 0;

        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(",").map(c => c.trim());
          if (cols.length < 2) continue;
          const mobile = cols[1];
          if (existingMobiles.has(mobile)) { skipped++; continue; }
          existingMobiles.add(mobile);
          added.push({
            id:               Date.now() + i,
            fullname:         cols[0] || "",
            mobile:           cols[1] || "",
            email:            cols[2] || "",
            gender:           cols[3] || "Male",
            date_of_birth:    cols[4] || null,
            role_name:        importRole,
            signature_status: "Pending",
            status:           "Active",
            joined:           new Date().toISOString().split("T")[0],
            profile:          null,
          });
        }

        onImport(added);
        setImportSuccess(`✓ ${added.length} user(s) imported${skipped ? `, ${skipped} duplicate(s) skipped` : ""}.`);
        setImportFile(null);
        setImportRole("");
        if (importFileRef.current) importFileRef.current.value = "";
      } catch {
        setImportError("Failed to parse CSV. Please check the file format.");
      } finally {
        setImporting(false);
      }
    };
    reader.readAsText(importFile);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }} transition={{ type: "spring", duration: 0.4, bounce: 0.25 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg relative z-10 overflow-hidden"
      >
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-tech-blue-600 flex items-center justify-center shadow-sm">
              <Upload size={18} className="text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Import Users</h3>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700">
              Select Role <span className="text-rose-500">*</span>
            </label>
            <select
              value={importRole}
              onChange={(e) => { setImportRole(e.target.value); setImportError(""); }}
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 bg-white outline-none focus:border-tech-blue-500 focus:ring-4 focus:ring-tech-blue-500/10 transition-all appearance-none"
            >
              {IMPORT_ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700">
              Select CSV File <span className="text-rose-500">*</span>
            </label>
            <div
              onClick={() => importFileRef.current?.click()}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl border-2 cursor-pointer transition-all ${
                importFile ? "border-tech-blue-400 bg-tech-blue-50/30" : "border-slate-200 hover:border-tech-blue-400 hover:bg-slate-50"
              }`}
            >
              <FileText size={18} className="text-slate-400 shrink-0" />
              <span className={`text-sm truncate ${importFile ? "text-slate-800 font-semibold" : "text-slate-400"}`}>
                {importFile ? importFile.name : "No file chosen"}
              </span>
              <span className="ml-auto text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg shrink-0">
                Choose File
              </span>
            </div>
            <input
              ref={importFileRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files[0];
                setImportFile(f || null);
                setImportError("");
                setImportSuccess("");
              }}
            />
          </div>

          <button
            onClick={downloadTemplate}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <Download size={15} /> Download CSV Template
          </button>

          <AnimatePresence>
            {importError && (
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                <AlertCircle size={16} className="shrink-0" /> {importError}
              </motion.div>
            )}
            {importSuccess && (
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                <CheckCircle2 size={16} className="shrink-0" /> {importSuccess}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button onClick={onClose}
            className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-slate-200 hover:bg-slate-300 rounded-xl transition-colors">
            Cancel
          </button>
          <motion.button
            onClick={handleImport}
            disabled={importing}
            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-tech-blue-600 hover:bg-tech-blue-700 rounded-xl shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {importing ? (
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full" />
            ) : <Upload size={15} />}
            {importing ? "Importing…" : "Import"}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
