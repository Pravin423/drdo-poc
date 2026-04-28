import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, User, Mail, Phone, Lock, Eye, EyeOff, 
  ImagePlus, Calendar, Users, Shield, Save, CheckCircle2,
  MapPin, Map, Check, ChevronDown, UserCircle
} from "lucide-react";

// Helper: read a File as base64 data URL
const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const GENDERS = ["Male", "Female", "Other"];

export default function UserEditModal({ isOpen, user, onClose, onSave }) {
  const fileRef = useRef(null);
  const [form, setForm] = useState(null);
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

  // Initialize form with user data
  useEffect(() => {
    if (user && isOpen) {
      setForm({
        ...user,
        role_id: String(user.role_id || ""),
        district_id: String(user.district_id || ""),
        taluka_ids: Array.isArray(user.taluka_id) ? user.taluka_id : [],
        password: "", // Keep password empty unless changing
      });
      setProfilePreview(user.profile);
      setErrors({});
      setApiError("");
    }
  }, [user, isOpen]);

  // Fetch initial data
  useEffect(() => {
    if (isOpen) {
      const fetchInitialData = async () => {
        setRolesLoading(true);
        setDistrictsLoading(true);
        try {
          const [rolesRes, distRes] = await Promise.all([
            fetch("/api/roles"),
            fetch("/api/districts")
          ]);
          
          const rolesJson = await rolesRes.json();
          if (rolesJson.status === 1 && rolesJson.data) {
            setRoles(rolesJson.data.map(r => ({ value: String(r.id), label: r.name })));
          }

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

  // Fetch Talukas when district changes
  useEffect(() => {
    if (form?.district_id) {
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
  }, [form?.district_id]);

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
    setForm((f) => ({ ...f, profile: file }));
    setProfilePreview(URL.createObjectURL(file));
  };

  const validate = () => {
    const e = {};
    if (!form.fullname?.trim()) e.fullname = "Full name is required.";
    if (!/^\d{10}$/.test(form.mobile)) e.mobile = "Enter a valid 10-digit mobile number.";
    if (!form.email?.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email is required.";
    if (!form.role_id) e.role_id = "Please select a role.";

    // Role-based mandatory fields: District and Taluka for Block Managers
    const selectedRole = roles.find(r => r.value === form.role_id)?.label;
    const isBlockRole = selectedRole === "Block Manager" || selectedRole === "Block Program Manager";

    if (isBlockRole) {
      if (!form.district_id) {
        e.district_id = "District is mandatory for Block roles.";
      }
      if (!form.taluka_ids || form.taluka_ids.length === 0) {
        e.taluka_ids = "At least one taluka is mandatory for Block roles.";
      }
    }

    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("fullname", form.fullname);
      formData.append("mobile", form.mobile);
      formData.append("email", form.email);
      formData.append("gender", form.gender);
      formData.append("role_id", form.role_id);
      if (form.district_id) formData.append("district_id", form.district_id);
      
      // Multi-taluka
      form.taluka_ids.forEach(tid => {
        formData.append("taluka_ids", tid);
      });

      // Profile photo (only if changed)
      if (form.profile instanceof File) {
        formData.append("profile", form.profile);
      }

      const res = await fetch(`/api/user?action=update-user&id=${user.id}`, {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (json.status === 1) {
        setSuccessOpen(true);
        onSave(); // Trigger list refresh
      } else {
        setApiError(json.message || "Failed to update profile.");
      }
    } catch (err) {
      setApiError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = (key) =>
    `w-full pl-11 pr-4 py-3 rounded-xl border-2 text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-200 ${
      errors[key]
        ? "border-rose-400 bg-rose-50 focus:ring-2 focus:ring-rose-400/20"
        : "border-slate-200 bg-white focus:border-tech-blue-500 focus:ring-4 focus:ring-tech-blue-500/10"
    }`;

  if (!isOpen || !form) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }} transition={{ type: "spring", duration: 0.4, bounce: 0.3 }}
        className="bg-white rounded-3xl shadow-xl w-full max-w-2xl overflow-hidden relative z-10 my-auto flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-tech-blue-600 flex items-center justify-center shadow-md shadow-tech-blue-500/30">
              <UserCircle size={20} className="text-white" />
            </div>
            <div>
              <p className="text-base font-bold text-slate-800">Edit Profile</p>
              <p className="text-xs text-slate-500">Update employee details and permissions.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
            {apiError && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 text-sm font-bold rounded-2xl flex items-center gap-2">
                <X size={16} className="bg-rose-100 rounded-full p-0.5 shrink-0" /> 
                <span>
                  {typeof apiError === "string" 
                    ? apiError 
                    : Object.values(apiError).flat().join(", ")}
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700">Full Name</label>
                <div className="relative">
                  <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input type="text" value={form.fullname} onChange={set("fullname")} placeholder="Full Name" className={inputClass("fullname")} />
                </div>
                {errors.fullname && <p className="text-xs text-rose-600 font-medium">{errors.fullname}</p>}
              </div>

              {/* Mobile */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700">Mobile</label>
                <div className="relative">
                  <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input type="tel" value={form.mobile}
                    onChange={(e) => { const v = e.target.value.replace(/\D/g, "").slice(0, 10); setForm(f => ({ ...f, mobile: v })); }}
                    placeholder="Mobile" className={inputClass("mobile")} />
                </div>
                {errors.mobile && <p className="text-xs text-rose-600 font-medium">{errors.mobile}</p>}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700">Email</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input type="email" value={form.email} onChange={set("email")} placeholder="Email ID" className={inputClass("email")} />
                </div>
                {errors.email && <p className="text-xs text-rose-600 font-medium">{errors.email}</p>}
              </div>

              {/* Gender */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700">Gender</label>
                <div className="relative">
                  <Users size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <select value={form.gender} onChange={set("gender")} className={`${inputClass("gender")} appearance-none bg-white`}>
                    {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              </div>

              {/* Role */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700">Role</label>
                <div className="relative">
                  <Shield size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <select value={form.role_id} onChange={set("role_id")} className={`${inputClass("role_id")} appearance-none bg-white`} disabled={rolesLoading}>
                    <option value="">{rolesLoading ? "Loading..." : "Choose..."}</option>
                    {roles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                </div>
              </div>

              {/* District */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700">
                  District {["Block Manager", "Block Program Manager"].includes(roles.find(r => r.value === form.role_id)?.label) && <span className="text-rose-500">*</span>}
                </label>
                <div className="relative group">
                  <MapPin size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-tech-blue-500 transition-colors pointer-events-none" />
                  <select value={form.district_id} onChange={set("district_id")} className={`${inputClass("district_id")} appearance-none bg-white pr-10`} disabled={districtsLoading}>
                    <option value="">{districtsLoading ? "Loading..." : "Choose District..."}</option>
                    {districts.map(d => <option key={d.id} value={d.id}>{d.distName || d.name}</option>)}
                  </select>
                  <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
                {errors.district_id && <p className="text-xs text-rose-600 font-medium">{errors.district_id}</p>}
              </div>

              {/* Profile Photo */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700">Profile Photo</label>
                <div className="flex items-center gap-4">
                  {profilePreview ? (
                    <div className="relative group">
                      <img src={profilePreview} alt="preview" className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100 shadow-sm" />
                      <button type="button" onClick={() => fileRef.current?.click()} className="absolute inset-0 bg-slate-900/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <ImagePlus size={20} className="text-white" />
                      </button>
                    </div>
                  ) : (
                    <div onClick={() => fileRef.current?.click()} className="w-16 h-16 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center cursor-pointer hover:border-tech-blue-400 hover:bg-tech-blue-50 transition-all">
                      <ImagePlus size={20} className="text-slate-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <button type="button" onClick={() => fileRef.current?.click()} className="text-xs font-bold text-tech-blue-600 hover:text-tech-blue-700 px-3 py-1.5 rounded-lg bg-tech-blue-50 transition-colors">
                      Change Photo
                    </button>
                    <p className="text-[10px] text-slate-400 mt-1">PNG, JPG up to 5MB</p>
                  </div>
                </div>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
              </div>

              {/* Taluka Selection */}
              <div className="space-y-3 md:col-span-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold text-slate-700">
                    Assigned Talukas {["Block Manager", "Block Program Manager"].includes(roles.find(r => r.value === form.role_id)?.label) && <span className="text-rose-500">*</span>}
                  </label>
                  {talukas.length > 0 && (
                    <button type="button" onClick={handleSelectAllTalukas} className="text-xs font-bold text-tech-blue-600 hover:text-tech-blue-700">
                      {form.taluka_ids.length === talukas.length ? "Deselect All" : "Select All"}
                    </button>
                  )}
                </div>

                {/* Selected Pills */}
                {form.taluka_ids.length > 0 && (
                  <div className="flex flex-wrap gap-2 min-h-[32px]">
                    {form.taluka_ids.map(id => {
                      const t = talukas.find(tal => tal.id === id);
                      if (!t) return null;
                      return (
                        <motion.span layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} key={id} 
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-tech-blue-600 text-white text-[10px] font-black uppercase tracking-wider rounded-lg shadow-sm"
                        >
                          {t.name}
                          <button type="button" onClick={() => handleTalukaToggle(id)} className="hover:text-white/80 transition-colors"><X size={12} strokeWidth={3} /></button>
                        </motion.span>
                      );
                    })}
                  </div>
                )}

                <div className="p-1 border-2 border-slate-100 rounded-2xl bg-slate-50/30">
                  <div className="bg-white rounded-xl p-4 min-h-[140px] max-h-[200px] overflow-y-auto custom-scrollbar shadow-inner border border-slate-100">
                    {talukasLoading ? (
                      <div className="flex flex-col items-center justify-center h-full gap-3 py-8">
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-6 h-6 border-2 border-tech-blue-200 border-t-tech-blue-600 rounded-full" />
                      </div>
                    ) : talukas.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {talukas.map(t => {
                          const isSelected = form.taluka_ids.includes(t.id);
                          return (
                            <div key={t.id} onClick={() => handleTalukaToggle(t.id)} 
                              className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${isSelected ? "border-tech-blue-500 bg-tech-blue-50/50" : "border-transparent bg-slate-50/50 hover:bg-slate-100"}`}
                            >
                              <span className={`text-xs font-bold ${isSelected ? "text-tech-blue-700" : "text-slate-500"}`}>{t.name}</span>
                              <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center ${isSelected ? "bg-tech-blue-600 border-tech-blue-600" : "border-slate-200 bg-white"}`}>
                                {isSelected && <Check size={12} strokeWidth={4} className="text-white" />}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full py-8 text-center px-4">
                        <p className="text-xs font-bold text-slate-400">{form.district_id ? "No talukas found." : "Select a district first."}</p>
                      </div>
                    )}
                  </div>
                </div>
                {errors.taluka_ids && <p className="text-xs text-rose-600 font-medium">{errors.taluka_ids}</p>}
              </div>
            </div>
          </div>

          <div className="mt-auto p-8 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/60 shrink-0">
            <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all">Cancel</button>
            <motion.button type="submit" disabled={isLoading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 px-10 py-2.5 bg-tech-blue-600 text-white text-sm font-black uppercase tracking-wider rounded-xl shadow-lg hover:bg-tech-blue-700 transition-all disabled:opacity-60"
            >
              {isLoading ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full" /> : <Save size={16} strokeWidth={3} />}
              {isLoading ? "Saving..." : "Save Changes"}
            </motion.button>
          </div>
        </form>
      </motion.div>

      {/* Success Modal */}
      <AnimatePresence>
        {successOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-sm z-10 p-8 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-5"><CheckCircle2 size={36} /></div>
              <h3 className="text-xl font-extrabold text-slate-800 mb-2">Profile Updated!</h3>
              <p className="text-sm text-slate-500 mb-8">Changes have been successfully saved to the server.</p>
              <button onClick={() => { setSuccessOpen(false); onClose(); }} className="w-full px-4 py-3 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-colors">Continue</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
