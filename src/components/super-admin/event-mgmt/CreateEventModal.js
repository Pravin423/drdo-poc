import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, X, ChevronDown, User, Users, MapPin, Globe, Link, Navigation, Search, Check, Plus, AlertCircle } from "lucide-react";

export default function CreateEventModal({ isOpen, onClose, onSave }) {
  const [options, setOptions] = useState({
    crps: [],
    shgs: [],
    coordinators: [],
    verticals: [],
    districts: [],
    talukas: [],
    villages: [],
    event_types: []
  });

  const [formData, setFormData] = useState({
    title: "",
    type: "meeting",
    vertical_id: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    location: "",
    latitude: "19.13582", // Default for demo
    longitude: "72.83120", // Default for demo
    district_id: "",
    taluka_id: "",
    village_id: "",
    crp_participants: [],
    shg_participants: [],
    primary_coordinator_id: "",
    secondary_coordinator_id: "",
    description: ""
  });

  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [searchTerms, setSearchTerms] = useState({ crp: "", shg: "" });

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const coordsStr = `Lat: ${latitude.toFixed(5)}, Lng: ${longitude.toFixed(5)}`;
        setFormData(prev => ({
          ...prev,
          latitude: latitude.toString(),
          longitude: longitude.toString(),
          location: prev.location || coordsStr // Only set string if empty
        }));
        setIsDetectingLocation(false);
      },
      (error) => {
        console.error("GPS Error:", error);
        alert("Unable to retrieve your location. Please check permissions.");
        setIsDetectingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Performance Optimization: Memoize filtered lists
  const filteredCrps = useMemo(() => {
    if (!options.crps) return [];
    const term = searchTerms.crp.toLowerCase();
    return options.crps.filter(c => c.fullname.toLowerCase().includes(term));
  }, [options.crps, searchTerms.crp]);

  const filteredShgs = useMemo(() => {
    if (!options.shgs) return [];
    const term = searchTerms.shg.toLowerCase();
    return options.shgs.filter(s => {
      const name = (s.name || s.fullname || s.shg_name || s.group_name || "").toLowerCase();
      return name.includes(term);
    });
  }, [options.shgs, searchTerms.shg]);

  useEffect(() => {
    if (isOpen) {
      fetchCreateOptions();
      loadDistricts();
    }
  }, [isOpen]);

  const loadDistricts = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch("/api/districts", { headers: { Authorization: `Bearer ${token}` } });
      const result = await res.json();
      const data = result.data || result || [];
      setOptions(prev => ({ ...prev, districts: Array.isArray(data) ? data : [] }));
    } catch (err) { console.error("Districts load error:", err); }
  };

  useEffect(() => {
    if (!formData.district_id) {
      setOptions(prev => ({ ...prev, talukas: [] }));
      return;
    }
    const loadTalukas = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch(`/api/talukas?district_id=${formData.district_id}`, { headers: { Authorization: `Bearer ${token}` } });
        const result = await res.json();
        const data = result.data || result || [];
        setOptions(prev => ({ ...prev, talukas: Array.isArray(data) ? data : [] }));
      } catch (err) { console.error("Talukas load error:", err); }
    };
    loadTalukas();
  }, [formData.district_id]);

  useEffect(() => {
    if (!formData.taluka_id) {
      setOptions(prev => ({ ...prev, villages: [] }));
      return;
    }
    const loadVillages = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch(`/api/villages?taluka_id=${formData.taluka_id}`, { headers: { Authorization: `Bearer ${token}` } });
        const result = await res.json();
        const data = result.data || result || [];
        setOptions(prev => ({ ...prev, villages: Array.isArray(data) ? data : [] }));
      } catch (err) { console.error("Villages load error:", err); }
    };
    loadVillages();
  }, [formData.taluka_id]);

  const fetchCreateOptions = async () => {
    try {
      setIsLoadingOptions(true);
      const res = await fetch("/api/events?action=create-options");
      const result = await res.json();
      if (result.status === 1 && result.data) {
        setOptions(prev => ({
          ...prev,
          crps: result.data.crps || [],
          shgs: result.data.shgs || [],
          coordinators: result.data.coordinators || [],
          verticals: result.data.verticals || result.data.vertical || [],
          event_types: result.data.types || result.data.event_types || []
        }));
      }
    } catch (err) {
      console.error("Failed to fetch event options:", err);
    } finally {
      setIsLoadingOptions(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      // Cascade resets
      if (field === "district_id") {
        updated.taluka_id = "";
        updated.village_id = "";
      } else if (field === "taluka_id") {
        updated.village_id = "";
      }
      return updated;
    });
  };

  const toggleParticipant = (type, id) => {
    const field = type === "crp" ? "crp_participants" : "shg_participants";
    setFormData(prev => {
      const current = prev[field];
      if (current.includes(id)) {
        return { ...prev, [field]: current.filter(item => item !== id) };
      } else {
        return { ...prev, [field]: [...current, id] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.startDate || !formData.startTime || !formData.vertical_id) {
      alert("Please fill in core details (Title, Vertical, Start Date, Time)");
      return;
    }

    if (formData.endDate && formData.endDate < formData.startDate) {
      alert("End Date cannot be before Start Date");
      return;
    }

    setIsSubmitting(true);
    try {
      const start_datetime = `${formData.startDate}T${formData.startTime}`;
      const end_datetime = `${formData.endDate || formData.startDate}T${formData.endTime || formData.startTime}`;

      const payload = {
        ...formData,
        start_datetime,
        end_datetime
      };

      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      if (result.status === 1) {
        onSave();
        onClose();
        setFormData({
          title: "", type: "meeting", vertical_id: "", startDate: "", endDate: "", startTime: "", endTime: "",
          location: "", latitude: "19.13582", longitude: "72.83120", district_id: "",
          taluka_id: "", village_id: "", crp_participants: [], shg_participants: [],
          primary_coordinator_id: "", secondary_coordinator_id: "", description: ""
        });
      } else {
        alert(result.message || "Failed to create event");
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("An error occurred while publishing the event.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-50 w-full max-w-5xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 my-auto transform-gpu"
      >
        {/* Header */}
        <div className="relative h-28 bg-gradient-to-br from-[#1a2e7a] to-[#3b52ab] px-10 flex items-center shrink-0">
          <div className="flex items-center gap-6">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xl border border-white/20 shadow-inner">
              <Calendar className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">Schedule New Event</h2>
              <p className="text-blue-100/60 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Portal Management System • Phase 4</p>
            </div>
          </div>
          <button onClick={onClose} className="absolute top-8 right-8 p-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all active:scale-95">
            <X size={18} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-10 space-y-8 max-h-[75vh] overflow-y-auto custom-scrollbar transform-gpu will-change-scroll translate-z-0"
        >

          {/* Section 1: Core Identity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-3 bg-tech-blue-500 rounded-full" /> Event Identity
              </h3>
              <p className="text-[11px] font-bold text-slate-400 mt-2 leading-relaxed">Basic purpose and vertical categorization.</p>
            </div>
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Financial Literacy Workshop"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  className="w-full px-5 py-3 rounded-2xl bg-white border border-slate-200 focus:border-tech-blue-500 transition-all outline-none text-sm font-bold text-slate-700 shadow-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Event Vertical *</label>
                <div className="relative">
                  <select
                    required
                    value={formData.vertical_id}
                    onChange={(e) => handleChange("vertical_id", e.target.value)}
                    className="w-full px-5 py-3 rounded-2xl bg-white border border-slate-200 text-sm font-bold text-slate-700 outline-none appearance-none focus:border-tech-blue-500 transition-all"
                  >
                    <option value="">Select Vertical</option>
                    {options.verticals.map(v => (
                      <option key={v.id} value={v.id}>
                        {v.name || v.vertical_name || v.title || `Vertical #${v.id}`}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Type *</label>
                <div className="relative">
                  <select
                    value={formData.type}
                    onChange={(e) => handleChange("type", e.target.value)}
                    className="w-full px-5 py-3 rounded-2xl bg-white border border-slate-200 text-sm font-bold text-slate-700 outline-none appearance-none focus:border-tech-blue-500 transition-all"
                  >
                    {options.event_types && options.event_types.length > 0 ? (
                      options.event_types.map(t => (
                        <option key={t.id || t.name} value={t.id || t.name}>
                          {t.name || t.type_name || t}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="meeting">Meeting</option>
                        <option value="training">Training</option>
                        <option value="workshop">Workshop</option>
                        <option value="other">Other</option>
                      </>
                    )}
                  </select>
                  <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-200/50" />

          {/* Section 2: Timeline & Location */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-3 bg-rose-500 rounded-full" /> Schedule & Venue
              </h3>
              <p className="text-[11px] font-bold text-slate-400 mt-2 leading-relaxed">Define when and where participants should arrive.</p>
            </div>
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => handleChange("startDate", e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-[13px] font-bold text-slate-700 outline-none focus:border-tech-blue-500 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">End Date</label>
                  <input
                    type="date"
                    min={formData.startDate}
                    value={formData.endDate}
                    onChange={(e) => handleChange("endDate", e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-[13px] font-bold text-slate-700 outline-none focus:border-tech-blue-500 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Starts *</label>
                  <input
                    type="time"
                    required
                    value={formData.startTime}
                    onChange={(e) => handleChange("startTime", e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-[13px] font-bold text-slate-700 outline-none focus:border-tech-blue-500 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Ends *</label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => handleChange("endTime", e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-[13px] font-bold text-slate-700 outline-none focus:border-tech-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">District *</label>
                  <div className="relative">
                    <select
                      value={formData.district_id}
                      onChange={(e) => handleChange("district_id", e.target.value)}
                      className="w-full px-5 py-3 rounded-2xl bg-white border border-slate-200 text-sm font-bold text-slate-700 outline-none appearance-none focus:border-tech-blue-500"
                    >
                      <option value="">Select District</option>
                      {options.districts.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Taluka/Block</label>
                  <div className="relative">
                    <select
                      disabled={!formData.district_id}
                      value={formData.taluka_id}
                      onChange={(e) => handleChange("taluka_id", e.target.value)}
                      className={`w-full px-5 py-3 rounded-2xl bg-white border border-slate-200 text-sm font-bold text-slate-700 outline-none appearance-none focus:border-tech-blue-500 ${!formData.district_id ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <option value="">{formData.district_id ? "Select Taluka" : "Select District First"}</option>
                      {options.talukas.map(t => (
                        <option key={t.id || t.taluka_id} value={t.id || t.taluka_id}>{t.name || t.taluka}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Village</label>
                  <div className="relative">
                    <select
                      disabled={!formData.taluka_id}
                      value={formData.village_id}
                      onChange={(e) => handleChange("village_id", e.target.value)}
                      className={`w-full px-5 py-3 rounded-2xl bg-white border border-slate-200 text-sm font-bold text-slate-700 outline-none appearance-none focus:border-tech-blue-500 ${!formData.taluka_id ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <option value="">{formData.taluka_id ? "Select Village" : "Select Taluka First"}</option>
                      {options.villages.map(v => (
                        <option key={v.id || v.village_id} value={v.id || v.village_id}>{v.name || v.fullname || v.village}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Exact Location / Venue Details *</label>
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={isDetectingLocation}
                    className="flex items-center gap-1.5 text-[9px] font-black text-tech-blue-600 uppercase tracking-widest hover:text-tech-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isDetectingLocation ? (
                      <div className="w-3 h-3 border-2 border-tech-blue-200 border-t-tech-blue-600 rounded-full animate-spin" />
                    ) : (
                      <Navigation size={10} className="rotate-45" />
                    )}
                    {isDetectingLocation ? "Detecting..." : "Get Current GPS"}
                  </button>
                </div>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Physical address or GPS point"
                    value={formData.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                    className="w-full pl-11 pr-5 py-3 rounded-2xl bg-white border border-slate-200 text-sm font-bold text-slate-700 outline-none focus:border-tech-blue-500 shadow-sm transition-all"
                  />
                </div>
                <div className="flex items-center gap-4 px-2 mt-2">
                  <div className="flex-1 space-y-1">
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Latitude</p>
                    <input
                      type="text"
                      readOnly
                      value={formData.latitude}
                      className="w-full bg-slate-100 border-none rounded-lg px-3 py-1.5 text-[10px] font-black text-slate-600 outline-none"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Longitude</p>
                    <input
                      type="text"
                      readOnly
                      value={formData.longitude}
                      className="w-full bg-slate-100 border-none rounded-lg px-3 py-1.5 text-[10px] font-black text-slate-600 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-200/50" />

          {/* Section 3: Personnel & Participants */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-3 bg-emerald-500 rounded-full" /> Human Resources
              </h3>
              <p className="text-[11px] font-bold text-slate-400 mt-2 leading-relaxed">Assign leads and select participants from the database.</p>
            </div>
            <div className="lg:col-span-2 space-y-8">
              {/* Coordinators Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Primary Lead *</label>
                  <div className="relative">
                    <select
                      value={formData.primary_coordinator_id}
                      onChange={(e) => handleChange("primary_coordinator_id", e.target.value)}
                      className="w-full px-5 py-3 rounded-2xl bg-white border border-slate-200 text-sm font-bold text-slate-700 outline-none appearance-none focus:border-tech-blue-500"
                    >
                      <option value="">Select Coordinator</option>
                      {options.coordinators.map(c => (
                        <option key={c.id} value={c.id}>{c.fullname}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Secondary Lead</label>
                  <div className="relative">
                    <select
                      value={formData.secondary_coordinator_id}
                      onChange={(e) => handleChange("secondary_coordinator_id", e.target.value)}
                      className="w-full px-5 py-3 rounded-2xl bg-white border border-slate-200 text-sm font-bold text-slate-700 outline-none appearance-none focus:border-tech-blue-500"
                    >
                      <option value="">Select Coordinator</option>
                      {options.coordinators.map(c => (
                        <option key={c.id} value={c.id}>{c.fullname}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* CRP Multi-select */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <User size={14} className="text-tech-blue-500" /> CRP Participants
                    <span className="bg-tech-blue-100 text-tech-blue-600 px-2 py-0.5 rounded-lg text-[9px]">{formData.crp_participants.length} Selected</span>
                  </label>
                  <div className="relative w-48">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search CRP..."
                      value={searchTerms.crp}
                      onChange={e => setSearchTerms(prev => ({ ...prev, crp: e.target.value }))}
                      className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold outline-none focus:border-tech-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-4 bg-white rounded-[2rem] border border-slate-200 custom-scrollbar shadow-inner">
                  {filteredCrps.map(crp => (
                    <button
                      key={crp.id}
                      type="button"
                      onClick={() => toggleParticipant("crp", crp.id)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border-2 transition-all text-left ${formData.crp_participants.includes(crp.id)
                          ? "bg-tech-blue-600 border-tech-blue-600 text-white shadow-lg shadow-tech-blue-500/20"
                          : "bg-white border-slate-50 text-slate-600 hover:border-slate-200"
                        }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${formData.crp_participants.includes(crp.id) ? "border-white bg-white/20" : "border-slate-200"
                        }`}>
                        {formData.crp_participants.includes(crp.id) && <Check size={10} />}
                      </div>
                      <span className="text-[11px] font-black truncate">{crp.fullname}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* SHG Multi-select */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <Users size={14} className="text-emerald-500" /> SHG Participants
                    <span className="bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-lg text-[9px]">{formData.shg_participants.length} Selected</span>
                  </label>
                  <div className="relative w-48">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search SHG..."
                      value={searchTerms.shg}
                      onChange={e => setSearchTerms(prev => ({ ...prev, shg: e.target.value }))}
                      className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold outline-none focus:border-tech-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-4 bg-white rounded-[2rem] border border-slate-200 custom-scrollbar shadow-inner">
                  {filteredShgs.map(shg => (
                    <button
                      key={shg.id}
                      type="button"
                      onClick={() => toggleParticipant("shg", shg.id)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border-2 transition-all text-left ${formData.shg_participants.includes(shg.id)
                          ? "bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                          : "bg-white border-slate-50 text-slate-600 hover:border-slate-200"
                        }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${formData.shg_participants.includes(shg.id) ? "border-white bg-white/20" : "border-slate-200"
                        }`}>
                        {formData.shg_participants.includes(shg.id) && <Check size={10} />}
                      </div>
                      <span className="text-[11px] font-black truncate">
                        {shg.name || shg.fullname || shg.shg_name || shg.group_name || `SHG #${shg.id}`}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

          <div className="h-px bg-slate-200/50" />

          {/* Description */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Event Description</label>
            <textarea
              rows={3}
              placeholder="Provide a detailed agenda or description of the event..."
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="w-full px-5 py-4 rounded-[2rem] bg-white border border-slate-200 focus:border-tech-blue-500 transition-all outline-none text-sm font-bold text-slate-700 shadow-sm resize-none"
            />
          </div>

          {/* Policy Check */}
          <div className="p-6 bg-slate-100/50 rounded-[2rem] border border-slate-200">
            <label className="flex items-center gap-4 cursor-pointer group">
              <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${confirmChecked ? 'bg-slate-900 border-slate-900' : 'bg-white border-slate-300 group-hover:border-slate-400'}`}>
                <input
                  type="checkbox"
                  checked={confirmChecked}
                  onChange={(e) => setConfirmChecked(e.target.checked)}
                  className="hidden"
                />
                {confirmChecked && <Check size={14} className="text-white" />}
              </div>
              <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest group-hover:text-slate-700 transition-colors">
                I verify that all logistics and participants are finalized.
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end items-center gap-6 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="text-[11px] font-black text-slate-400 hover:text-slate-600 uppercase tracking-[0.2em] transition-colors"
            >
              Discard
            </button>
            <button
              disabled={!confirmChecked || isSubmitting}
              type="submit"
              className={`px-14 py-4 rounded-2xl text-[11px] font-black transition-all shadow-xl uppercase tracking-[0.2em] flex items-center gap-3 ${confirmChecked && !isSubmitting
                ? "bg-tech-blue-600 text-white hover:bg-tech-blue-700 shadow-tech-blue-500/40 active:scale-95"
                : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Publishing...
                </>
              ) : "Publish Event"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
