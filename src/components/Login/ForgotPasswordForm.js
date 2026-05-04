import { motion, AnimatePresence } from "framer-motion";
import { Phone, CheckCircle2, AlertCircle, Activity, ArrowRight, ArrowLeft } from "lucide-react";

const ForgotPasswordForm = ({
  phone,
  phoneError,
  phoneValid,
  isLoading,
  onPhoneChange,
  onPhoneBlur,
  onSubmit,
  onBackToLogin
}) => {
  return (
    <motion.form
      key="forgot"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      onSubmit={onSubmit}
      className="space-y-5"
      noValidate
    >
      <div className="space-y-1.5">
        <label htmlFor="forgot-phone" className="block text-sm font-semibold text-slate-700">
          Registered Phone Number
        </label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <Phone
              size={18}
              className={`transition-colors ${
                phoneError ? "text-rose-400" : phoneValid ? "text-emerald-500" : "text-slate-400"
              }`}
            />
          </div>
          <input
            id="forgot-phone"
            type="tel"
            placeholder="Enter 10-digit mobile number"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            onBlur={onPhoneBlur}
            className={`w-full pl-12 pr-12 py-3.5 rounded-xl border-2 bg-white text-slate-900 placeholder:text-slate-400 text-sm transition-all duration-200 outline-none focus:ring-4 ${
              phoneError
                ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/10"
                : phoneValid
                ? "border-emerald-400 focus:border-emerald-500 focus:ring-emerald-500/10"
                : "border-slate-200 focus:border-tech-blue-500 focus:ring-tech-blue-500/10"
            }`}
          />
          {phoneValid && !phoneError && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-4 top-1/2 -translate-y-1/2">
              <CheckCircle2 size={18} className="text-emerald-500" />
            </motion.div>
          )}
          {phoneError && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-4 top-1/2 -translate-y-1/2">
              <AlertCircle size={18} className="text-rose-500" />
            </motion.div>
          )}
        </div>
        <AnimatePresence>
          {phoneError && (
            <motion.p
              key="forgot-phone-err"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-xs text-rose-600 flex items-center gap-1 mt-1"
            >
              <AlertCircle size={12} />
              {phoneError}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <motion.button
        type="submit"
        disabled={isLoading || !phoneValid}
        whileHover={{ scale: 1.01, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="w-full mt-6 px-6 py-4 rounded-xl bg-gradient-to-r from-tech-blue-600 to-tech-blue-500 text-white font-bold text-sm shadow-lg shadow-tech-blue-500/30 hover:shadow-xl hover:shadow-tech-blue-500/40 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Activity size={18} />
            </motion.div>
            <span>Sending OTP...</span>
          </>
        ) : (
          <>
            <span>Send OTP</span>
            <ArrowRight size={18} />
          </>
        )}
      </motion.button>

      <button
        type="button"
        onClick={onBackToLogin}
        className="w-full py-3 flex items-center justify-center gap-2 text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium"
      >
        <ArrowLeft size={16} /> Back to Login
      </button>
    </motion.form>
  );
};

export default ForgotPasswordForm;
