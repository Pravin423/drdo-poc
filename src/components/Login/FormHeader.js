import { motion } from "framer-motion";

const FormHeader = ({ view, phone }) => {
  const getHeaderContent = () => {
    switch (view) {
      case "forgot":
        return {
          title: "Reset Password",
          desc: "Enter your registered phone number to receive a one-time password",
        };
      case "otp":
        return {
          title: "Verify OTP",
          desc: `Enter the 4-digit OTP sent to ${phone}`,
        };
      case "reset":
        return {
          title: "Create New Password",
          desc: "Please enter your new password to secure your account",
        };
      case "login":
      default:
        return {
          title: "Welcome Back",
          desc: "Enter your official credentials to access the CRP management system",
        };
    }
  };

  const { title, desc } = getHeaderContent();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mb-8"
    >
      <h2 className="text-3xl font-bold text-slate-900 mb-2">{title}</h2>
      <p className="text-slate-600 text-sm">{desc}</p>
    </motion.div>
  );
};

export default FormHeader;
