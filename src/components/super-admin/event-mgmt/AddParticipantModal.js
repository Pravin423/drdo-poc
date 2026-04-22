import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, X, ChevronDown } from "lucide-react";

export default function AddParticipantModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    type: "",
    district: "",
    organization: "",
  });
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.type || !formData.district) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      onSave(formData);
      setFormData({ name: "", email: "", phone: "", type: "", district: "", organization: "" });
      setConfirmChecked(false);
      setIsSubmitting(false);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200"
      >
        <div className="relative h-28 bg-gradient-to-br from-[#1a2e7a] to-[#3b52ab] px-8 flex items-center">
          <div className="flex items-center gap-5">
            <div className="p-3.5 bg-white/10 rounded-2xl backdrop-blur-xl border border-white/20 shadow-inner">
              <User className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">Add Participant</h2>
              <p className="text-blue-100/70 text-xs font-bold uppercase tracking-widest mt-0.5">Registration Gateway</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all active:scale-95"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name *</label>
              <input
                type="text"
                placeholder="Participant's full name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-tech-blue-500 transition-all outline-none text-sm font-bold text-slate-800 shadow-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email *</label>
              <input
                type="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-tech-blue-500 transition-all outline-none text-sm font-bold text-slate-800 shadow-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone *</label>
              <input
                type="tel"
                placeholder="+91 00000 00000"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-tech-blue-500 transition-all outline-none text-sm font-bold text-slate-800 shadow-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Participant Type *</label>
              <div className="relative">
                <select
                  value={formData.type}
                  onChange={(e) => handleChange("type", e.target.value)}
                  className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border-2 border-transparent text-sm font-bold text-slate-800 outline-none appearance-none focus:bg-white focus:border-tech-blue-500 transition-all shadow-sm"
                >
                  <option value="">Select type</option>
                  <option value="CRP">CRP Member</option>
                  <option value="External">External Participant</option>
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">District *</label>
              <div className="relative">
                <select
                  value={formData.district}
                  onChange={(e) => handleChange("district", e.target.value)}
                  className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border-2 border-transparent text-sm font-bold text-slate-800 outline-none appearance-none focus:bg-white focus:border-tech-blue-500 transition-all shadow-sm"
                >
                  <option value="">Select district</option>
                  <option value="North Goa">North Goa</option>
                  <option value="South Goa">South Goa</option>
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="flex justify-end items-center gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3.5 rounded-2xl text-sm font-black text-slate-500 hover:bg-slate-50 transition-all uppercase tracking-widest"
            >
              Cancel
            </button>
            <button
              disabled={isSubmitting}
              type="submit"
              className={`px-12 py-3.5 rounded-2xl text-sm font-black transition-all shadow-xl uppercase tracking-widest flex items-center gap-3 ${!isSubmitting
                ? "bg-tech-blue-600 text-white hover:bg-tech-blue-700 shadow-tech-blue-500/30 active:scale-95"
                : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                }`}
            >
              {isSubmitting ? "Registering..." : "Add to List"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
