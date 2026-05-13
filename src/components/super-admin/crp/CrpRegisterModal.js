"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UserPlus, Eye, Upload, FileText, Landmark, User, CreditCard, Calendar, Users } from "lucide-react";
import { FormModal, FormHeader, FormInput, FormSelect, FormActions } from "@/components/common/FormUI";

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
  errorTrigger,
}) {
  const clearErr = (f) => setFormErrors((p) => { const n = { ...p }; delete n[f]; return n; });
  
  const scrollRef = useRef(null);

  // Auto-scroll to the first validation error when explicit errorTrigger event fires
  useEffect(() => {
    if (errorTrigger > 0 && scrollRef.current) {
      setTimeout(() => {
        // Find first visual error element (input error paragraph, or document card error)
        const firstErrorEl = scrollRef.current.querySelector(".text-rose-500, .border-rose-200, .text-rose-600");
        if (firstErrorEl) {
          // Scroll so that the error is positioned in the center of the viewport smoothly
          firstErrorEl.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
          // Fallback: scroll back to top if we couldn't locate specific field
          scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
        }
      }, 100);
    }
  }, [errorTrigger]);

  const renderStep1 = () => (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="p-8 space-y-10"
    >
      {/* Step Indicator */}
      <div className="flex items-center gap-4 max-w-md mx-auto">
        <div className="flex flex-col items-center gap-2 flex-1">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-lg shadow-indigo-200"
          >
            1
          </motion.div>
          <span className="text-[11px] font-black uppercase tracking-wider text-indigo-600">Details</span>
        </div>
        <div className="h-1 bg-slate-100 flex-1 mb-6 rounded-full overflow-hidden">
            <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "0%" }}
                className="h-full bg-indigo-600"
            />
        </div>
        <div className="flex flex-col items-center gap-2 flex-1 opacity-40">
          <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center font-bold">2</div>
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">Review</span>
        </div>
      </div>

      {/* Personal Information */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
          <div className="p-2.5 bg-indigo-50 rounded-2xl text-indigo-600">
            <User size={18} />
          </div>
          <h3 className="text-base font-bold text-slate-800">Personal Information</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Full Name *"
            icon={User}
            placeholder="Enter full name"
            value={form.name}
            onChange={(e) => { setForm({ ...form, name: e.target.value }); clearErr("name"); }}
            error={formErrors.name}
          />
          <FormInput
            label="Aadhaar Number *"
            icon={CreditCard}
            placeholder="0000 0000 0000"
            maxLength={12}
            value={form.aadhaar}
            onChange={(e) => { setForm({ ...form, aadhaar: e.target.value.replace(/\D/g, "") }); clearErr("aadhaar"); }}
            error={formErrors.aadhaar}
          />
          <FormInput
            label="Mobile Number *"
            icon={User}
            placeholder="Enter mobile number"
            maxLength={10}
            value={form.mobile}
            onChange={(e) => { setForm({ ...form, mobile: e.target.value.replace(/\D/g, "") }); clearErr("mobile"); }}
            error={formErrors.mobile}
          />
          <FormInput
            label="Email Address"
            icon={User}
            placeholder="email@domain.com"
            value={form.email}
            onChange={(e) => { setForm({ ...form, email: e.target.value }); clearErr("email"); }}
            error={formErrors.email}
          />
          <FormInput
            label="Date of Birth *"
            icon={Calendar}
            type="date"
            value={form.dob}
            onChange={(e) => { setForm({ ...form, dob: e.target.value }); clearErr("dob"); }}
            error={formErrors.dob}
          />
          <FormSelect
            label="Gender *"
            icon={Users}
            placeholder="Select Gender"
            value={form.gender}
            onChange={(e) => { setForm({ ...form, gender: e.target.value }); clearErr("gender"); }}
            options={[
              { label: "Male", value: "Male" },
              { label: "Female", value: "Female" },
              { label: "Other", value: "Other" }
            ]}
            error={formErrors.gender}
          />
        </div>
      </div>

      {/* Financial Information */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
          <div className="p-2.5 bg-emerald-50 rounded-2xl text-emerald-600">
            <Landmark size={18} />
          </div>
          <h3 className="text-base font-bold text-slate-800">Financial Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Bank Name *"
            icon={Landmark}
            placeholder="e.g. State Bank of India"
            value={form.bankName}
            onChange={(e) => { setForm({ ...form, bankName: e.target.value }); clearErr("bankName"); }}
            error={formErrors.bankName}
          />
          <FormInput
            label="Branch Name *"
            icon={Landmark}
            placeholder="e.g. Panaji Branch"
            value={form.branchName}
            onChange={(e) => { setForm({ ...form, branchName: e.target.value }); clearErr("branchName"); }}
            error={formErrors.branchName}
          />
          <FormInput
            label="Account Number *"
            icon={CreditCard}
            placeholder="Enter account number"
            value={form.bankAccount}
            onChange={(e) => { setForm({ ...form, bankAccount: e.target.value.replace(/\D/g, "") }); clearErr("bankAccount"); }}
            error={formErrors.bankAccount}
          />
          <FormInput
            label="IFSC Code *"
            icon={Landmark}
            placeholder="e.g. SBIN0000001"
            value={form.ifsc}
            onChange={(e) => { setForm({ ...form, ifsc: e.target.value.toUpperCase() }); clearErr("ifsc"); }}
            error={formErrors.ifsc}
          />
          <div className="md:col-span-2">
            <FormInput
              label="PAN Card Number"
              icon={CreditCard}
              placeholder="e.g. ABCDE1234F"
              value={form.pan}
              onChange={(e) => { setForm({ ...form, pan: e.target.value.toUpperCase() }); clearErr("pan"); }}
              error={formErrors.pan}
            />
          </div>
        </div>
      </div>

      {/* Documents */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
          <div className="p-2.5 bg-amber-50 rounded-2xl text-amber-600">
            <FileText size={18} />
          </div>
          <h3 className="text-base font-bold text-slate-800">Document Verification</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            { id: "profilePhoto", label: "Profile Photo", desc: "Max 2MB", required: true },
            { id: "aadhaarCard", label: "Aadhaar Card", desc: "Max 2MB", required: true },
            { id: "panCard", label: "PAN Card", desc: "Max 2MB", required: true },
            { id: "educationalCertificates", label: "Edu. Certificates", desc: "Max 2MB", required: true },
            { id: "passBook", label: "Bank Pass Book", desc: "Max 2MB", required: true },
          ].map((doc) => (
            <motion.div 
              key={doc.id} 
              whileHover={{ y: -2 }}
              className={`group relative p-5 rounded-[28px] border-2 border-dashed transition-all duration-300 ${
                formErrors[doc.id] || docErrors[doc.id] 
                  ? "border-rose-200 bg-rose-50/30" 
                  : documents[doc.id] 
                    ? "border-emerald-200 bg-emerald-50/40" 
                    : "border-slate-100 bg-slate-50/50 hover:border-indigo-200 hover:bg-white hover:shadow-xl hover:shadow-indigo-900/5"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-300">
                  {documentPreviews[doc.id] ? (
                    documents[doc.id]?.type === "application/pdf" || documents[doc.id]?.name?.toLowerCase().endsWith(".pdf")
                      ? <FileText size={28} className="text-indigo-600" />
                      : <img src={documentPreviews[doc.id]} alt="preview" className="w-full h-full object-cover" />
                  ) : <Upload size={28} className="text-slate-300 group-hover:text-indigo-400 transition-all" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-[11px] font-black uppercase tracking-widest ${
                    formErrors[doc.id] || docErrors[doc.id] ? "text-rose-600" : "text-slate-400 group-hover:text-indigo-500"
                  } transition-colors`}>
                    {doc.label} {doc.required && <span className="text-rose-500">*</span>}
                  </p>
                  <p className="text-[14px] font-bold text-slate-800 truncate pr-2 mt-1">
                    {documents[doc.id] ? documents[doc.id].name : doc.desc}
                  </p>
                </div>
                <input 
                  type="file" 
                  id={`doc-upload-${doc.id}`} 
                  className="hidden" 
                  onChange={(e) => { handleDocumentChange(doc.id)(e); clearErr(doc.id); }}
                  accept=".jpeg,.jpg,.png,.pdf,image/jpeg,image/png,application/pdf" 
                />
                <label 
                  htmlFor={`doc-upload-${doc.id}`} 
                  className="px-5 py-2.5 bg-white border border-slate-200 text-[11px] font-black uppercase tracking-wider text-slate-600 rounded-xl cursor-pointer hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all duration-300 shadow-sm active:scale-95"
                >
                  Browse
                </label>
              </div>
              {(formErrors[doc.id] || docErrors[doc.id]) && (
                <p className="text-[11px] font-bold text-rose-500 mt-2 ml-1">
                  {formErrors[doc.id] || docErrors[doc.id]}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <FormActions
        onCancel={onClose}
        onConfirm={handleNextStep}
        confirmText="Next: Preview Profile →"
        confirmIcon={Eye}
      />
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="p-8 space-y-10"
    >
      {/* Step Indicator */}
      <div className="flex items-center gap-4 max-w-md mx-auto">
        <div className="flex flex-col items-center gap-2 flex-1">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold shadow-lg shadow-emerald-200">✓</div>
          <span className="text-[11px] font-black uppercase tracking-wider text-emerald-600">Details</span>
        </div>
        <div className="h-1 bg-emerald-100 flex-1 mb-6 rounded-full overflow-hidden">
            <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                className="h-full bg-emerald-500"
            />
        </div>
        <div className="flex flex-col items-center gap-2 flex-1">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-lg shadow-indigo-200"
          >
            2
          </motion.div>
          <span className="text-[11px] font-black uppercase tracking-wider text-indigo-600">Review</span>
        </div>
      </div>

      <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-[32px] p-8 flex items-start gap-5 shadow-sm">
        <div className="w-14 h-14 rounded-[22px] bg-white flex items-center justify-center shadow-md text-indigo-600 shrink-0">
          <Eye size={28} />
        </div>
        <div>
          <h4 className="text-lg font-black text-indigo-900">Review CRP Profile</h4>
          <p className="text-[14px] font-medium text-indigo-600/70 mt-1 leading-relaxed">
            Please verify all information before finalizing the registration. You can always go back to make corrections.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-indigo-600 rounded-full" />
            <h5 className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-400">Personal Details</h5>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {[
              { label: "Full Name", value: form.name, icon: User },
              { label: "Aadhaar", value: form.aadhaar, icon: CreditCard },
              { label: "Mobile", value: form.mobile, icon: User },
              { label: "Email", value: form.email || "—", icon: User },
              { label: "DOB", value: form.dob, icon: Calendar },
              { label: "Gender", value: form.gender, icon: Users },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-4 p-5 bg-slate-50/50 rounded-2xl border border-slate-100/50 hover:bg-white hover:shadow-sm hover:border-slate-200 transition-all duration-300 group">
                <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm border border-slate-50 group-hover:text-indigo-600 transition-colors">
                  <item.icon size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider group-hover:text-indigo-400 transition-colors">{item.label}</p>
                  <p className="text-[15px] font-black text-slate-800">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
            <h5 className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-400">Financial Details</h5>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {[
              { label: "Bank Name", value: form.bankName, icon: Landmark },
              { label: "Branch", value: form.branchName, icon: Landmark },
              { label: "Account No.", value: form.bankAccount, icon: CreditCard },
              { label: "IFSC Code", value: form.ifsc, icon: Landmark },
              { label: "PAN Card", value: form.pan || "—", icon: CreditCard },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-4 p-5 bg-slate-50/50 rounded-2xl border border-slate-100/50 hover:bg-white hover:shadow-sm hover:border-slate-200 transition-all duration-300 group">
                <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm border border-slate-50 group-hover:text-emerald-600 transition-colors">
                  <item.icon size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider group-hover:text-emerald-400 transition-colors">{item.label}</p>
                  <p className="text-[15px] font-black text-slate-800">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-4 space-y-6">
        <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-amber-500 rounded-full" />
            <h5 className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-400">Verification Documents</h5>
        </div>
        <div className="flex flex-wrap gap-4">
          {[
            { id: "profilePhoto", label: "Photo" },
            { id: "aadhaarCard", label: "Aadhaar" },
            { id: "panCard", label: "PAN" },
            { id: "educationalCertificates", label: "Education" },
            { id: "passBook", label: "Passbook" },
          ].map((doc) => (
            <div key={doc.id} className="flex items-center gap-3.5 px-5 py-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 hover:bg-emerald-50 transition-colors duration-300 group">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-emerald-600 shadow-sm group-hover:scale-110 transition-transform">
                <FileText size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">{doc.label}</span>
                <span className="text-sm font-black text-emerald-700">Verified ✓</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div 
        className={`p-8 rounded-[32px] transition-all duration-500 cursor-pointer border-2 ${
            confirmChecked 
            ? "bg-indigo-50/50 border-indigo-200 shadow-xl shadow-indigo-900/5" 
            : "bg-slate-50/50 border-slate-100 hover:bg-slate-50 hover:border-slate-200"
        }`} 
        onClick={() => setConfirmChecked(!confirmChecked)}
      >
        <label className="flex items-start gap-5 cursor-pointer">
          <div className={`mt-1 w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all duration-300 shrink-0 ${
            confirmChecked ? "bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-200 scale-110" : "bg-white border-slate-300"
          }`}>
            {confirmChecked && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><X size={16} className="text-white rotate-45" /></motion.div>}
          </div>
          <span className={`text-[14px] leading-relaxed font-bold transition-colors duration-300 ${confirmChecked ? "text-indigo-900" : "text-slate-500"}`}>
            I confirm that all the information provided above is accurate and complete. I understand that any discrepancies may lead to the rejection of this registration.
          </span>
        </label>
      </div>

      <div className="flex items-center justify-end gap-5 pt-4">
        <button
          onClick={() => { setFormStep(1); setConfirmChecked(false); }}
          className="px-8 py-4 rounded-2xl border border-slate-200 text-[15px] font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-[0.98]"
        >
          ← Back to Edit
        </button>
        <button
          disabled={!confirmChecked || isSubmitting}
          onClick={handleSubmit}
          className={`px-10 py-4 rounded-2xl text-[15px] font-bold transition-all flex items-center gap-3 shadow-xl ${
            confirmChecked && !isSubmitting
              ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:shadow-emerald-900/20 hover:-translate-y-0.5 active:scale-[0.98]"
              : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
          }`}
        >
          {isSubmitting ? (
            <>
              <motion.div 
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.5, 1] 
                }} 
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              >
                <Upload size={18} />
              </motion.div> 
              <span>Registering...</span>
            </>
          ) : (
            <><UserPlus size={20} /> {isEditMode ? "Confirm & Update Profile" : "Confirm & Complete Registration"}</>
          )}

        </button>
      </div>
    </motion.div>
  );

  return (
    <FormModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-4xl">
      <FormHeader
        title={isEditMode ? "Edit CRP Profile" : "Register New CRP"}
        subtitle={isEditMode ? "Update Community Resource Person details" : "Onboard a new Community Resource Person"}
        icon={UserPlus}
        onClose={onClose}
      />
      
      <div 
        ref={scrollRef}
        className="max-h-[80vh] overflow-y-auto custom-scrollbar bg-white scroll-smooth"
      >
        <AnimatePresence mode="popLayout">
          {formStep === 1 ? renderStep1() : renderStep2()}
        </AnimatePresence>
      </div>
    </FormModal>
  );
}

