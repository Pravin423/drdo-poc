import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Mail,
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
} from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Email validation
  const handleEmailChange = (value) => {
    setEmail(value);
    setError("");
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    setEmailValid(isValid);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate a slight delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 600));

    const result = login(email, password);

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

            {/* Form Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8"
            >
              
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                Welcome Back
              </h2>
              <p className="text-slate-600 text-sm">
                Enter your official credentials to access the CRP management
                system
              </p>
            </motion.div>

            {/* Available Roles Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-100"
            >
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Available Access Levels
              </p>
              <div className="flex flex-wrap gap-2">
                {availableRoles.map((role, index) => (
                  <motion.div
                    key={role.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.05 }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 text-xs"
                  >
                    <role.icon size={12} />
                    <span>{role.name}</span>
                  </motion.div>
                ))}
              </div>
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
                      Authentication Failed
                    </p>
                    <p className="text-xs text-rose-700">{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Login Form */}
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Email Input */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Official Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Mail
                      size={18}
                      className={`transition-colors ${
                        emailValid ? "text-emerald-500" : "text-slate-400"
                      }`}
                    />
                  </div>
                  <input
                    id="email"
                    type="email"
                    placeholder="name@gov.in"
                    value={email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    required
                    className="w-full pl-12 pr-12 py-3.5 rounded-xl border-2 border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 text-sm transition-all duration-200 outline-none focus:border-tech-blue-500 focus:ring-4 focus:ring-tech-blue-500/10"
                  />
                  {emailValid && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                    >
                      <CheckCircle2 size={18} className="text-emerald-500" />
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Lock size={18} className="text-slate-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    required
                    className="w-full pl-12 pr-12 py-3.5 rounded-xl border-2 border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 text-sm transition-all duration-200 outline-none focus:border-tech-blue-500 focus:ring-4 focus:ring-tech-blue-500/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.01, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-6 px-6 py-4 rounded-xl bg-gradient-to-r from-tech-blue-600 to-tech-blue-500 text-white font-bold text-sm shadow-lg shadow-tech-blue-500/30 hover:shadow-xl hover:shadow-tech-blue-500/40 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Activity size={18} />
                    </motion.div>
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Access Dashboard</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </motion.button>
            </motion.form>

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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-4 text-center"
            >
              <button className="text-xs font-semibold text-tech-blue-600 hover:text-tech-blue-700 transition-colors">
                Need help accessing your account?
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
