import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Activity,
} from "lucide-react";

// Components
import LeftPanel from "../components/Login/LeftPanel";
import FormStatus from "../components/Login/FormStatus";
import FormHeader from "../components/Login/FormHeader";
import LoginForm from "../components/Login/LoginForm";
import ForgotPasswordForm from "../components/Login/ForgotPasswordForm";
import OtpForm from "../components/Login/OtpForm";
import ResetPasswordForm from "../components/Login/ResetPasswordForm";
import LoginFooter from "../components/Login/LoginFooter";

export default function Login() {
  const { login } = useAuth();
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

  // Field-level validation errors
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  // Phone validation
  const handlePhoneChange = (value) => {
    const numbersOnly = value.replace(/[^0-9]/g, "");
    if (numbersOnly.length <= 10) {
      setPhone(numbersOnly);
      setError("");
      const isValid = /^\d{10}$/.test(numbersOnly);
      setPhoneValid(isValid);
      if (phoneTouched) {
        if (!numbersOnly) {
          setPhoneError("Phone number is required");
        } else if (!isValid) {
          setPhoneError("Please enter a valid 10-digit phone number");
        } else {
          setPhoneError("");
        }
      }
    }
  };

  const handlePhoneBlur = () => {
    setPhoneTouched(true);
    if (!phone) {
      setPhoneError("Phone number is required");
    } else if (!phoneValid) {
      setPhoneError("Please enter a valid 10-digit phone number");
    } else {
      setPhoneError("");
    }
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    setError("");
    setSuccessMessage("");
    if (passwordTouched) {
      if (!value) {
        setPasswordError("Password is required");
      } else if (value.length < 8) {
        setPasswordError("Password must be at least 8 characters");
      } else {
        setPasswordError("");
      }
    }
  };

  const handlePasswordBlur = () => {
    setPasswordTouched(true);
    if (!password) {
      setPasswordError("Password is required");
    } else if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
    } else {
      setPasswordError("");
    }
  };

  // Password strength helper
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { level: 0, label: "", color: "" };
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 10) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    if (score <= 1) return { level: score, label: "Weak", color: "#ef4444" };
    if (score <= 3) return { level: score, label: "Fair", color: "#f59e0b" };
    return { level: score, label: "Strong", color: "#10b981" };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    setPhoneTouched(true);
    setPasswordTouched(true);

    let hasError = false;
    if (!phone || !phoneValid) {
      setPhoneError(phone ? "Please enter a valid 10-digit phone number" : "Phone number is required");
      hasError = true;
    }
    if (!password) {
      setPasswordError("Password is required");
      hasError = true;
    } else if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      hasError = true;
    }
    if (hasError) return;

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));

    const result = await login(phone, password);

    if (!result.success) {
      setError(result.message);
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      router.push(result.dashboard);
    }, 400);
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/forgot-password?action=send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: phone }),
      });

      const data = await res.json();

      if (!res.ok || data.status === 0) {
        setError(data.message || "Failed to send OTP. Please try again.");
        return;
      }

      setSuccessMessage(data.message || "OTP sent successfully.");
      setView("otp");
      setOtp("");
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/forgot-password?action=verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: phone, otp }),
      });

      const data = await res.json();

      if (!res.ok || data.status === 0) {
        setError(data.message || "Invalid OTP. Please try again.");
        return;
      }

      setSuccessMessage("OTP verified successfully.");
      setView("reset");
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    try {
      // reset_token cookie (set during OTP verification) is read server-side from cookies
      const res = await fetch("/api/forgot-password?action=reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobile: phone,             // user's phone number from state
          password: newPassword,
          password_confirmation: confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.status === 0) {
        setError(data.message || "Failed to reset password. Please try again.");
        return;
      }

      setSuccessMessage("Password reset successfully. Logging you in...");

      // Auto-login after successful reset
      const loginResult = await login(phone, newPassword);

      if (loginResult.success) {
        setTimeout(() => {
          router.push(`/dashboard/${loginResult.role}`);
        }, 1000);
      } else {
        setView("login");
      }
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

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
        <LeftPanel />

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
            <FormHeader view={view} phone={phone} />

            {/* Error/Success Messages */}
            <FormStatus error={error} successMessage={successMessage} />

            {/* View Switching Logic */}
            <AnimatePresence mode="wait">
              {view === "login" && (
                <LoginForm
                  phone={phone}
                  password={password}
                  phoneError={phoneError}
                  phoneValid={phoneValid}
                  passwordError={passwordError}
                  showPassword={showPassword}
                  isLoading={isLoading}
                  onPhoneChange={handlePhoneChange}
                  onPhoneBlur={handlePhoneBlur}
                  onPasswordChange={handlePasswordChange}
                  onPasswordBlur={handlePasswordBlur}
                  onShowPasswordToggle={() => setShowPassword(!showPassword)}
                  onSubmit={handleSubmit}
                  globalError={error}
                />
              )}

              {view === "forgot" && (
                <ForgotPasswordForm
                  phone={phone}
                  phoneError={phoneError}
                  phoneValid={phoneValid}
                  isLoading={isLoading}
                  onPhoneChange={handlePhoneChange}
                  onPhoneBlur={handlePhoneBlur}
                  onSubmit={handleForgotSubmit}
                  onBackToLogin={() => {
                    setView("login");
                    setError("");
                    setPhoneError("");
                    setPhoneTouched(false);
                    setSuccessMessage("");
                  }}
                />
              )}

              {view === "otp" && (
                <OtpForm
                  otp={otp}
                  isLoading={isLoading}
                  onOtpChange={setOtp}
                  onSubmit={handleOtpSubmit}
                  onBack={() => {
                    setView("forgot");
                    setError("");
                    setSuccessMessage("");
                  }}
                />
              )}

              {view === "reset" && (
                <ResetPasswordForm
                  newPassword={newPassword}
                  confirmPassword={confirmPassword}
                  newPasswordError={newPasswordError}
                  confirmPasswordError={confirmPasswordError}
                  showPassword={showPassword}
                  isLoading={isLoading}
                  getPasswordStrength={getPasswordStrength}
                  onNewPasswordChange={(val) => {
                    setNewPassword(val);
                    setError("");
                    if (!val) setNewPasswordError("New password is required");
                    else if (val.length < 8) setNewPasswordError("Password must be at least 8 characters");
                    else setNewPasswordError("");
                    if (confirmPassword && val !== confirmPassword) setConfirmPasswordError("Passwords do not match");
                    else if (confirmPassword) setConfirmPasswordError("");
                  }}
                  onConfirmPasswordChange={(val) => {
                    setConfirmPassword(val);
                    setError("");
                    if (!val) setConfirmPasswordError("Please confirm your password");
                    else if (val !== newPassword) setConfirmPasswordError("Passwords do not match");
                    else setConfirmPasswordError("");
                  }}
                  onShowPasswordToggle={() => setShowPassword(!showPassword)}
                  onSubmit={handleResetSubmit}
                />
              )}
            </AnimatePresence>

            {/* Footer */}
            <LoginFooter
              view={view}
              onForgotPassword={() => {
                setView("forgot");
                setError("");
                setSuccessMessage("");
              }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
