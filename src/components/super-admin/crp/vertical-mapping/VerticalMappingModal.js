"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle } from "lucide-react";

const ChevronDown = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

function SelectField({ label, value, onChange, options, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-600 mb-2">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          className="w-full border border-slate-200 text-slate-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none bg-white cursor-pointer hover:border-slate-300"
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map(({ key, value: val, label: lbl }) => (
            <option key={key} value={val}>{lbl}</option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
          <ChevronDown />
        </div>
      </div>
    </div>
  );
}

export default function VerticalMappingModal({
  isOpen,
  onClose,
  title,
  crps,
  verticals,
  formData,
  setFormData,
  onSave,
  isSaving,
  apiError,
  saveLabel = "Save Mapping",
}) {
  const crpOptions = crps.map((crp) => ({
    key: crp.id || crp.crp_id,
    value: crp.id || crp.crp_id,
    label: crp.fullname || crp.name || `CRP ${crp.id}`,
  }));

  const verticalOptions = verticals.map((v) => ({
    key: v.id || v.vertical_id,
    value: v.id || v.vertical_id,
    label: v.title || v.name || v.vertical_name || `Vertical ${v.id}`,
  }));

  const statusOptions = [
    { key: 0, value: 0, label: "Active" },
    { key: 1, value: 1, label: "Inactive" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="bg-white w-full max-w-2xl rounded-xl shadow-2xl border border-slate-200 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-700">{title}</h2>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Error banner */}
              {apiError && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl border border-red-200 text-sm font-medium flex items-center gap-3">
                  <AlertCircle size={18} className="shrink-0" />
                  <span>{apiError}</span>
                </div>
              )}

              <SelectField
                label="Select CRP"
                value={formData.crpuser}
                onChange={(e) => setFormData({ ...formData, crpuser: e.target.value })}
                options={crpOptions}
                placeholder="Select CRP"
              />

              <SelectField
                label="Select Vertical"
                value={formData.vertical_id}
                onChange={(e) => setFormData({ ...formData, vertical_id: e.target.value })}
                options={verticalOptions}
                placeholder="Select Vertical"
              />

              <SelectField
                label="Status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: Number(e.target.value) })}
                options={statusOptions}
              />
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-white">
              <button
                onClick={onClose}
                className="px-5 py-2 text-sm font-medium text-white bg-slate-500 hover:bg-slate-600 rounded-lg transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={onSave}
                disabled={isSaving}
                className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                {isSaving ? "Saving..." : saveLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
