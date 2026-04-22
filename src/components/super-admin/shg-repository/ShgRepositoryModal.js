"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Aperture } from "lucide-react";

export default function ShgRepositoryModal({
  isOpen,
  onClose,
  modalMode,
  formData,
  handleChange,
  handleSubmit,
  isSubmitting,
  districts,
  talukas,
  villages
}) {
  const inputClasses = "w-full px-4 py-2.5 rounded-xl border focus:bg-white transition-all outline-none text-sm bg-slate-50 border-slate-100 focus:border-blue-500";
  const labelClasses = "text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="bg-white w-full max-w-4xl rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200"
          >
            <div className="relative h-28 bg-gradient-to-r from-slate-800 to-slate-900 px-8 flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="p-3.5 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20 shadow-inner">
                  <Aperture className="text-white" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white drop-shadow-sm">{modalMode === "edit" ? "Edit SHG" : "Create SHG"}</h2>
                  <p className="text-slate-400 text-xs font-medium mt-0.5">{modalMode === "edit" ? "Update details of the Self Help Group" : "Register a new Self Help Group"}</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="relative overflow-hidden">
              <div className="max-h-[70vh] overflow-y-auto pt-8 px-8 pb-4 custom-scrollbar">
                <form onSubmit={handleSubmit} className="space-y-8">

                  {/* Group 1: General Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                      <h3 className="text-sm font-bold text-slate-900">Group Information</h3>
                      <p className="text-xs text-slate-500 mt-1">Core details and contact individual for the Self Help Group.</p>
                    </div>
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">

                      <div className="space-y-1">
                        <p className={labelClasses}>
                          SHG Name <span className="text-red-400">*</span>
                        </p>
                        <input
                          type="text"
                          name="shgName"
                          value={formData.shgName}
                          onChange={handleChange}
                          placeholder="Enter SHG Name"
                          required
                          className={inputClasses}
                        />
                      </div>

                      <div className="hidden md:block"></div>

                      <div className="space-y-1">
                        <p className={labelClasses}>
                          Contact Person Name <span className="text-red-400">*</span>
                        </p>
                        <input
                          type="text"
                          name="contactPersonName"
                          value={formData.contactPersonName}
                          onChange={handleChange}
                          placeholder="Enter full name"
                          required
                          className={inputClasses}
                        />
                      </div>

                      <div className="space-y-1">
                        <p className={labelClasses}>
                          Contact Person Mobile <span className="text-red-400">*</span>
                        </p>
                        <input
                          type="tel"
                          name="contactPersonMobile"
                          value={formData.contactPersonMobile}
                          onChange={handleChange}
                          placeholder="10-digit mobile number"
                          maxLength={10}
                          required
                          className={inputClasses}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="h-px w-full bg-slate-100" />

                  {/* Group 2: Location Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                      <h3 className="text-sm font-bold text-slate-900">Location Settings</h3>
                      <p className="text-xs text-slate-500 mt-1">Specify where this SHG operates.</p>
                    </div>
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">

                      <div className="space-y-1">
                        <p className={labelClasses}>
                          District <span className="text-red-400">*</span>
                        </p>
                        <select
                          name="district"
                          value={formData.district}
                          onChange={handleChange}
                          required
                          className={inputClasses}
                        >
                          <option value="" disabled>Choose District...</option>
                          {districts.map(d => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="hidden md:block"></div>

                      <div className="space-y-1">
                        <p className={labelClasses}>
                          Taluka <span className="text-red-400">*</span>
                        </p>
                        <select
                          name="taluka"
                          value={formData.taluka}
                          onChange={handleChange}
                          required
                          disabled={!formData.district || talukas.length === 0}
                          className={`${inputClasses} disabled:opacity-50`}
                        >
                          <option value="" disabled>Choose Taluka...</option>
                          {talukas.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <p className={labelClasses}>
                          Village <span className="text-red-400">*</span>
                        </p>
                        <select
                          name="village"
                          value={formData.village}
                          onChange={handleChange}
                          required
                          disabled={!formData.taluka || villages.length === 0}
                          className={`${inputClasses} disabled:opacity-50`}
                        >
                          <option value="" disabled>Choose Village...</option>
                          {villages.map(v => (
                            <option key={v.id} value={v.id}>{v.name}</option>
                          ))}
                        </select>
                      </div>

                      {modalMode === "edit" && (
                        <div className="space-y-1">
                          <p className={labelClasses}>
                            Status <span className="text-red-400">*</span>
                          </p>
                          <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            required
                            className={inputClasses}
                          >
                            <option value={0}>Active</option>
                            <option value={1}>Deactive</option>
                          </select>
                        </div>
                      )}

                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-bold rounded-xl transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Submitting..." : "Submit"}
                    </button>
                  </div>

                </form>
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
