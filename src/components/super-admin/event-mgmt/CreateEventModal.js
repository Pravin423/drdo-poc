import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, X, ChevronDown } from "lucide-react";

export default function CreateEventModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    date: "",
    startTime: "",
    endTime: "",
    venue: "",
    district: "",
    block: "",
    facilitator: "",
    capacity: "",
    description: "",
    materials: "",
    allowExternal: false,
  });
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.type || !formData.date || !formData.startTime ||
      !formData.endTime || !formData.venue || !formData.district || !formData.facilitator ||
      !formData.capacity) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      onSave(formData);
      setFormData({
        title: "", type: "", date: "", startTime: "", endTime: "", venue: "",
        district: "", block: "", facilitator: "", capacity: "",
        description: "", materials: "", allowExternal: false,
      });
      setConfirmChecked(false);
      setIsSubmitting(false);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 my-auto"
      >
        {/* Modern Header */}
        <div className="relative h-32 bg-gradient-to-br from-[#1a2e7a] to-[#3b52ab] px-10 flex items-center">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-white/10 rounded-3xl backdrop-blur-xl border border-white/20 shadow-inner">
              <Calendar className="text-white" size={28} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white tracking-tight">Create New Event</h2>
              <p className="text-blue-100/80 text-sm font-semibold mt-1 uppercase tracking-widest">Training & Workshop Scheduler</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="absolute top-8 right-8 p-3 bg-white/10 hover:bg-white/20 rounded-2xl text-white transition-all active:scale-95"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmit} className="p-10 space-y-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
          
          {/* Section: Core Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">Event Identity</h3>
              <p className="text-xs font-bold text-slate-400 mt-2 leading-relaxed">Define the purpose and type of your event session.</p>
            </div>
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Event Title *</label>
                <input
                  type="text"
                  placeholder="e.g., Financial Literacy Training Phase 1"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-tech-blue-500 transition-all outline-none text-sm font-bold text-slate-800 shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Category *</label>
                <div className="relative">
                  <select
                    value={formData.type}
                    onChange={(e) => handleChange("type", e.target.value)}
                    className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border-2 border-transparent text-sm font-bold text-slate-800 outline-none appearance-none focus:bg-white focus:border-tech-blue-500 transition-all shadow-sm"
                  >
                    <option value="">Select type</option>
                    <option value="training">Training Session</option>
                    <option value="workshop">Interactive Workshop</option>
                    <option value="seminar">Educational Seminar</option>
                    <option value="meeting">Strategic Meeting</option>
                  </select>
                  <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Session Date *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange("date", e.target.value)}
                  className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-tech-blue-500 transition-all outline-none text-sm font-bold text-slate-800 shadow-sm"
                />
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100" />

          {/* Section: Logistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">Logistics & Venue</h3>
              <p className="text-xs font-bold text-slate-400 mt-2 leading-relaxed">Specify when and where the event will take place.</p>
            </div>
            <div className="md:col-span-2 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Start Time *</label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => handleChange("startTime", e.target.value)}
                    className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-tech-blue-500 transition-all outline-none text-sm font-bold text-slate-800 shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">End Time *</label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => handleChange("endTime", e.target.value)}
                    className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-tech-blue-500 transition-all outline-none text-sm font-bold text-slate-800 shadow-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Venue Details *</label>
                <input
                  type="text"
                  placeholder="Full address or meeting link"
                  value={formData.venue}
                  onChange={(e) => handleChange("venue", e.target.value)}
                  className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-tech-blue-500 transition-all outline-none text-sm font-bold text-slate-800 shadow-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">District *</label>
                  <div className="relative">
                    <select
                      value={formData.district}
                      onChange={(e) => handleChange("district", e.target.value)}
                      className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border-2 border-transparent text-sm font-bold text-slate-800 outline-none appearance-none focus:bg-white focus:border-tech-blue-500 transition-all shadow-sm"
                    >
                      <option value="">District</option>
                      <option value="North Goa">North Goa</option>
                      <option value="South Goa">South Goa</option>
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Block</label>
                  <div className="relative">
                    <select
                      value={formData.block}
                      onChange={(e) => handleChange("block", e.target.value)}
                      className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border-2 border-transparent text-sm font-bold text-slate-800 outline-none appearance-none focus:bg-white focus:border-tech-blue-500 transition-all shadow-sm"
                    >
                      <option value="">Block (Optional)</option>
                      <option value="Pernem">Pernem</option>
                      <option value="Margao">Margao</option>
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100" />

          {/* Section: Capacity & Facilitation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">Personnel & Size</h3>
              <p className="text-xs font-bold text-slate-400 mt-2 leading-relaxed">Who is leading and how many can attend.</p>
            </div>
            <div className="md:col-span-2 grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Facilitator *</label>
                <div className="relative">
                  <select
                    value={formData.facilitator}
                    onChange={(e) => handleChange("facilitator", e.target.value)}
                    className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border-2 border-transparent text-sm font-bold text-slate-800 outline-none appearance-none focus:bg-white focus:border-tech-blue-500 transition-all shadow-sm"
                  >
                    <option value="">Select person</option>
                    <option value="Dr. Maria Fernandes">Dr. Maria Fernandes</option>
                    <option value="Ms. Priya Desai">Ms. Priya Desai</option>
                  </select>
                  <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Max Capacity *</label>
                <input
                  type="number"
                  placeholder="Seat count"
                  value={formData.capacity}
                  onChange={(e) => handleChange("capacity", e.target.value)}
                  className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-tech-blue-500 transition-all outline-none text-sm font-bold text-slate-800 shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Policy Check */}
          <div className="p-6 bg-slate-50 rounded-[2rem] border-2 border-slate-100 shadow-inner">
            <label className="flex items-center gap-4 cursor-pointer group">
              <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${confirmChecked ? 'bg-slate-900 border-slate-900' : 'bg-white border-slate-200 group-hover:border-slate-300'}`}>
                <input
                  type="checkbox"
                  checked={confirmChecked}
                  onChange={(e) => setConfirmChecked(e.target.checked)}
                  className="hidden"
                />
                {confirmChecked && <div className="w-3 h-3 bg-white rounded-sm" />}
              </div>
              <span className="text-xs font-bold text-slate-500 leading-relaxed uppercase tracking-wider">
                I verify that all details are accurate and logistics are finalized.
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end items-center gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3.5 rounded-2xl text-sm font-black text-slate-500 hover:bg-slate-50 transition-all uppercase tracking-widest"
            >
              Cancel
            </button>
            <button
              disabled={!confirmChecked || isSubmitting}
              type="submit"
              className={`px-12 py-3.5 rounded-2xl text-sm font-black transition-all shadow-xl uppercase tracking-widest flex items-center gap-3 ${confirmChecked && !isSubmitting
                ? "bg-tech-blue-600 text-white hover:bg-tech-blue-700 shadow-tech-blue-500/30 active:scale-95"
                : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                }`}
            >
              {isSubmitting ? "Processing..." : "Publish Event"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
