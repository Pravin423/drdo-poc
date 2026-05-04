import { motion } from "framer-motion";
import { Shield, KeyRound } from "lucide-react";

const LoginFooter = ({ view, onForgotPassword }) => {
  return (
    <>
      {/* Security Info */}
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

      {/* Forgot Password Link */}
      {view === "login" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-6 flex justify-center"
        >
          <button
            type="button"
            onClick={onForgotPassword}
            className="group flex items-center gap-1.5 cursor-pointer text-sm font-semibold text-slate-600 hover:text-tech-blue-600 transition-colors"
          >
            <KeyRound
              size={15}
              className="text-slate-400 cursor-pointer group-hover:text-tech-blue-500 transition-colors"
            />
            Forgot Password?
          </button>
        </motion.div>
      )}
    </>
  );
};

export default LoginFooter;
