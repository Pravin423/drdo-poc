import Image from "next/image";
import { motion } from "framer-motion";
import { Shield, Database, Activity } from "lucide-react";

const LeftPanel = () => {
  return (
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

      {/* Diagonal cut overlay */}
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
          <div className="grid grid-cols-2 gap-4">
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
          </div>

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

      {/* Decorative diagonal cut */}
      <div
        className="absolute -bottom-24 -right-24 w-96 h-96 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-2xl"
        style={{ transform: "rotate(-15deg)" }}
      />
    </motion.div>
  );
};

export default LeftPanel;
