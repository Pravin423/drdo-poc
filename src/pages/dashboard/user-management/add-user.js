import {
  UserPlus,
  User,
  Mail,
  Phone,
  Shield,
  Eye,
  EyeOff,
  Lock,
  CheckCircle2,
  ArrowLeft,
  Save,
  Calendar,
  Users,
  ImagePlus,
} from "lucide-react";
import { useState, useRef } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import ProtectedRoute from "../../../components/ProtectedRoute";
import DashboardLayout from "../../../components/DashboardLayout";

// Helper: read a File as base64 data URL
const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const ROLES = [
  { value: "",  label: "Choose..." },
  { value: "1", label: "Super Admin" },
  { value: "2", label: "State Admin" },
  { value: "3", label: "District Admin" },
  { value: "4", label: "Supervisor" },
  { value: "5", label: "Finance" },
  { value: "6", label: "CRP" },
];

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
};

export default function AddUser() {
  const router = useRouter();
  const fileRef = useRef(null);

  const [form, setForm]             = useState(EMPTY);
  const [profilePreview, setProfilePreview] = useState(null);
  const [showPass, setShowPass]     = useState(false);
  const [errors, setErrors]         = useState({});
  const [isLoading, setIsLoading]   = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [apiError, setApiError]     = useState("");

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((err) => ({ ...err, [key]: "" }));
    setApiError("");
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm((f) => ({ ...f, profile: file }));
    setErrors((err) => ({ ...err, profile: "" }));
    setProfilePreview(URL.createObjectURL(file));
  };

  const validate = () => {
    const e = {};
    if (!form.fullname.trim())                            e.fullname  = "Full name is required.";
    if (!/^\d{10}$/.test(form.mobile))                   e.mobile    = "Enter a valid 10-digit mobile number.";
    if (form.password.length < 6)                        e.password  = "Password must be at least 6 characters.";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email is required.";
    if (!form.profile)                                   e.profile   = "Profile photo is required.";
    if (!form.gender)                                    e.gender    = "Please select a gender.";
    if (!form.role_id)                                   e.role_id   = "Please select a role.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setIsLoading(true);

    try {
      // Convert profile image to base64 so it can be stored in localStorage
      const profileBase64 = form.profile ? await fileToBase64(form.profile) : null;

      // Read existing users from localStorage
      const existing = JSON.parse(localStorage.getItem("managedUsers") || "[]");

      const newUser = {
        id:            Date.now(),                        // unique numeric ID
        fullname:      form.fullname,
        mobile:        form.mobile,
        email:         form.email,
        gender:        form.gender,
        role_id:       form.role_id,
        role_name:     ROLES.find(r => r.value === form.role_id)?.label || form.role_id,
        date_of_birth: form.date_of_birth || null,
        profile:       profileBase64,
        status:        "Active",
        joined:        new Date().toISOString().split("T")[0],
      };

      localStorage.setItem("managedUsers", JSON.stringify([...existing, newUser]));

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
    `w-full pl-11 pr-4 py-3 rounded-xl border-2 text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-200 ${
      errors[key]
        ? "border-rose-400 bg-rose-50 focus:ring-2 focus:ring-rose-400/20"
        : "border-slate-200 bg-white focus:border-tech-blue-500 focus:ring-4 focus:ring-tech-blue-500/10"
    }`;

  return (
    <ProtectedRoute allowedRole="super-admin">
      <>
        <DashboardLayout>
          <div className="max-w-[1600px] mx-auto space-y-8 p-4">

            {/* Header */}
            <motion.header
              initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
                  Add <span className="bg-gradient-to-b from-[#3b52ab] to-[#1a2e7a] bg-clip-text text-transparent">User</span>
                </h1>
                <p className="text-slate-500 font-medium">Create a new user account and assign a role.</p>
              </div>
              <button
                onClick={() => router.push("/dashboard/user-management/user-list")}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all shadow-sm"
              >
                <ArrowLeft size={16} /> Back to User List
              </button>
            </motion.header>

            {/* Form Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
            >
              {/* Card Header */}
              <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/60 flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-tech-blue-600 flex items-center justify-center shadow-md shadow-tech-blue-500/30">
                  <UserPlus size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-base font-bold text-slate-800">New User Registration</p>
                  <p className="text-xs text-slate-500">Fill in all required fields to create an account.</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-8">

                {/* API Error Banner */}
                <AnimatePresence>
                  {apiError && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700"
                    >
                      {apiError}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-slate-700">Full Name <span className="text-rose-500">*</span></label>
                    <div className="relative">
                      <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <input type="text" value={form.fullname} onChange={set("fullname")} placeholder="Full Name" className={inputClass("fullname")} />
                    </div>
                    {errors.fullname && <p className="text-xs text-rose-600 font-medium">{errors.fullname}</p>}
                  </div>

                  {/* Mobile */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-slate-700">Mobile <span className="text-rose-500">*</span></label>
                    <div className="relative">
                      <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <input type="tel" value={form.mobile}
                        onChange={(e) => { const v = e.target.value.replace(/\D/g, "").slice(0, 10); setForm(f => ({ ...f, mobile: v })); setErrors(err => ({ ...err, mobile: "" })); }}
                        placeholder="Mobile" className={inputClass("mobile")} />
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
                      className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        errors.profile
                          ? "border-rose-400 bg-rose-50"
                          : "border-slate-200 bg-white hover:border-tech-blue-400 hover:bg-tech-blue-50/30"
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
                    <label className="block text-sm font-semibold text-slate-700">Date Of Birth</label>
                    <div className="relative">
                      <Calendar size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <input type="date" value={form.date_of_birth} onChange={set("date_of_birth")}
                        className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-sm font-medium text-slate-800 outline-none transition-all duration-200 focus:border-tech-blue-500 focus:ring-4 focus:ring-tech-blue-500/10" />
                    </div>
                  </div>

                  {/* Gender */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-slate-700">Gender <span className="text-rose-500">*</span></label>
                    <div className="relative">
                      <Users size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <select value={form.gender} onChange={set("gender")}
                        className={`${inputClass("gender")} appearance-none bg-white`}>
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
                      <select value={form.role_id} onChange={set("role_id")}
                        className={`${inputClass("role_id")} appearance-none bg-white`}>
                        {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                      </select>
                    </div>
                    {errors.role_id && <p className="text-xs text-rose-600 font-medium">{errors.role_id}</p>}
                  </div>

                </div>

                {/* Actions */}
                <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3">
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: 1.01, y: -1 }} whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-2 px-8 py-2.5 bg-gradient-to-r from-tech-blue-600 to-tech-blue-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-tech-blue-500/30 hover:shadow-xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full" />
                    ) : (
                      <Save size={16} />
                    )}
                    {isLoading ? "Submitting..." : "Submit"}
                  </motion.button>

                  <button
                    type="button"
                    onClick={() => router.push("/dashboard/user-management/user-list")}
                    className="px-6 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                  >
                    Back
                  </button>
                </div>

              </form>
            </motion.div>

          </div>
        </DashboardLayout>

        {/* ── SUCCESS MODAL ── */}
        <AnimatePresence>
          {successOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }} transition={{ type: "spring", duration: 0.4, bounce: 0.4 }}
                className="bg-white rounded-3xl shadow-xl w-full max-w-sm z-10"
              >
                <div className="p-8 text-center flex flex-col items-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.1, bounce: 0.5 }}
                    className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-5">
                    <CheckCircle2 size={36} />
                  </motion.div>
                  <h3 className="text-xl font-extrabold text-slate-800 mb-2">User Created!</h3>
                  <p className="text-sm text-slate-500 mb-8">The new user account has been successfully registered.</p>
                  <div className="flex gap-3 w-full">
                    <button onClick={() => { setSuccessOpen(false); router.push("/dashboard/user-management/user-list"); }}
                      className="flex-1 px-4 py-3 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors active:scale-95">
                      View User List
                    </button>
                    <button onClick={() => setSuccessOpen(false)}
                      className="flex-1 px-4 py-3 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
                      Add Another
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </>
    </ProtectedRoute>
  );
}
