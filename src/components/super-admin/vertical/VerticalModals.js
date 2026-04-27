import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    Activity,
    Calendar,
    Eye,
    FileText,
    Hash,
    Tag,
    User,
    X,
} from "lucide-react";

// ─── Shared helpers ──────────────────────────────────────────────────────────

function StatusBadge({ status }) {
    return (
        <span
            className={`px-3 py-1 rounded-full text-[11px] font-bold border ${
                status
                    ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                    : "bg-slate-50 text-slate-500 border-slate-200"
            }`}
        >
            {status ? "Active" : "Inactive"}
        </span>
    );
}

function ModalOverlay({ onClose }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={onClose}
        />
    );
}

function FormField({ label, children }) {
    return (
        <div className="w-full">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                {label} <span className="text-red-500">*</span>
            </label>
            {children}
        </div>
    );
}

const inputClass =
    "w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none font-medium text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";

// ─── Add Modal ────────────────────────────────────────────────────────────────

export function AddVerticalModal({ open, onClose, formData, setFormData, onSubmit, isSubmitting, formError }) {
    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <ModalOverlay onClose={onClose} />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl relative z-10 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center text-slate-800">
                            <h3 className="font-bold text-lg">Add Vertical</h3>
                            <button
                                onClick={onClose}
                                className="bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors text-slate-400"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <FormField label="Vertical Name">
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className={inputClass}
                                    />
                                </FormField>
                                <FormField label="Vertical Code">
                                    <input
                                        type="text"
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                        className={inputClass}
                                    />
                                </FormField>
                                <FormField label="Start Date">
                                    <input
                                        type="date"
                                        value={formData.start}
                                        onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                                        className={inputClass}
                                    />
                                </FormField>
                                <FormField label="End Date">
                                    <input
                                        type="date"
                                        value={formData.end}
                                        onChange={(e) => setFormData({ ...formData, end: e.target.value })}
                                        className={inputClass}
                                    />
                                </FormField>
                            </div>
                            <FormField label="Description">
                                <textarea
                                    value={formData.desc}
                                    onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                                    placeholder="Enter description here..."
                                    className={`${inputClass} h-28 resize-none`}
                                />
                            </FormField>
                            <AnimatePresence>
                                {formError && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="text-sm text-red-500 bg-red-50 p-2.5 rounded-lg border border-red-100 font-medium"
                                    >
                                        {formError}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                            <button
                                onClick={onSubmit}
                                disabled={isSubmitting}
                                className="px-5 py-2.5 text-sm font-bold text-white bg-[#0d6efd] hover:bg-blue-600 rounded-xl shadow-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isSubmitting && (
                                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                )}
                                Submit
                            </button>
                            <button
                                onClick={onClose}
                                className="px-5 py-2.5 text-sm font-bold text-white bg-[#6c757d] hover:bg-slate-600 rounded-xl shadow-sm transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────

export function EditVerticalModal({ open, onClose, formData, setFormData, onSubmit, isSubmitting, formError }) {
    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <ModalOverlay onClose={onClose} />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl relative z-10 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center text-slate-800">
                            <h3 className="font-bold text-lg">Edit Vertical</h3>
                            <button
                                onClick={onClose}
                                className="bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors text-slate-400"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <FormField label="Vertical Name">
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className={inputClass}
                                    />
                                </FormField>
                                <FormField label="Vertical Code">
                                    <input
                                        type="text"
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                        className={inputClass}
                                    />
                                </FormField>
                                <FormField label="Start Date">
                                    <input
                                        type="date"
                                        value={formData.start}
                                        onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                                        className={inputClass}
                                    />
                                </FormField>
                                <FormField label="End Date">
                                    <input
                                        type="date"
                                        value={formData.end}
                                        onChange={(e) => setFormData({ ...formData, end: e.target.value })}
                                        className={inputClass}
                                    />
                                </FormField>
                            </div>
                            <FormField label="Description">
                                <textarea
                                    value={formData.desc}
                                    onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                                    placeholder="Enter description here..."
                                    className={`${inputClass} h-28 resize-none`}
                                />
                            </FormField>
                            <AnimatePresence>
                                {formError && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="text-sm text-red-500 bg-red-50 p-2.5 rounded-lg border border-red-100 font-medium"
                                    >
                                        {formError}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                            <button
                                onClick={onSubmit}
                                disabled={isSubmitting}
                                className="px-5 py-2.5 text-sm font-bold text-white bg-[#0d6efd] hover:bg-blue-600 rounded-xl shadow-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isSubmitting && (
                                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                )}
                                Update
                            </button>
                            <button
                                onClick={onClose}
                                className="px-5 py-2.5 text-sm font-bold text-white bg-[#6c757d] hover:bg-slate-600 rounded-xl shadow-sm transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

// ─── View Modal ───────────────────────────────────────────────────────────────

function DetailCard({ icon: Icon, iconColor, hoverBorder, hoverText, label, value }) {
    return (
        <div
            className={`bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center gap-1.5 ${hoverBorder} hover:shadow-md transition-all group`}
        >
            <div className={`flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest ${hoverText} transition-colors`}>
                <Icon size={14} className={iconColor} />
                {label}
            </div>
            <p className="font-bold text-slate-800 text-base">{value}</p>
        </div>
    );
}

export function ViewVerticalModal({ open, onClose, data, onStatusToggle }) {
    const [isUpdating, setIsUpdating] = useState(false);

    const handleToggle = async () => {
        if (!data) return;
        setIsUpdating(true);
        await onStatusToggle(data.id, data.status);
        setIsUpdating(false);
    };
    return (
        <AnimatePresence>
            {open && data && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <ModalOverlay onClose={onClose} />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden border border-slate-100"
                    >
                        {/* Header */}
                        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center text-slate-800 bg-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-0 opacity-50 transform translate-x-10 -translate-y-10" />
                            <h3 className="font-extrabold text-xl flex items-center gap-2.5 relative z-10 text-slate-800">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                                    <Eye size={20} className="stroke-[2.5]" />
                                </div>
                                Vertical Details
                            </h3>
                            <button
                                onClick={onClose}
                                className="bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-all text-slate-500 hover:text-slate-800 relative z-10 active:scale-95"
                            >
                                <X size={16} className="stroke-[2.5]" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-4 bg-slate-50/50">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <DetailCard
                                    icon={Tag} iconColor="text-blue-500"
                                    hoverBorder="hover:border-blue-300" hoverText="group-hover:text-blue-500"
                                    label="Vertical Name" value={data.name}
                                />
                                <DetailCard
                                    icon={Hash} iconColor="text-purple-500"
                                    hoverBorder="hover:border-purple-300" hoverText="group-hover:text-purple-500"
                                    label="Vertical Code" value={data.code}
                                />
                                <DetailCard
                                    icon={Calendar} iconColor="text-emerald-500"
                                    hoverBorder="hover:border-emerald-300" hoverText="group-hover:text-emerald-500"
                                    label="Start Date" value={data.start}
                                />
                                <DetailCard
                                    icon={Calendar} iconColor="text-rose-500"
                                    hoverBorder="hover:border-rose-300" hoverText="group-hover:text-rose-500"
                                    label="End Date" value={data.end}
                                />
                                <DetailCard
                                    icon={User} iconColor="text-amber-500"
                                    hoverBorder="hover:border-amber-300" hoverText="group-hover:text-amber-500"
                                    label="Created By" value={data.createdBy}
                                />
                                
                                {/* Status Card with Toggle */}
                                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center gap-1.5 hover:border-indigo-300 hover:shadow-md transition-all group">
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-indigo-500 transition-colors">
                                        <Activity size={14} className="text-indigo-500" /> Status
                                    </div>
                                    <div className="flex items-center justify-between gap-2 mt-1">
                                        <StatusBadge status={data.status} />
                                        <button
                                            onClick={handleToggle}
                                            disabled={isUpdating}
                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all active:scale-95 disabled:opacity-50 border shadow-sm ${
                                                data.status 
                                                ? "bg-rose-50 text-rose-600 hover:bg-rose-100 border-rose-100" 
                                                : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-emerald-100"
                                            }`}
                                        >
                                            <div className="relative flex h-1.5 w-1.5">
                                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${data.status ? "bg-rose-400" : "bg-emerald-400"}`}></span>
                                                <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${data.status ? "bg-rose-500" : "bg-emerald-500"}`}></span>
                                            </div>
                                            {isUpdating ? "Updating..." : data.status ? "Deactivate" : "Activate"}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-cyan-300 hover:shadow-md transition-all group">
                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 group-hover:text-cyan-500 transition-colors">
                                    <FileText size={14} className="text-cyan-500" /> Description
                                </div>
                                <p className="font-medium text-slate-700 leading-relaxed text-sm whitespace-pre-wrap">
                                    {data.desc || "No description provided."}
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 bg-white border-t border-slate-100 flex justify-end">
                            <button
                                onClick={onClose}
                                className="px-6 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-800 rounded-xl shadow-sm transition-all active:scale-95"
                            >
                                Close
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
