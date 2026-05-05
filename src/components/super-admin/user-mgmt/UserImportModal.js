import React, { useState, useRef } from "react";
import { 
    Upload, 
    X, 
    FileText, 
    Download, 
    AlertCircle, 
    CheckCircle2,
    Database,
    CheckCircle
} from "lucide-react";
import {
    FormModal,
    FormHeader,
    FormSelect,
    FormActions,
    FormSection,
    FormError
} from "../../common/FormUI";
import ConfirmationModal from "../../common/ConfirmationModal";

const IMPORT_ROLES = [
    { value: "Super Admin",    label: "Super Admin" },
    { value: "State Admin",    label: "State Admin" },
    { value: "District Admin", label: "District Admin" },
    { value: "Supervisor",     label: "Supervisor" },
    { value: "Finance",        label: "Finance" },
];

export default function UserImportModal({ isOpen, onClose, onImport, users }) {
    const [importRole, setImportRole] = useState("");
    const [importFile, setImportFile] = useState(null);
    const [isImporting, setIsImporting] = useState(false);
    const [apiError, setApiError] = useState("");
    const [successOpen, setSuccessOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const importFileRef = useRef(null);

    const downloadTemplate = () => {
        const csv = "Full Name,Mobile,Email,Gender,Date of Birth (YYYY-MM-DD),Password\nJohn Doe,9876543210,john@example.com,Male,1990-01-15,Pass@1234";
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = "user_import_template.csv";
        a.click(); URL.revokeObjectURL(url);
    };

    const handleImport = () => {
        setApiError("");
        if (!importRole) { setApiError("Please select a role for the imported users."); return; }
        if (!importFile) { setApiError("Please select a CSV file to continue."); return; }
        
        setIsImporting(true);
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const lines = e.target.result.split(/\r?\n/).filter(Boolean);
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
                        id: Date.now() + i,
                        fullname: cols[0] || "",
                        mobile: cols[1] || "",
                        email: cols[2] || "",
                        gender: cols[3] || "Male",
                        date_of_birth: cols[4] || null,
                        role_name: importRole,
                        signature_status: "Pending",
                        status: "Active",
                        joined: new Date().toISOString().split("T")[0],
                        profile: null,
                    });
                }

                onImport(added);
                setSuccessMessage(`${added.length} user(s) imported successfully${skipped ? `. ${skipped} duplicates were skipped.` : "."}`);
                setSuccessOpen(true);
                setImportFile(null);
                setImportRole("");
            } catch {
                setApiError("Failed to parse CSV. Please verify the template format.");
            } finally {
                setIsImporting(false);
            }
        };
        reader.readAsText(importFile);
    };

    return (
        <FormModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-xl">
            <FormHeader title="Bulk User Import" subtitle="System Migration • Automated Processing" icon={Upload} onClose={onClose} />

            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar overscroll-contain transform-gpu">
                <FormError error={apiError} />

                <div className="space-y-10">
                    <FormSection title="Source Selection" description="Upload CSV data source." icon={Database}>
                        <div className="space-y-6">
                            <FormSelect label="Import Target Role *" icon={Database} options={IMPORT_ROLES} value={importRole} onChange={e => setImportRole(e.target.value)} />
                            
                            <div className="space-y-2">
                                <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Select Data Source *</p>
                                <div 
                                    onClick={() => importFileRef.current?.click()}
                                    className={`p-6 rounded-[2rem] border-2 border-dashed transition-all cursor-pointer flex flex-col items-center gap-3 ${importFile ? "bg-[#3b52ab]/5 border-[#3b52ab] text-[#3b52ab]" : "bg-slate-50 border-slate-200 text-slate-400 hover:border-[#3b52ab] hover:bg-slate-100"}`}
                                >
                                    <div className={`p-3 rounded-2xl ${importFile ? "bg-[#3b52ab] text-white shadow-lg" : "bg-white text-slate-300 shadow-sm"}`}>
                                        <FileText size={24} />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[11px] font-black uppercase tracking-widest">{importFile ? importFile.name : "Drop CSV file here"}</p>
                                        <p className="text-[9px] font-bold opacity-60 mt-0.5">{importFile ? "Ready for processing" : "Or click to browse storage"}</p>
                                    </div>
                                    <input ref={importFileRef} type="file" accept=".csv" className="hidden" onChange={e => setImportFile(e.target.files[0] || null)} />
                                </div>
                            </div>

                            <button onClick={downloadTemplate} className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center gap-3 hover:bg-slate-100 transition-all group">
                                <Download size={16} className="text-[#3b52ab] group-hover:scale-110 transition-transform" />
                                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Download Data Template</span>
                            </button>
                        </div>
                    </FormSection>

                    <FormActions onCancel={onClose} onConfirm={handleImport} isLoading={isImporting} confirmText="Start Import" confirmIcon={CheckCircle} />
                </div>
            </div>

            <ConfirmationModal isOpen={successOpen} onClose={() => { setSuccessOpen(false); onClose(); }} title="Import Complete" message={successMessage} type="success" />
        </FormModal>
    );
}
