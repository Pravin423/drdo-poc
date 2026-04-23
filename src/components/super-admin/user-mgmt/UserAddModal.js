import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, UserPlus, User, Mail, Phone, Lock, Eye, EyeOff,
  ImagePlus, Calendar, Users, Shield, Save, CheckCircle2,
  MapPin, Map, Check, ChevronDown
} from "lucide-react";



// Roles will be fetched from API
const GENDERS = ["Male", "Female", "Other"];

const EMPTY = {
  fullname: "",
  mobile: "",
  password: "",
  email: "",
  gender: "Male",
  role_id: "",
  date_of_birth: "",
  profile: null,
  district_id: "",
  taluka_ids: [],
};

export default function UserAddModal({ isOpen, onClose, onUserAdded }) {
  const fileRef = useRef(null);
  const [form, setForm] = useState(EMPTY);
  const [profilePreview, setProfilePreview] = useState(null);
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [apiError, setApiError] = useState("");
  const [roles, setRoles] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [talukas, setTalukas] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [districtsLoading, setDistrictsLoading] = useState(false);
  const [talukasLoading, setTalukasLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchInitialData = async () => {
        setRolesLoading(true);
        setDistrictsLoading(true);
        try {
          // Fetch Roles
          const rolesRes = await fetch("/api/roles");
          const rolesJson = await rolesRes.json();
          if (rolesJson.status === 1 && rolesJson.data) {
            setRoles(rolesJson.data.map(r => ({ value: String(r.id), label: r.name })));
          }

          // Fetch Districts
          const distRes = await fetch("/api/districts");
          const distJson = await distRes.json();
          if (distJson.status && distJson.data) {
            setDistricts(distJson.data);
          }
        } catch (err) {
          console.error("Failed to fetch initial data:", err);
        } finally {
          setRolesLoading(false);
          setDistrictsLoading(false);
        }
      };
      fetchInitialData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (form.district_id) {
      const fetchTalukas = async () => {
        setTalukasLoading(true);
        try {
          const res = await fetch(`/api/talukas?district_id=${form.district_id}`);
          const json = await res.json();
          if (json.status && json.data) {
            setTalukas(json.data);
          }
        } catch (err) {
          console.error("Failed to fetch talukas:", err);
        } finally {
          setTalukasLoading(false);
        }
      };
      fetchTalukas();
    } else {
      setTalukas([]);
    }
  }, [form.district_id]);

  const handleTalukaToggle = (id) => {
    const current = form.taluka_ids || [];
    const updated = current.includes(id)
      ? current.filter(i => i !== id)
      : [...current, id];
    setForm(f => ({ ...f, taluka_ids: updated }));
  };

  const handleSelectAllTalukas = () => {
    if (form.taluka_ids.length === talukas.length && talukas.length > 0) {
      setForm(f => ({ ...f, taluka_ids: [] }));
    } else {
      setForm(f => ({ ...f, taluka_ids: talukas.map(t => t.id) }));
    }
  };

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((err) => ({ ...err, [key]: "" }));
    setApiError("");
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // Reject files larger than 2MB — external API rejects oversized profile images
    if (file.size > 2 * 1024 * 1024) {
      setErrors((err) => ({ ...err, profile: "Profile photo must be under 2MB. Please compress or resize the image." }));
      e.target.value = "";
      return;
    }
    setForm((f) => ({ ...f, profile: file }));
    setErrors((err) => ({ ...err, profile: "" }));
    setProfilePreview(URL.createObjectURL(file));
  };

  const validate = () => {
    const e = {};
    const nameRegex = /^[a-zA-Z\s\-]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^\d{10}$/;

    if (!form.fullname.trim()) {
      e.fullname = "Full name is required.";
    } else if (!nameRegex.test(form.fullname.trim())) {
      e.fullname = "Full name can only contain letters, spaces, and hyphens.";
    }

    if (!form.mobile) {
      e.mobile = "Mobile number is required.";
    } else if (!mobileRegex.test(form.mobile)) {
      e.mobile = "Mobile number must be exactly 10 digits.";
    }

    if (!form.password) {
      e.password = "Password is required.";
    } else if (form.password.length < 8) {
      e.password = "Password must be at least 8 characters.";
    }

    if (!form.email.trim()) {
      e.email = "Email is required.";
    } else if (!emailRegex.test(form.email)) {
      e.email = "Please enter a valid email address.";
    }

    if (!form.profile) e.profile = "Profile photo is required.";
    if (!form.gender) e.gender = "Please select a gender.";
    if (!form.role_id) e.role_id = "Please select a role.";
    if (!form.date_of_birth) e.date_of_birth = "Date of birth is required.";
    
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setIsLoading(true);

    try {
      // Build FormData for multipart upload
      const payload = new FormData();
      payload.append("fullname", form.fullname);
      payload.append("mobile", form.mobile);
      payload.append("password", form.password);
      payload.append("email", form.email);
      payload.append("gender", form.gender);
      payload.append("role_id", form.role_id);

      if (form.date_of_birth) payload.append("dob", form.date_of_birth);
      if (form.district_id)   payload.append("district_id", form.district_id);

      // Append taluka_ids as indexed array fields
      if (form.taluka_ids.length > 0) {
        form.taluka_ids.forEach((tid, idx) => {
          payload.append(`taluka_id[${idx}]`, tid);
        });
      }

      // Attach profile image file directly (not base64)
      if (form.profile) {
        payload.append("profile", form.profile);
      }

      // POST to the server-side proxy
      const res = await fetch("/api/user?action=add-user", {
        method: "POST",
        body: payload,
      });

      const rawText = await res.text();
      let data;
      try { data = JSON.parse(rawText); } catch { data = { message: rawText }; }

      if (!res.ok || data.status === false || data.status === 0) {
        // API may return validation errors as an object — safely stringify
        const msg = data.message
          ? (typeof data.message === "object"
              ? Object.entries(data.message)
                  .map(([field, errs]) => `${field}: ${Array.isArray(errs) ? errs[0] : errs}`)
                  .join(" | ")
              : String(data.message))
          : "Failed to register user. Please try again.";
        setApiError(msg);
        return;
      }

      // Signal parent to refresh — don't pass raw API object (causes React render error)
      onUserAdded();
      setSuccessOpen(true);
      setForm(EMPTY);
      setProfilePreview(null);
    } catch (err) {
      setApiError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = (key) =>
    `w-full pl-11 pr-4 py-3 rounded-xl border-2 text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-200 ${errors[key]
      ? "border-rose-400 bg-rose-50 focus:ring-2 focus:ring-rose-400/20"
      : "border-slate-200 bg-white focus:border-tech-blue-500 focus:ring-4 focus:ring-tech-blue-500/10"
    }`;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", duration: 0.4, bounce: 0.3 }}
        className="bg-white rounded-3xl shadow-xl w-full max-w-2xl overflow-hidden relative z-10 my-auto flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-tech-blue-600 flex items-center justify-center shadow-md shadow-tech-blue-500/30">
              <UserPlus size={20} className="text-white" />
            </div>
            <div>
              <p className="text-base font-bold text-slate-800">New User Registration</p>
              <p className="text-xs text-slate-500">Fill in all required fields to create an account.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto custom-scrollbar">
          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700">Full Name <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={form.fullname}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "" || /^[a-zA-Z\s\-]+$/.test(val)) {
                        setForm(f => ({ ...f, fullname: val }));
                        setErrors(err => ({ ...err, fullname: "" }));
                      }
                    }}
                    placeholder="Full Name"
                    className={inputClass("fullname")}
                  />
                </div>
                {errors.fullname && <p className="text-xs text-rose-600 font-medium">{errors.fullname}</p>}
              </div>

              {/* Mobile */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700">Mobile <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="tel"
                    value={form.mobile}
                    maxLength={10}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, "").slice(0, 10);
                      setForm(f => ({ ...f, mobile: v }));
                      setErrors(err => ({ ...err, mobile: "" }));
                    }}
                    placeholder="Mobile"
                    className={inputClass("mobile")}
                  />
                </div>
                {errors.mobile && <p className="text-xs text-rose-600 font-medium">{errors.mobile}</p>}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700">Password <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input type={showPass ? "text" : "password"} value={form.password} onChange={set("password")} placeholder="Password" className={`${inputClass("password")} pr-11`} />
                  <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-rose-600 font-medium">{errors.password}</p>}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700">Email <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input type="email" value={form.email} onChange={set("email")} placeholder="Email ID" className={inputClass("email")} />
                </div>
                {errors.email && <p className="text-xs text-rose-600 font-medium">{errors.email}</p>}
              </div>

              {/* Profile Photo */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700">Profile <span className="text-rose-500">*</span></label>
                <div
                  onClick={() => fileRef.current?.click()}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${errors.profile ? "border-rose-400 bg-rose-50" : "border-slate-200 bg-white hover:border-tech-blue-400 hover:bg-tech-blue-50/30"
                    }`}
                >
                  {profilePreview ? (
                    <img src={profilePreview} alt="preview" className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0" />
                  ) : (
                    <ImagePlus size={18} className="text-slate-400 shrink-0" />
                  )}
                  <span className="text-sm text-slate-500 truncate">
                    {form.profile ? form.profile.name : "Choose File"}
                  </span>
                </div>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
                {errors.profile && <p className="text-xs text-rose-600 font-medium">{errors.profile}</p>}
              </div>

              {/* Date of Birth */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700">Date Of Birth <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <Calendar size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input type="date" value={form.date_of_birth} onChange={set("date_of_birth")}
                    className={inputClass("date_of_birth")} />
                </div>
                {errors.date_of_birth && <p className="text-xs text-rose-600 font-medium">{errors.date_of_birth}</p>}
              </div>

              {/* Gender */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700">Gender <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <Users size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <select value={form.gender} onChange={set("gender")} className={`${inputClass("gender")} appearance-none bg-white`}>
                    {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                {errors.gender && <p className="text-xs text-rose-600 font-medium">{errors.gender}</p>}
              </div>

              {/* Role */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700">Role <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <Shield size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <select value={form.role_id} onChange={set("role_id")} className={`${inputClass("role_id")} appearance-none bg-white`} disabled={rolesLoading}>
                    <option value="">{rolesLoading ? "Loading..." : "Choose..."}</option>
                    {roles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                </div>
                {errors.role_id && <p className="text-xs text-rose-600 font-medium">{errors.role_id}</p>}
              </div>

              {/* District (Optional) */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700">District (Optional)</label>
                <div className="relative group">
                  <MapPin size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-tech-blue-500 transition-colors pointer-events-none" />
                  <select value={form.district_id} onChange={set("district_id")} className={`${inputClass("district_id")} appearance-none bg-white pr-10`} disabled={districtsLoading}>
                    <option value="">{districtsLoading ? "Loading..." : "Choose District..."}</option>
                    {districts.map(d => <option key={d.id} value={d.id}>{d.distName || d.name}</option>)}
                  </select>
                  <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Taluka (Optional - Multi Select) */}
              <div className="space-y-3 md:col-span-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold text-slate-700">Taluka (Optional)</label>
                  {talukas.length > 0 && (
                    <button
                      type="button"
                      onClick={handleSelectAllTalukas}
                      className="text-xs font-bold text-tech-blue-600 hover:text-tech-blue-700 px-2 py-1 rounded-lg hover:bg-tech-blue-50 transition-colors"
                    >
                      {form.taluka_ids.length === talukas.length ? "Deselect All" : "Select All"}
                    </button>
                  )}
                </div>

                {/* Selected Pills */}
                <AnimatePresence mode="popLayout">
                  {form.taluka_ids.length > 0 && (
                    <div className="flex flex-wrap gap-2 min-h-[32px]">
                      {form.taluka_ids.map(id => {
                        const t = talukas.find(tal => tal.id === id);
                        if (!t) return null;
                        return (
                          <motion.span
                            layout
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            key={id}
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-tech-blue-600 text-white text-[10px] font-black uppercase tracking-wider rounded-lg shadow-sm"
                          >
                            {t.name}
                            <button type="button" onClick={() => handleTalukaToggle(id)} className="hover:text-white/80 transition-colors">
                              <X size={12} strokeWidth={3} />
                            </button>
                          </motion.span>
                        );
                      })}
                    </div>
                  )}
                </AnimatePresence>

                <div className="p-1 border-2 border-slate-100 rounded-2xl bg-slate-50/30">
                  <div className="bg-white rounded-xl p-4 min-h-[140px] max-h-[240px] overflow-y-auto custom-scrollbar shadow-inner border border-slate-100">
                    {talukasLoading ? (
                      <div className="flex flex-col items-center justify-center h-full gap-3 py-8">
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-6 h-6 border-2 border-tech-blue-200 border-t-tech-blue-600 rounded-full" />
                        <p className="text-xs font-bold text-slate-400">Loading talukas...</p>
                      </div>
                    ) : talukas.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {talukas.map(t => {
                          const isSelected = form.taluka_ids.includes(t.id);
                          return (
                            <motion.div
                              whileHover={{ y: -1 }}
                              whileTap={{ scale: 0.98 }}
                              key={t.id}
                              onClick={() => handleTalukaToggle(t.id)}
                              className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${isSelected
                                  ? "border-tech-blue-500 bg-tech-blue-50/50 shadow-sm"
                                  : "border-transparent bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200"
                                }`}
                            >
                              <span className={`text-xs font-bold transition-colors ${isSelected ? "text-tech-blue-700" : "text-slate-500"}`}>
                                {t.name}
                              </span>
                              <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${isSelected ? "bg-tech-blue-600 border-tech-blue-600" : "border-slate-200 bg-white"
                                }`}>
                                {isSelected && <Check size={12} strokeWidth={4} className="text-white" />}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full gap-2 py-8 text-center px-4">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300">
                          <Map size={24} />
                        </div>
                        <p className="text-xs font-bold text-slate-400">
                          {form.district_id ? "No talukas found for this district." : "Please select a district to view available talukas."}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* API Error Banner */}
            {apiError && (
              <div className="mx-8 mt-6 p-4 bg-rose-50 border-2 border-rose-200 rounded-xl flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">!</div>
                <p className="text-sm font-semibold text-rose-700">{String(apiError)}</p>
              </div>
            )}

            <div className="mt-8 p-8 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
              >
                Cancel
              </button>
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 px-10 py-2.5 bg-tech-blue-600 text-white text-sm font-black uppercase tracking-wider rounded-xl shadow-lg shadow-tech-blue-500/30 hover:shadow-xl hover:bg-tech-blue-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full" />
                ) : (
                  <Save size={16} strokeWidth={3} />
                )}
                {isLoading ? "Processing..." : "Register User"}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>

      {/* Success Modal Overlay */}
        <AnimatePresence>
          {successOpen && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }} transition={{ type: "spring", duration: 0.4, bounce: 0.4 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-sm z-[120]"
              >
                <div className="p-8 text-center flex flex-col items-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.1, bounce: 0.5 }}
                    className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-5">
                    <CheckCircle2 size={36} />
                  </motion.div>
                  <h3 className="text-xl font-extrabold text-slate-800 mb-2">User Created!</h3>
                  <p className="text-sm text-slate-500 mb-8">The new user account has been successfully registered.</p>
                  <button onClick={() => { setSuccessOpen(false); onClose(); }}
                    className="w-full px-4 py-3 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors active:scale-95 shadow-md shadow-emerald-500/20">
                    Continue
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
    </div>
  );
}
