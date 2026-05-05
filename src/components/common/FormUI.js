import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, XCircle } from "lucide-react";

/**
 * Common Modal Wrapper for Forms
 */
export const FormModal = ({ isOpen, onClose, children, maxWidth = "max-w-lg" }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/60 backdrop-blur-md px-4 overflow-y-auto py-8">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className={`bg-white rounded-[28px] shadow-2xl w-full ${maxWidth} overflow-hidden relative z-10`}
                >
                    {children}
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

/**
 * Common Header for Forms
 */
export const FormHeader = ({ title, subtitle, icon: Icon, onClose }) => {
    return (
        <div className="bg-gradient-to-r from-[#1a2e7a] to-[#2a44a1] p-8 text-white relative overflow-hidden">
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
        <div className="space-y-2">
            {label && (
                <label className="text-[13px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                    {label}
                </label>
            )}
            <div className="relative group">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                        <Icon className="w-5 h-5" />
                    </div>
                )}
                <input
                    type={type}
                    maxLength={maxLength}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className={`w-full ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-4 rounded-2xl border bg-slate-50/50 text-[15px] font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all ${
                        error
                            ? "border-rose-300 focus:border-rose-500"
                            : "border-slate-200 focus:border-indigo-500 focus:bg-white"
                    }`}
                    {...props}
                />
            </div>
        </div>
    );
};

/**
 * Common Actions (Cancel/Confirm) for Forms
 */
export const FormActions = ({ onCancel, onConfirm, cancelText = "Cancel", confirmText = "Confirm & Save", confirmIcon: ConfirmIcon }) => {
    return (
        <div className="flex items-center gap-4 mt-10">
            <button
                onClick={onCancel}
                className="flex-1 py-4 text-[15px] font-bold text-slate-600 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all active:scale-[0.98]"
            >
                {cancelText}
            </button>
            <button
                onClick={onConfirm}
                className="flex-[1.5] py-4 text-[15px] font-bold text-white bg-gradient-to-r from-[#1a2e7a] to-[#2a44a1] rounded-2xl shadow-xl shadow-indigo-900/20 hover:shadow-2xl hover:shadow-indigo-900/30 hover:-translate-y-0.5 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
                {ConfirmIcon && <ConfirmIcon className="w-5 h-5" />}
                <span>{confirmText}</span>
            </button>
        </div>
    );
};

/**
 * Common Info Display for View Modals
 */
export const FormInfo = ({ label, value }) => {
    return (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 transition-all hover:bg-slate-100/50">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">{label}</p>
            <p className="text-[15px] font-bold text-slate-800 ml-1">{value || "N/A"}</p>
        </div>
    );
};

