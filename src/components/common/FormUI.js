import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, XCircle, ChevronDown } from "lucide-react";

/**
 * Common Modal Wrapper for Forms
 */
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
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[4px] pointer-events-auto transition-all duration-300"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", damping: 30, stiffness: 400 }}
                        className={`relative w-full ${maxWidth} max-h-[90vh] bg-white rounded-[40px] shadow-[0_30px_70px_-10px_rgba(0,0,0,0.15)] overflow-hidden border border-slate-100 flex flex-col pointer-events-auto transform-gpu will-change-transform overscroll-contain`}
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
        <div className="bg-gradient-to-r from-[#3b52ab] to-[#1a2e7a] p-8 text-white relative overflow-hidden">
            {Icon && (
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Icon className="w-24 h-24 rotate-12" />
                </div>
            )}
            <div className="relative z-10 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black tracking-tight">{title}</h2>
                    {subtitle && <p className="text-indigo-100/80 text-sm font-medium mt-1">{subtitle}</p>}
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all backdrop-blur-sm"
                    >
                        <X className="w-5 h-5" />
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
                    className="mb-6 px-5 py-4 bg-rose-50 border border-rose-100 text-rose-600 text-sm font-semibold rounded-2xl flex items-center gap-3"
                >
                    <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                        <XCircle className="w-4 h-4" />
                    </div>
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
        <div className="space-y-2 group/field">
            {label && (
                <label className="text-[13px] font-bold text-slate-500 uppercase tracking-wider ml-1 group-focus-within/field:text-[#3b52ab] transition-colors duration-300">
                    {label}
                </label>
            )}
            <div className="relative group/input">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within/input:text-[#3b52ab] transition-colors duration-300">
                        <Icon className="w-5 h-5 group-hover/input:scale-110 transition-transform duration-300" />
                    </div>
                )}
                <input
                    type={type}
                    maxLength={maxLength}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className={`w-full ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-4 rounded-2xl border bg-slate-50/50 text-[15px] font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#3b52ab]/10 transition-all duration-300 ${
                        error
                            ? "border-rose-300 focus:border-rose-500 shadow-sm shadow-rose-100"
                            : "border-slate-100 hover:border-slate-300 focus:border-[#3b52ab] focus:bg-white focus:shadow-sm"
                    }`}
                    {...props}
                />
            </div>
            {error && (
                <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[11px] font-bold text-rose-500 ml-1 mt-1 flex items-center gap-1.5"
                >
                    <span className="w-1 h-1 rounded-full bg-rose-500" />
                    {error}
                </motion.p>
            )}
        </div>
    );
};


/**
 * Common Actions (Cancel/Confirm) for Forms
 */
export const FormActions = ({ onCancel, onConfirm, cancelText = "Cancel", confirmText = "Confirm & Save", confirmIcon: ConfirmIcon, isLoading }) => {
    return (
        <div className="flex items-center gap-4 mt-10">
            <button
                onClick={onCancel}
                disabled={isLoading}
                className="flex-1 py-4 text-[15px] font-bold text-slate-600 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all duration-300 active:scale-[0.98] disabled:opacity-50"
            >
                {cancelText}
            </button>
            <button
                onClick={onConfirm}
                disabled={isLoading}
                className="flex-[1.5] py-4 text-[15px] font-bold text-white bg-gradient-to-r from-[#3b52ab] to-[#1a2e7a] rounded-2xl shadow-xl shadow-[#1a2e7a]/10 hover:shadow-2xl hover:shadow-[#1a2e7a]/20 hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-60"
            >
                {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    ConfirmIcon && <ConfirmIcon className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                )}
                <span>{isLoading ? "Processing..." : confirmText}</span>
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
        <div className="space-y-2 group/field">
            {label && (
                <label className="text-[13px] font-bold text-slate-500 uppercase tracking-wider ml-1 group-focus-within/field:text-[#3b52ab] transition-colors duration-300">
                    {label}
                </label>
            )}
            <div className="relative group/input">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within/input:text-[#3b52ab] transition-colors duration-300">
                        <Icon className="w-5 h-5 group-hover/input:scale-110 transition-transform duration-300" />
                    </div>
                )}
                <select
                    value={value}
                    onChange={onChange}
                    className={`w-full ${Icon ? 'pl-12' : 'pl-4'} pr-10 py-4 rounded-2xl border bg-slate-50/50 text-[15px] font-semibold text-slate-800 focus:outline-none focus:ring-4 focus:ring-[#3b52ab]/10 transition-all duration-300 appearance-none cursor-pointer ${
                        error
                            ? "border-rose-300 focus:border-rose-500"
                            : "border-slate-100 hover:border-slate-300 focus:border-[#3b52ab] focus:bg-white focus:shadow-sm"
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
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400 group-focus-within/input:text-[#3b52ab] transition-colors duration-300">
                    <ChevronDown className="w-4 h-4 group-hover/input:translate-y-0.5 transition-transform duration-300" />
                </div>
            </div>
            {error && (
                <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[11px] font-bold text-rose-500 ml-1 mt-1 flex items-center gap-1.5"
                >
                    <span className="w-1 h-1 rounded-full bg-rose-500" />
                    {error}
                </motion.p>
            )}
        </div>
    );
};


/**
 * Common Info Display for View Modals
 */
export const FormInfo = ({ label, value, icon: Icon }) => {
    return (
        <div className="p-5 rounded-[28px] bg-slate-50/50 border border-slate-100 transition-all duration-300 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-200 group">
            <div className="flex items-center gap-2 mb-1.5 ml-1">
                {Icon && <Icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#3b52ab] transition-colors" />}
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest group-hover:text-[#3b52ab] transition-colors">{label}</p>
            </div>
            <p className="text-[15px] font-black text-slate-800 ml-1 leading-tight">{value || "N/A"}</p>
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
        <div className="space-y-2 group/field">
            {label && (
                <label className="text-[13px] font-bold text-slate-500 uppercase tracking-wider ml-1 group-focus-within/field:text-[#3b52ab] transition-colors duration-300">
                    {label}
                </label>
            )}
            <div className="relative group/input">
                {Icon && (
                    <div className="absolute top-4 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within/input:text-[#3b52ab] transition-colors duration-300">
                        <Icon className="w-5 h-5 group-hover/input:scale-110 transition-transform duration-300" />
                    </div>
                )}
                <textarea
                    rows={rows}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className={`w-full ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-4 rounded-2xl border bg-slate-50/50 text-[15px] font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#3b52ab]/10 transition-all duration-300 resize-none ${
                        error
                            ? "border-rose-300 focus:border-rose-500 shadow-sm shadow-rose-100"
                            : "border-slate-100 hover:border-slate-300 focus:border-[#3b52ab] focus:bg-white focus:shadow-sm"
                    }`}
                    {...props}
                />
            </div>
            {error && (
                <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[11px] font-bold text-rose-500 ml-1 mt-1 flex items-center gap-1.5"
                >
                    <span className="w-1 h-1 rounded-full bg-rose-500" />
                    {error}
                </motion.p>
            )}
        </div>
    );
};
