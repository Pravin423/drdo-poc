"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, UserPlus, Eye, Upload, FileText } from "lucide-react";

export default function CrpRegisterModal({
  isOpen, onClose,
  isEditMode, formStep, setFormStep,
  form, setForm,
  formErrors, setFormErrors,
  documents, setDocuments,
  documentPreviews, setDocumentPreviews,
  docErrors, setDocErrors,
  confirmChecked, setConfirmChecked,
  isSubmitting,
  handleNextStep, handleSubmit,
  handleDocumentChange,
}) {
  const clearErr = (f) => setFormErrors((p) => { const n = { ...p }; delete n[f]; return n; });

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-500 backdrop-blur-sm px-4">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white w-full max-w-4xl rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200"
          >
            {/* Header */}
            <div className="relative h-28 bg-gradient-to-r from-slate-800 to-slate-900 px-8 flex items-center">
              <div className="flex items-center gap-5">
                <div className="p-3.5 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20 shadow-inner">
                  <UserPlus className="text-white" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white drop-shadow-sm">
                    {isEditMode ? "Edit CRP Profile" : "Register New CRP"}
                  </h2>
                  <p className="text-slate-400 text-xs font-medium mt-0.5">
                    {isEditMode
                      ? "Update the details of an existing Community Resource Person"
                      : "Onboard a new Community Resource Person to the platform"}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Steps */}
            <div className="relative overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                {formStep === 1 ? (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -32 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -32 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="max-h-[70vh] overflow-y-auto pt-8 px-8 pb-4 space-y-8 custom-scrollbar"
                  >
                    {/* Step indicator */}
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-full border ${formStep === 1 ? "bg-slate-900 text-white border-slate-900" : "bg-emerald-50 text-emerald-700 border-emerald-200"}`}>
                        <span className="w-5 h-5 flex items-center justify-center rounded-full bg-white/20">{formStep === 1 ? "1" : "✓"}</span> Fill Details
                      </div>
                      <div className="flex-1 h-px bg-slate-200" />
                      <div className={`flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-full border ${formStep === 2 ? "bg-slate-900 text-white border-slate-900" : "bg-slate-100 text-slate-400 border-slate-200"}`}>
                        <span className="w-5 h-5 flex items-center justify-center rounded-full bg-white/20">2</span> Review &amp; Confirm
                      </div>
                    </div>

                    {/* Personal Information */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-1">
                        <h3 className="text-sm font-bold text-slate-900">Personal Information</h3>
                        <p className="text-xs text-slate-500 mt-1">Identity and contact information.</p>
                      </div>
                      <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Full Name */}
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name *</p>
                          <input
                            className={`w-full px-4 py-2.5 rounded-xl border focus:bg-white transition-all outline-none text-sm ${formErrors.name ? "bg-red-50 border-red-400" : "bg-slate-50 border-slate-100 focus:border-blue-500"}`}
                            placeholder="Enter name"
                            value={form.name}
                            onChange={(e) => { setForm({ ...form, name: e.target.value }); clearErr("name"); }}
                          />
                          {formErrors.name && <p className="text-xs text-red-500 mt-1 ml-1">{formErrors.name}</p>}
                        </div>
                        {/* Aadhaar */}
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Aadhaar Number *</p>
                          <input
                            type="text" inputMode="numeric" maxLength={12} placeholder="000000000000"
                            value={form.aadhaar}
                            onChange={(e) => { setForm({ ...form, aadhaar: e.target.value.replace(/\D/g, "") }); clearErr("aadhaar"); }}
                            className={`w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all ${formErrors.aadhaar ? "bg-red-50 border border-red-400" : "bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500"}`}
                          />
                          {formErrors.aadhaar && <p className="text-xs text-red-500 mt-1 ml-1">{formErrors.aadhaar}</p>}
                        </div>
                        {/* Mobile */}
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Mobile Number *</p>
                          <input
                            className={`w-full px-4 py-2.5 rounded-xl border focus:bg-white transition-all outline-none text-sm ${formErrors.mobile ? "bg-red-50 border-red-400" : "bg-slate-50 border-slate-100 focus:border-blue-500"}`}
                            placeholder="10-digit mobile"
                            value={form.mobile}
                            onChange={(e) => { setForm({ ...form, mobile: e.target.value.replace(/\D/g, "") }); clearErr("mobile"); }}
                          />
                          {formErrors.mobile && <p className="text-xs text-red-500 mt-1 ml-1">{formErrors.mobile}</p>}
                        </div>
                        {/* Email */}
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</p>
                          <input
                            className={`w-full px-4 py-2.5 rounded-xl border focus:bg-white transition-all outline-none text-sm ${formErrors.email ? "bg-red-50 border-red-400" : "bg-slate-50 border-slate-100 focus:border-blue-500"}`}
                            placeholder="email@domain.com"
                            value={form.email}
                            onChange={(e) => { setForm({ ...form, email: e.target.value }); clearErr("email"); }}
                          />
                          {formErrors.email && <p className="text-xs text-red-500 mt-1 ml-1">{formErrors.email}</p>}
                        </div>
                        {/* DOB */}
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Date of Birth *</p>
                          <input
                            type="date"
                            className={`w-full px-4 py-2.5 rounded-xl border focus:bg-white transition-all outline-none text-sm text-slate-600 ${formErrors.dob ? "bg-red-50 border-red-400" : "bg-slate-50 border-slate-100 focus:border-blue-500"}`}
                            value={form.dob}
                            onChange={(e) => { setForm({ ...form, dob: e.target.value }); clearErr("dob"); }}
                          />
                          {formErrors.dob && <p className="text-xs text-red-500 mt-1 ml-1">{formErrors.dob}</p>}
                        </div>
                        {/* Gender */}
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Gender *</p>
                          <select
                            className={`w-full px-4 py-2.5 rounded-xl border focus:bg-white transition-all outline-none text-sm text-slate-600 ${formErrors.gender ? "bg-red-50 border-red-400" : "bg-slate-50 border-slate-100 focus:border-blue-500"}`}
                            value={form.gender}
                            onChange={(e) => { setForm({ ...form, gender: e.target.value }); clearErr("gender"); }}
                          >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                          </select>
                          {formErrors.gender && <p className="text-xs text-red-500 mt-1 ml-1">{formErrors.gender}</p>}
                        </div>
                      </div>
                    </div>

                    {/* Financial Information */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-1">
                        <h3 className="text-sm font-bold text-slate-900">Financial Information</h3>
                        <p className="text-xs text-slate-500 mt-1">Banking and payment details.</p>
                      </div>
                      <div className="md:col-span-2 grid grid-cols-2 gap-4">
                        {[
                          { key: "bankName", label: "Bank Name", placeholder: "e.g. Punjab National Bank" },
                          { key: "branchName", label: "Branch Name", placeholder: "e.g. Panaji Main Branch" },
                          { key: "bankAccount", label: "Account Number", placeholder: "Account Number", numeric: true },
                          { key: "ifsc", label: "IFSC Code", placeholder: "e.g. PUNB0026000", upper: true },
                        ].map(({ key, label, placeholder, numeric, upper }) => (
                          <div key={key} className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{label} <span className="text-red-400">*</span></p>
                            <input
                              className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:bg-white transition-all ${formErrors[key] ? "bg-red-50 border-red-400" : "bg-slate-50 border-slate-100 focus:border-blue-500"}`}
                              placeholder={placeholder}
                              value={form[key]}
                              onChange={(e) => {
                                let val = e.target.value;
                                if (numeric) val = val.replace(/\D/g, "");
                                if (upper) val = val.toUpperCase();
                                setForm({ ...form, [key]: val });
                                clearErr(key);
                              }}
                            />
                            {formErrors[key] && <p className="text-xs text-red-500 mt-1 ml-1">{formErrors[key]}</p>}
                          </div>
                        ))}

                        {/* Passbook upload */}
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Pass Book</p>
                          <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-center gap-3">
                            <div className="bg-white rounded-lg shadow-sm w-12 h-12 flex justify-center items-center shrink-0 overflow-hidden border border-slate-100 text-blue-600">
                              {documentPreviews.passBook ? (
                                documents.passBook?.type === "application/pdf" || documents.passBook?.name?.toLowerCase().endsWith(".pdf")
                                  ? <FileText size={20} className="text-blue-600" />
                                  : <img src={documentPreviews.passBook} alt="preview" className="w-full h-full object-cover" />
                              ) : <Upload size={20} className="text-blue-600" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest truncate">Pass Book</p>
                              <p className="text-xs text-slate-500 truncate pr-2">{documents.passBook ? documents.passBook.name : "Bank details (Max 5MB)"}</p>
                              {docErrors.passBook && <p className="text-xs text-red-500 mt-1">{docErrors.passBook}</p>}
                            </div>
                            <input type="file" id="doc-upload-passBook" className="hidden" onChange={handleDocumentChange("passBook")} accept=".jpeg,.jpg,.png,.pdf,image/jpeg,image/png,application/pdf" />
                            <label htmlFor="doc-upload-passBook" className="shrink-0 px-3 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-lg cursor-pointer hover:bg-blue-700 transition-colors">BROWSE</label>
                          </div>
                        </div>

                        {/* PAN */}
                        <div className="col-span-2 space-y-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">PAN Card Number</p>
                          <input
                            className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:bg-white transition-all ${formErrors.pan ? "bg-red-50 border-red-400" : "bg-slate-50 border-slate-100 focus:border-blue-500"}`}
                            placeholder="e.g. ABCDE1234F"
                            value={form.pan}
                            onChange={(e) => { setForm({ ...form, pan: e.target.value.toUpperCase() }); clearErr("pan"); }}
                          />
                          {formErrors.pan && <p className="text-xs text-red-500 mt-1 ml-1">{formErrors.pan}</p>}
                        </div>
                      </div>
                    </div>

                    <hr className="border-slate-100" />

                    {/* Document Upload */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-1">
                        <h3 className="text-sm font-bold text-slate-900">Document Upload</h3>
                        <p className="text-xs text-slate-500 mt-1">Verification documents.</p>
                      </div>
                      <div className="md:col-span-2 space-y-4">
                        {[
                          { id: "profilePhoto", label: "Profile Photo", desc: "Passport size photo (Max 5MB)", required: true },
                          { id: "aadhaarCard", label: "Aadhaar Card", desc: "Front and back side (Max 5MB)", required: true },
                          { id: "panCard", label: "PAN Card", desc: "Clear copy (Max 5MB)", required: true },
                          { id: "educationalCertificates", label: "Educational Certificates", desc: "Highest qualification (Max 5MB)", required: true },
                        ].map((doc) => (
                          <div key={doc.id} className={`p-4 rounded-2xl flex items-center gap-3 border ${formErrors[doc.id] ? "bg-red-50 border-red-300" : "bg-blue-50/50 border-blue-100"}`}>
                            <div className="bg-white rounded-lg shadow-sm w-12 h-12 flex justify-center items-center shrink-0 overflow-hidden border border-slate-100">
                              {documentPreviews[doc.id] ? (
                                documents[doc.id]?.type === "application/pdf" || documents[doc.id]?.name?.toLowerCase().endsWith(".pdf")
                                  ? <FileText size={20} className="text-blue-600" />
                                  : <img src={documentPreviews[doc.id]} alt="preview" className="w-full h-full object-cover" />
                              ) : <Upload size={20} className={formErrors[doc.id] ? "text-red-400" : "text-blue-600"} />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-[10px] font-bold uppercase tracking-widest truncate ${formErrors[doc.id] ? "text-red-500" : "text-blue-600"}`}>
                                {doc.label}{doc.required && <span className="text-red-400 ml-0.5">*</span>}
                              </p>
                              <p className="text-xs text-slate-500 truncate pr-2">{documents[doc.id] ? documents[doc.id].name : doc.desc}</p>
                              {formErrors[doc.id] && <p className="text-xs text-red-500 mt-0.5">{formErrors[doc.id]}</p>}
                              {docErrors[doc.id] && <p className="text-xs text-red-500 mt-0.5">{docErrors[doc.id]}</p>}
                            </div>
                            <input type="file" id={`doc-upload-${doc.id}`} className="hidden"
                              onChange={(e) => { handleDocumentChange(doc.id)(e); clearErr(doc.id); }}
                              accept=".jpeg,.jpg,.png,.pdf,image/jpeg,image/png,application/pdf" />
                            <label htmlFor={`doc-upload-${doc.id}`} className="px-3 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-lg cursor-pointer hover:bg-blue-700 transition-colors">BROWSE</label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 32 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 32 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="max-h-[70vh] overflow-y-auto pt-8 px-8 pb-4 space-y-6 custom-scrollbar"
                  >
                    {/* Step indicator */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200">
                        <span className="w-5 h-5 flex items-center justify-center rounded-full bg-emerald-100">✓</span> Fill Details
                      </div>
                      <div className="flex-1 h-px bg-emerald-200" />
                      <div className="flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-full border bg-slate-900 text-white border-slate-900">
                        <span className="w-5 h-5 flex items-center justify-center rounded-full bg-white/20">2</span> Review &amp; Confirm
                      </div>
                    </div>

                    <div className="rounded-2xl bg-blue-50 border border-blue-100 px-5 py-4 flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-xl text-blue-600"><Eye size={18} /></div>
                      <div>
                        <p className="text-sm font-bold text-blue-800">Review before submitting</p>
                        <p className="text-xs text-blue-500 mt-0.5">Please verify all information is accurate. You can go back to edit.</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* Personal */}
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Personal Information</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {[
                            { label: "Full Name", value: form.name },
                            { label: "Aadhaar", value: form.aadhaar },
                            { label: "Mobile", value: form.mobile },
                            { label: "Email", value: form.email || "—" },
                            { label: "Date of Birth", value: form.dob },
                            { label: "Gender", value: form.gender },
                          ].map((item) => (
                            <div key={item.label} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">{item.label}</p>
                              <p className="text-sm font-bold text-slate-800 truncate">{item.value}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Financial */}
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Financial Information</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {[
                            { label: "Bank Name", value: form.bankName || "—" },
                            { label: "Branch Name", value: form.branchName || "—" },
                            { label: "Account Number", value: form.bankAccount || "—" },
                            { label: "IFSC Code", value: form.ifsc || "—" },
                            { label: "PAN Card", value: form.pan || "—" },
                          ].map((item) => (
                            <div key={item.label} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">{item.label}</p>
                              <p className="text-sm font-bold text-slate-800 truncate">{item.value}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Documents */}
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Uploaded Documents</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {[
                            { id: "profilePhoto", label: "Profile Photo" },
                            { id: "aadhaarCard", label: "Aadhaar Card" },
                            { id: "panCard", label: "PAN Card" },
                            { id: "educationalCertificates", label: "Edu. Certificates" },
                            { id: "passBook", label: "Pass Book" },
                          ].map((doc) => (
                            <div key={doc.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50 flex flex-col items-center gap-2 text-center">
                              <div className="w-14 h-14 rounded-xl overflow-hidden bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                                {documentPreviews[doc.id] ? (
                                  documents[doc.id]?.type === "application/pdf" || documents[doc.id]?.name?.toLowerCase().endsWith(".pdf")
                                    ? <FileText size={24} className="text-blue-500" />
                                    : <img src={documentPreviews[doc.id]} alt={doc.label} className="w-full h-full object-cover" />
                                ) : <Upload size={20} className="text-slate-300" />}
                              </div>
                              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">{doc.label}</p>
                              <p className="text-[10px] text-slate-400 truncate w-full">
                                {documents[doc.id]
                                  ? <span className="text-emerald-600 font-semibold">✓ Uploaded</span>
                                  : <span className="text-slate-300">Not uploaded</span>}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Confirmation */}
                      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={confirmChecked}
                            onChange={(e) => setConfirmChecked(e.target.checked)}
                            className="mt-1 w-4 h-4 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                          />
                          <span className="text-xs text-amber-800 leading-relaxed font-medium">
                            I confirm that all the information provided above is accurate and complete. I understand that any discrepancies may lead to the rejection of this registration.
                          </span>
                        </label>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="px-8 py-5 bg-slate-50/80 border-t flex justify-end items-center gap-3">
              <button
                onClick={() => {
                  if (formStep === 2) { setFormStep(1); setConfirmChecked(false); }
                  else { onClose(); }
                }}
                className="px-6 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-white transition-all shadow-sm"
              >
                {formStep === 2 ? "← Back" : "Cancel"}
              </button>

              {formStep === 1 ? (
                <button
                  onClick={handleNextStep}
                  className="px-8 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-slate-200 bg-slate-900 text-white hover:bg-slate-800 active:scale-95"
                >
                  Next: Preview →
                </button>
              ) : (
                <button
                  disabled={!confirmChecked || isSubmitting}
                  onClick={handleSubmit}
                  className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-slate-200 flex items-center gap-2 ${
                    confirmChecked && !isSubmitting
                      ? "bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95"
                      : "bg-slate-300 text-white cursor-not-allowed"
                  }`}
                >
                  {isSubmitting ? "Processing..." : isEditMode ? "✓ Confirm & Update CRP" : "✓ Confirm & Register CRP"}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
