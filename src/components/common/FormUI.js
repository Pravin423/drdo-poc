import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, XCircle, ChevronDown } from "lucide-react";
import { createPortal } from "react-dom";

/**
 * Common Modal Wrapper for Forms
 */
export const FormModal = ({ isOpen, onClose, children, maxWidth = "max-w-lg" }) => {
    if (typeof window === 'undefined') return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div 
                    className="fixed inset-0 z-[9999] flex items-center justify-center px-4 py-8 pointer-events-none"
                >
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] pointer-events-auto transition-all duration-500"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: 10 }}
                        className={`relative w-full ${maxWidth} max-h-[94vh] bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] overflow-hidden border border-slate-200 flex flex-col pointer-events-auto transform-gpu overscroll-contain`}
                    >
                        {children}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
};

/**
 * Common Header for Forms
 */
export const FormHeader = ({ title, subtitle, icon: Icon, onClose }) => {
    return (
        <div className="bg-gradient-to-br from-[#1a2e7a] to-[#3b52ab] px-10 py-8 text-white relative shrink-0">
            {Icon && (
                <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
                    <Icon className="w-40 h-40 -rotate-12" />
                </div>
            )}
            <div className="relative z-10 flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-2xl font-black tracking-tight leading-tight">{title}</h2>
                    {subtitle && <p className="text-blue-100/60 text-[10px] font-bold uppercase tracking-[0.2em]">{subtitle}</p>}
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all active:scale-95 border border-white/10"
                    >
                        <X size={18} strokeWidth={2.5} />
                    </button>
                )}
            </div>
        </div>
    );
};

/**
 * Common Error Message for Forms
 */
export const FormError = ({ error }) => {
    return (
        <AnimatePresence>
            {error && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-8 px-6 py-4 bg-rose-50 border border-rose-100 text-rose-600 text-[13px] font-bold rounded-2xl flex items-center gap-3"
                >
                    <XCircle size={18} strokeWidth={2.5} />
                    {error}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

/**
 * Common Input Field for Forms
 */
export const FormInput = ({ 
    label, 
    icon: Icon, 
    type = "text", 
    placeholder, 
    value, 
    onChange, 
    error, 
    maxLength,
    ...props 
}) => {
    return (
        <div className="space-y-2 group/field w-full">
            {label && (
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 group-focus-within/field:text-[#3b52ab] transition-colors">
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within/field:text-[#3b52ab] transition-colors">
                        <Icon size={16} strokeWidth={2.5} />
                    </div>
                )}
                <input
                    type={type}
                    maxLength={maxLength}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className={`w-full ${Icon ? 'pl-11' : 'pl-5'} pr-5 py-3 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-[#3b52ab] transition-all outline-none text-sm font-bold text-slate-800 shadow-sm ${
                        error ? "border-rose-500 bg-rose-50/30" : ""
                    }`}
                    {...props}
                />
            </div>
            {error && (
                <p className="text-[10px] font-bold text-rose-500 ml-1 mt-1">{error}</p>
            )}
        </div>
    );
};

/**
 * Common Actions (Cancel/Confirm) for Forms
 */
export const FormActions = ({ onCancel, onConfirm, cancelText = "Cancel", confirmText = "Confirm", confirmIcon: ConfirmIcon, isLoading, confirmDisabled }) => {
    return (
        <div className="flex justify-end items-center gap-4 mt-12 pt-8 border-t border-slate-100">
            <button
                type="button"
                onClick={onCancel}
                className="px-8 py-3 rounded-2xl text-[10px] font-black text-slate-500 hover:bg-slate-50 transition-all uppercase tracking-widest"
            >
                {cancelText}
            </button>
            <button
                type="button"
                onClick={onConfirm}
                disabled={isLoading || confirmDisabled}
                className={`px-12 py-3 rounded-2xl text-[10px] font-black transition-all shadow-xl uppercase tracking-widest flex items-center gap-3 ${
                    !isLoading && !confirmDisabled
                    ? "bg-[#3b52ab] text-white hover:bg-[#1a2e7a] shadow-[#3b52ab]/20 active:scale-95"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                }`}
            >
                {isLoading ? (
                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    ConfirmIcon && <ConfirmIcon size={14} strokeWidth={3} />
                )}
                {isLoading ? "Syncing..." : confirmText}
            </button>
        </div>
    );
};

/**
 * Common Select Field for Forms
 */
export const FormSelect = ({ 
    label, 
    icon: Icon, 
    value, 
    onChange, 
    error, 
    options = [],
    placeholder = "Select option",
    ...props 
}) => {
    return (
        <div className="space-y-2 group/field w-full">
            {label && (
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 group-focus-within/field:text-[#3b52ab] transition-colors">
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within/field:text-[#3b52ab] transition-colors">
                        <Icon size={16} strokeWidth={2.5} />
                    </div>
                )}
                <select
                    value={value}
                    onChange={onChange}
                    className={`w-full ${Icon ? 'pl-11' : 'pl-5'} pr-10 py-3 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-[#3b52ab] transition-all outline-none appearance-none text-sm font-bold text-slate-800 shadow-sm ${
                        error ? "border-rose-500 bg-rose-50/30" : ""
                    }`}
                    {...props}
                >
                    <option value="">{placeholder}</option>
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none group-focus-within/field:text-[#3b52ab] transition-colors" />
            </div>
            {error && (
                <p className="text-[10px] font-bold text-rose-500 ml-1 mt-1">{error}</p>
            )}
        </div>
    );
};

/**
 * Common Info Display for View Modals
 */
export const FormInfo = ({ label, value, icon: Icon }) => {
    return (
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all">
            <div className="flex items-center gap-2 mb-1 opacity-60">
                {Icon && <Icon size={12} strokeWidth={3} className="text-slate-400" />}
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
            </div>
            <p className="text-[13px] font-extrabold text-slate-800 leading-tight">{value || "---"}</p>
        </div>
    );
};

/**
 * Common Text Area for Forms
 */
export const FormTextArea = ({ 
    label, 
    icon: Icon, 
    placeholder, 
    value, 
    onChange, 
    error, 
    rows = 4,
    ...props 
}) => {
    return (
        <div className="space-y-2 group/field w-full">
            {label && (
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 group-focus-within/field:text-[#3b52ab] transition-colors">
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute top-4 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within/field:text-[#3b52ab] transition-colors">
                        <Icon size={16} strokeWidth={2.5} />
                    </div>
                )}
                <textarea
                    rows={rows}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className={`w-full ${Icon ? 'pl-11' : 'pl-5'} pr-5 py-3.5 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-[#3b52ab] transition-all outline-none text-sm font-bold text-slate-800 shadow-sm resize-none ${
                        error ? "border-rose-500 bg-rose-50/30" : ""
                    }`}
                    {...props}
                />
            </div>
            {error && (
                <p className="text-[10px] font-bold text-rose-500 ml-1 mt-1">{error}</p>
            )}
        </div>
    );
};

/**
 * Common Section Header for Complex Forms
 */
export const FormSection = ({ title, description, icon: Icon, children }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-2">
            <div className="lg:col-span-4 space-y-1.5">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-xl text-slate-500">
                        {Icon && <Icon size={16} strokeWidth={2.5} />}
                    </div>
                    <h3 className="text-[13px] font-black text-slate-800 uppercase tracking-widest">{title}</h3>
                </div>
                {description && <p className="text-[10px] font-bold text-slate-400 leading-relaxed pl-1">{description}</p>}
            </div>
            <div className="lg:col-span-8 space-y-5">
                {children}
            </div>
        </div>
    );
};

/**
 * Common Checkbox for Forms
 */
export const FormCheckbox = ({ label, checked, onChange, error }) => {
    return (
        <div className="space-y-2">
            <label className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border-2 border-transparent hover:border-slate-100 transition-all cursor-pointer group">
                <div className={`mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${
                    checked 
                    ? 'bg-[#3b52ab] border-[#3b52ab]' 
                    : 'bg-white border-slate-200 group-hover:border-slate-300'
                }`}>
                    <input
                        type="checkbox"
                        className="hidden"
                        checked={checked}
                        onChange={(e) => onChange(e.target.checked)}
                    />
                    {checked && (
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                </div>
                <span className="text-xs font-bold text-slate-600 leading-tight select-none">
                    {label}
                </span>
            </label>
            {error && (
                <p className="text-[10px] font-bold text-rose-500 ml-1">{error}</p>
            )}
        </div>
    );
};
