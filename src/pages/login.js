import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Phone,
  Eye,
  EyeOff,
  Shield,
  Activity,
  CheckCircle2,
  AlertCircle,
  Users,
  TrendingUp,
  ArrowRight,
  Database,
  Fingerprint,
  ArrowLeft,
  KeyRound,
  Home,
} from "lucide-react";

export default function Login() {
  const { login, verifyPhone, updatePassword } = useAuth();
  const router = useRouter();

  const [view, setView] = useState("login"); // "login" | "forgot" | "otp" | "reset"
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phoneValid, setPhoneValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Phone validation
  const handlePhoneChange = (value) => {
    // Only allow numbers
    const numbersOnly = value.replace(/[^0-9]/g, "");
    if (numbersOnly.length <= 10) {
      setPhone(numbersOnly);
      setError("");
      const isValid = /^\d{10}$/.test(numbersOnly);
      setPhoneValid(isValid);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    // Simulate a slight delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 600));

    const result = login(phone, password);

    if (!result.success) {
      setError(result.message);
      setIsLoading(false);
      return;
    }

    // Success animation before redirect
    setTimeout(() => {
      router.push(`/dashboard/${result.role}`);
    }, 400);
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 600));

    const result = verifyPhone(phone);
    setIsLoading(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    setSuccessMessage("OTP sent to " + phone);
    setView("otp");
    setOtp(""); // reset otp field
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsLoading(false);

    if (otp !== "1234") {
      setError("Invalid OTP. Please enter 1234.");
      return;
    }

    setSuccessMessage("OTP verified successfully");
    setView("reset");
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));

    const result = updatePassword(phone, newPassword);

    if (!result.success) {
      setError(result.message);
      setIsLoading(false);
      return;
    }

    setSuccessMessage("Password status updated. Logging you in...");

    // Auto log in after reset
    const loginResult = login(phone, newPassword);

    if (loginResult.success) {
      setTimeout(() => {
        router.push(`/dashboard/${loginResult.role}`);
      }, 1000);
    } else {
      setIsLoading(false);
      setView("login");
    }
  };

  const availableRoles = [
    { name: "State Admin", icon: Shield },
    { name: "District Admin", icon: Users },
    { name: "Finance Team", icon: TrendingUp },
    { name: "Supervisor", icon: Activity },
    { name: "CRP", icon: Fingerprint },
    { name: "Super Admin", icon: Shield },
  ];

  return (
    <div className="min-h-screen w-full bg-slate-50 relative overflow-hidden">
      {/* Back to Home Button */}
      <motion.button
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        onClick={() => router.push("/")}
        className="absolute top-6 left-6 lg:left-8 lg:top-8 z-50 flex items-center justify-center w-10 h-10 bg-white/80 hover:bg-white backdrop-blur-md border border-slate-200/50 rounded-full text-slate-700 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer"
      >
        <ArrowLeft size={20} className="text-slate-600 group-hover:-translate-x-0.5 group-hover:text-tech-blue-600 transition-all" />
      </motion.button>

      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, rgb(148 163 184 / 0.15) 1px, transparent 0)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="relative min-h-screen flex items-stretch">
        {/* LEFT PANEL - Visual & Branding */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="hidden lg:flex lg:w-[58%] relative bg-gradient-to-br from-tech-blue-600 via-steel-600 to-tech-blue-700 overflow-hidden"
        >
          {/* Diagonal accent stripe */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              background:
                "repeating-linear-gradient(45deg, transparent, transparent 60px, rgba(255,255,255,0.03) 60px, rgba(255,255,255,0.03) 120px)",
            }}
          />

          {/* Diagonal cut overlay - top right */}
          <div className="absolute -right-32 -top-32 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -left-32 -bottom-32 w-96 h-96 bg-tech-blue-800/30 rounded-full blur-3xl" />

          {/* Content container */}
          <div className="relative flex flex-col justify-center items-center w-full px-16 py-12">
            {/* Large Watermark Seal - Background */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.07]">
              <div className="relative w-[600px] h-[600px] rotate-[5deg]">
                <Image
                  src="/Seal_of_Goa.webp"
                  alt=""
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 w-full max-w-xl space-y-8">
              {/* Header with Seal */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="flex items-center gap-4 mb-8"
              >
                <div className="h-20 w-20 relative rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-3 shadow-2xl">
                  <Image
                    src="/Seal_of_Goa.webp"
                    alt="Government of Goa"
                    fill
                    className="object-contain p-2"
                    priority
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white leading-tight">
                    District Rural Development Agency
                  </h1>
                  <p className="text-tech-blue-100 font-medium text-sm">
                    Government of Goa
                  </p>
                </div>
              </motion.div>

              {/* Main Heading */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="space-y-4"
              >
                <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                  Secure Access Portal
                </h2>
                <p className="text-lg text-tech-blue-50 leading-relaxed">
                  Enterprise-grade authentication system for Community Resource
                  Person management. Role-based access control ensures data
                  security and operational integrity.
                </p>
              </motion.div>

              {/* Floating Security Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="grid grid-cols-2 gap-4"
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-5 shadow-xl"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                      <Shield size={20} className="text-emerald-300" />
                    </div>
                    <div className="text-white font-bold text-sm">
                      256-bit Encryption
                    </div>
                  </div>
                  <p className="text-xs text-tech-blue-100 leading-relaxed">
                    All data transmissions are secured with military-grade
                    encryption protocols
                  </p>
                </motion.div>

                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 3,
                    delay: 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-5 shadow-xl"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-xl bg-tech-blue-400/20 flex items-center justify-center">
                      <Database size={20} className="text-tech-blue-200" />
                    </div>
                    <div className="text-white font-bold text-sm">
                      Audit Logging
                    </div>
                  </div>
                  <p className="text-xs text-tech-blue-100 leading-relaxed">
                    Complete activity tracking for compliance and security
                    monitoring
                  </p>
                </motion.div>
              </motion.div>

              {/* System Status Indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="flex items-center gap-6 pt-4"
              >
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <div className="absolute inset-0 h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  </div>
                  <span className="text-sm text-white font-semibold">
                    System Online
                  </span>
                </div>
                <div className="h-4 w-px bg-white/20" />
                <div className="flex items-center gap-2 text-tech-blue-100 text-sm">
                  <Activity size={16} />
                  <span>Active Sessions: 127</span>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Decorative diagonal cut - bottom right */}
          <div
            className="absolute -bottom-24 -right-24 w-96 h-96 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-2xl"
            style={{ transform: "rotate(-15deg)" }}
          />
        </motion.div>

        {/* RIGHT PANEL - Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="flex-1 lg:w-[42%] flex items-center justify-center p-6 sm:p-12 lg:p-16"
        >
          <div className="w-full max-w-md">
            {/* Mobile Header - Only visible on small screens */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:hidden mb-8 flex items-center gap-3 pb-6 border-b border-slate-200"
            >
              <div className="h-14 w-14 relative">
                <Image
                  src="/Seal_of_Goa.webp"
                  alt="Government of Goa"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">
                  DRDA Goa Portal
                </h1>
                <p className="text-xs text-slate-600">Government of Goa</p>
              </div>
            </motion.div>

            {/* Dynamic Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8"
            >
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                {view === "login" && "Welcome Back"}
                {view === "forgot" && "Reset Password"}
                {view === "otp" && "Verify OTP"}
                {view === "reset" && "Create New Password"}
              </h2>
              <p className="text-slate-600 text-sm">
                {view === "login" && "Enter your official credentials to access the CRP management system"}
                {view === "forgot" && "Enter your registered phone number to receive a one-time password"}
                {view === "otp" && `Enter the 4-digit OTP sent to ${phone}`}
                {view === "reset" && "Please enter your new password to secure your account"}
              </p>
            </motion.div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 flex items-start gap-3"
                >
                  <AlertCircle size={18} className="text-rose-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-rose-900 mb-0.5">
                      Problem
                    </p>
                    <p className="text-xs text-rose-700">{error}</p>
                  </div>
                </motion.div>
              )}
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 flex items-start gap-3"
                >
                  <CheckCircle2 size={18} className="text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-emerald-900 mb-0.5">
                      Success
                    </p>
                    <p className="text-xs text-emerald-700">{successMessage}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* View Switching Logic */}
            <AnimatePresence mode="wait">
              {view === "login" && (
                <motion.form key="login" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label htmlFor="phone" className="block text-sm font-semibold text-slate-700">Official Phone Number</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <Phone size={18} className={`transition-colors ${phoneValid ? "text-emerald-500" : "text-slate-400"}`} />
                      </div>
                      <input id="phone" type="tel" placeholder="Enter 10-digit mobile number" value={phone} onChange={(e) => handlePhoneChange(e.target.value)} required className="w-full pl-12 pr-12 py-3.5 rounded-xl border-2 border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 text-sm transition-all duration-200 outline-none focus:border-tech-blue-500 focus:ring-4 focus:ring-tech-blue-500/10" />
                      {phoneValid && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-4 top-1/2 -translate-y-1/2">
                          <CheckCircle2 size={18} className="text-emerald-500" />
                        </motion.div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-semibold text-slate-700">Password</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <Lock size={18} className="text-slate-400" />
                      </div>
                      <input id="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" value={password} onChange={(e) => { setPassword(e.target.value); setError(""); setSuccessMessage(""); }} required className="w-full pl-12 pr-12 py-3.5 rounded-xl border-2 border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 text-sm transition-all duration-200 outline-none focus:border-tech-blue-500 focus:ring-4 focus:ring-tech-blue-500/10" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <motion.button type="submit" disabled={isLoading} whileHover={{ scale: 1.01, y: -2 }} whileTap={{ scale: 0.98 }} className="w-full mt-6 px-6 py-4 rounded-xl bg-gradient-to-r from-tech-blue-600 to-tech-blue-500 text-white font-bold text-sm shadow-lg shadow-tech-blue-500/30 hover:shadow-xl hover:shadow-tech-blue-500/40 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    {isLoading ? (<><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}><Activity size={18} /></motion.div><span>Authenticating...</span></>) : (<><span>Access Dashboard</span><ArrowRight size={18} /></>)}
                  </motion.button>
                </motion.form>
              )}

              {view === "forgot" && (
                <motion.form key="forgot" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={handleForgotSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label htmlFor="forgot-phone" className="block text-sm font-semibold text-slate-700">Registered Phone Number</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <Phone size={18} className={`transition-colors ${phoneValid ? "text-emerald-500" : "text-slate-400"}`} />
                      </div>
                      <input id="forgot-phone" type="tel" placeholder="Enter 10-digit mobile number" value={phone} onChange={(e) => handlePhoneChange(e.target.value)} required className="w-full pl-12 pr-12 py-3.5 rounded-xl border-2 border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 text-sm transition-all duration-200 outline-none focus:border-tech-blue-500 focus:ring-4 focus:ring-tech-blue-500/10" />
                      {phoneValid && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-4 top-1/2 -translate-y-1/2">
                          <CheckCircle2 size={18} className="text-emerald-500" />
                        </motion.div>
                      )}
                    </div>
                  </div>
                  <motion.button type="submit" disabled={isLoading || !phoneValid} whileHover={{ scale: 1.01, y: -2 }} whileTap={{ scale: 0.98 }} className="w-full mt-6 px-6 py-4 rounded-xl bg-gradient-to-r from-tech-blue-600 to-tech-blue-500 text-white font-bold text-sm shadow-lg shadow-tech-blue-500/30 hover:shadow-xl hover:shadow-tech-blue-500/40 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    {isLoading ? (<><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}><Activity size={18} /></motion.div><span>Sending OTP...</span></>) : (<><span>Send OTP</span><ArrowRight size={18} /></>)}
                  </motion.button>
                  <button type="button" onClick={() => { setView("login"); setError(""); setSuccessMessage(""); }} className="w-full py-3 flex items-center justify-center gap-2 text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium">
                    <ArrowLeft size={16} /> Back to Login
                  </button>
                </motion.form>
              )}

              {view === "otp" && (
                <motion.form key="otp" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={handleOtpSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label htmlFor="otp" className="block text-sm font-semibold text-slate-700">One-Time Password (OTP 1234)</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <KeyRound size={18} className="text-slate-400" />
                      </div>
                      <input id="otp" type="text" maxLength={4} placeholder="Enter 4-digit OTP" value={otp} onChange={(e) => { setOtp(e.target.value.replace(/[^0-9]/g, "")); setError(""); }} required className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 text-sm transition-all duration-200 outline-none focus:border-tech-blue-500 focus:ring-4 focus:ring-tech-blue-500/10 tracking-widest font-mono" />
                    </div>
                  </div>
                  <motion.button type="submit" disabled={isLoading || otp.length < 4} whileHover={{ scale: 1.01, y: -2 }} whileTap={{ scale: 0.98 }} className="w-full mt-6 px-6 py-4 rounded-xl bg-gradient-to-r from-tech-blue-600 to-tech-blue-500 text-white font-bold text-sm shadow-lg shadow-tech-blue-500/30 hover:shadow-xl hover:shadow-tech-blue-500/40 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    {isLoading ? (<><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}><Activity size={18} /></motion.div><span>Verifying...</span></>) : (<><span>Verify OTP</span><ArrowRight size={18} /></>)}
                  </motion.button>
                  <button type="button" onClick={() => { setView("forgot"); setError(""); setSuccessMessage(""); }} className="w-full py-3 flex items-center justify-center gap-2 text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium">
                    <ArrowLeft size={16} /> Back
                  </button>
                </motion.form>
              )}

              {view === "reset" && (
                <motion.form key="reset" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={handleResetSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label htmlFor="new-password" className="block text-sm font-semibold text-slate-700">New Password</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <Lock size={18} className="text-slate-400" />
                      </div>
                      <input id="new-password" type={showPassword ? "text" : "password"} placeholder="Enter new password" value={newPassword} onChange={(e) => { setNewPassword(e.target.value); setError(""); }} required className="w-full pl-12 pr-12 py-3.5 rounded-xl border-2 border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 text-sm transition-all duration-200 outline-none focus:border-tech-blue-500 focus:ring-4 focus:ring-tech-blue-500/10" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="confirm-password" className="block text-sm font-semibold text-slate-700">Confirm Password</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <Lock size={18} className="text-slate-400" />
                      </div>
                      <input id="confirm-password" type={showPassword ? "text" : "password"} placeholder="Confirm new password" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }} required className="w-full pl-12 pr-12 py-3.5 rounded-xl border-2 border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 text-sm transition-all duration-200 outline-none focus:border-tech-blue-500 focus:ring-4 focus:ring-tech-blue-500/10" />
                    </div>
                  </div>
                  <motion.button type="submit" disabled={isLoading} whileHover={{ scale: 1.01, y: -2 }} whileTap={{ scale: 0.98 }} className="w-full mt-6 px-6 py-4 rounded-xl bg-gradient-to-r from-tech-blue-600 to-tech-blue-500 text-white font-bold text-sm shadow-lg shadow-tech-blue-500/30 hover:shadow-xl hover:shadow-tech-blue-500/40 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    {isLoading ? (<><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}><Activity size={18} /></motion.div><span>Resetting...</span></>) : (<><span>Reset Password & Login</span><ArrowRight size={18} /></>)}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8 pt-6 border-t border-slate-100"
            >
              <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                <Shield size={14} className="text-slate-400" />
                <p>
                  Protected by government-grade security protocols. All access
                  is monitored and logged.
                </p>
              </div>
            </motion.div>

            {/* Help Link */}
            {view === "login" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="mt-6 flex justify-center"
              >
                <button
                  type="button"
                  onClick={() => { setView("forgot"); setError(""); setSuccessMessage(""); }}
                  className="group flex items-center gap-1.5 cursor-pointer text-sm font-semibold text-slate-600 hover:text-tech-blue-600 transition-colors"
                >
                  <KeyRound size={15} className="text-slate-400 cursor- group-hover:text-tech-blue-500 transition-colors" />
                  Forgot Password?
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
