import { motion } from "framer-motion";
import { KeyRound, Activity, ArrowRight, ArrowLeft } from "lucide-react";

const OtpForm = ({
  otp,
  isLoading,
  onOtpChange,
  onSubmit,
  onBack
}) => {
  return (
    <motion.form
      key="otp"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      onSubmit={onSubmit}
      className="space-y-5"
    >
      <div className="space-y-2">
        <label htmlFor="otp" className="block text-sm font-semibold text-slate-700">
          One-Time Password (OTP 1234)
        </label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <KeyRound size={18} className="text-slate-400" />
          </div>
          <input
            id="otp"
            type="text"
            maxLength={4}
            placeholder="Enter 4-digit OTP"
            value={otp}
            onChange={(e) => onOtpChange(e.target.value.replace(/[^0-9]/g, ""))}
            required
            className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 text-sm transition-all duration-200 outline-none focus:border-tech-blue-500 focus:ring-4 focus:ring-tech-blue-500/10 tracking-widest font-mono"
          />
        </div>
      </div>

      <motion.button
        type="submit"
        disabled={isLoading || otp.length < 4}
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
            <span>Verifying...</span>
          </>
        ) : (
          <>
            <span>Verify OTP</span>
            <ArrowRight size={18} />
          </>
        )}
      </motion.button>

      <button
        type="button"
        onClick={onBack}
        className="w-full py-3 flex items-center justify-center gap-2 text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium"
      >
        <ArrowLeft size={16} /> Back
      </button>
    </motion.form>
  );
};

export default OtpForm;
