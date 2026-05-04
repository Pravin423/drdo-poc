import { motion, AnimatePresence } from "framer-motion";
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, Activity, ArrowRight } from "lucide-react";

const ResetPasswordForm = ({
  newPassword,
  confirmPassword,
  newPasswordError,
  confirmPasswordError,
  showPassword,
  isLoading,
  getPasswordStrength,
  onNewPasswordChange,
  onConfirmPasswordChange,
  onShowPasswordToggle,
  onSubmit
}) => {
  const strength = getPasswordStrength(newPassword);

  return (
    <motion.form
      key="reset"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      onSubmit={onSubmit}
      className="space-y-5"
      noValidate
    >
      {/* New Password */}
      <div className="space-y-1.5">
        <label htmlFor="new-password" className="block text-sm font-semibold text-slate-700">
          New Password
        </label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <Lock
              size={18}
              className={`transition-colors ${
                newPasswordError ? "text-rose-400" : newPassword && newPassword.length >= 6 ? "text-emerald-500" : "text-slate-400"
              }`}
            />
          </div>
          <input
            id="new-password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter new password (min. 8 characters)"
            value={newPassword}
            onPaste={(e) => e.preventDefault()}
            onChange={(e) => onNewPasswordChange(e.target.value)}
            className={`w-full pl-12 pr-12 py-3.5 rounded-xl border-2 bg-white text-slate-900 placeholder:text-slate-400 text-sm transition-all duration-200 outline-none focus:ring-4 ${
              newPasswordError
                ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/10"
                : newPassword && newPassword.length >= 6
                ? "border-emerald-400 focus:border-emerald-500 focus:ring-emerald-500/10"
                : "border-slate-200 focus:border-tech-blue-500 focus:ring-tech-blue-500/10"
            }`}
          />
          <button
            type="button"
            onClick={onShowPasswordToggle}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Password Strength Bar */}
        {newPassword && (
          <div className="space-y-1">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-1 flex-1 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: i <= strength.level ? strength.color : "#e2e8f0",
                  }}
                />
              ))}
            </div>
            <p className="text-xs font-medium" style={{ color: strength.color }}>
              {strength.label} password
            </p>
          </div>
        )}

        <AnimatePresence>
          {newPasswordError && (
            <motion.p
              key="new-pass-err"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-xs text-rose-600 flex items-center gap-1"
            >
              <AlertCircle size={12} />
              {newPasswordError}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Confirm Password */}
      <div className="space-y-1.5">
        <label htmlFor="confirm-password" className="block text-sm font-semibold text-slate-700">
          Confirm Password
        </label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <Lock
              size={18}
              className={`transition-colors ${
                confirmPasswordError
                  ? "text-rose-400"
                  : confirmPassword && confirmPassword === newPassword
                  ? "text-emerald-500"
                  : "text-slate-400"
              }`}
            />
          </div>
          <input
            id="confirm-password"
            type={showPassword ? "text" : "password"}
            placeholder="Re-enter new password"
            value={confirmPassword}
            onPaste={(e) => e.preventDefault()}
            onChange={(e) => onConfirmPasswordChange(e.target.value)}
            className={`w-full pl-12 pr-12 py-3.5 rounded-xl border-2 bg-white text-slate-900 placeholder:text-slate-400 text-sm transition-all duration-200 outline-none focus:ring-4 ${
              confirmPasswordError
                ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/10"
                : confirmPassword && confirmPassword === newPassword
                ? "border-emerald-400 focus:border-emerald-500 focus:ring-emerald-500/10"
                : "border-slate-200 focus:border-tech-blue-500 focus:ring-tech-blue-500/10"
            }`}
          />
          {confirmPassword && confirmPassword === newPassword && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              <CheckCircle2 size={18} className="text-emerald-500" />
            </motion.div>
          )}
        </div>
        <AnimatePresence>
          {confirmPasswordError && (
            <motion.p
              key="confirm-pass-err"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-xs text-rose-600 flex items-center gap-1"
            >
              <AlertCircle size={12} />
              {confirmPasswordError}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <motion.button
        type="submit"
        disabled={
          isLoading ||
          !!newPasswordError ||
          !!confirmPasswordError ||
          !newPassword ||
          !confirmPassword
        }
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
            <span>Resetting...</span>
          </>
        ) : (
          <>
            <span>Reset Password & Login</span>
            <ArrowRight size={18} />
          </>
        )}
      </motion.button>
    </motion.form>
  );
};

export default ResetPasswordForm;
