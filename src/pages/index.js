import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Shield,
  Users,
  TrendingUp,
  Lock,
  Globe,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Database,
  Activity,
  FileCheck,
  Building2,
  Phone,
  Mail
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white relative">
      {/* Professional Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
  <div className="max-w-7xl mx-auto px-6 py-4 lg:px-8">
    <div className="flex items-center justify-between">
      
      {/* Left: Logo + Title */}
      <div className="flex items-center gap-4">
        <div className="h-16 w-16">
          <Image
            src="/Seal_of_Goa.webp"
            alt="Government of Goa Seal"
            width={64}
            height={64}
            priority
            className="object-contain"
          />
        </div>

        <div className="leading-tight">
          <h1 className="text-lg font-bold text-slate-900">
            District Rural Development Agency
          </h1>
          <p className="text-sm text-slate-600 font-medium">
            Government of Goa
          </p>
        </div>
      </div>

      {/* Right: Login */}
      <Link
        href="/login"
        aria-label="Login to CRP Portal"
        className="inline-flex items-center gap-2 px-4 py-2.5 sm:px-6 rounded-xl bg-tech-blue-500 text-white font-semibold text-sm hover:bg-tech-blue-600 transition-colors shadow-lg shadow-tech-blue-500/30"
      >
        <Lock size={16} />
        <span className="hidden sm:inline">Login</span>
      </Link>

    </div>
  </div>
</header>


      {/* Hero Section - Professional & Institutional */}
      <section className="relative px-6 py-16 lg:py-24 lg:px-8 bg-gradient-to-b from-slate-50 to-white">
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
          <div className="absolute top-0 right-0 w-96 h-96 bg-tech-blue-100 rounded-full mix-blend-multiply filter blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-steel-100 rounded-full mix-blend-multiply filter blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >


              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
                Community Resource Person Management System
              </h1>

              <p className="text-lg text-slate-700 leading-relaxed mb-8">
                A centralized digital platform for efficient management and monitoring of
                Community Resource Persons (CRPs) under the District Rural Development Agency,
                Government of Goa. Designed to streamline administrative processes, enhance
                transparency, and improve rural development program delivery.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center mt-0.5">
                    <CheckCircle2 size={18} className="text-emerald-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Role-Based Access Control</h3>
                    <p className="text-sm text-slate-600">
                      Secure authentication for State Administrators, District Officials, Finance Teams, Supervisors, and CRPs
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-tech-blue-100 flex items-center justify-center mt-0.5">
                    <CheckCircle2 size={18} className="text-tech-blue-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Real-Time Data Synchronization</h3>
                    <p className="text-sm text-slate-600">
                      Automated data collection and reporting for attendance, task management, and honorarium processing
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-steel-100 flex items-center justify-center mt-0.5">
                    <CheckCircle2 size={18} className="text-steel-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Comprehensive Analytics</h3>
                    <p className="text-sm text-slate-600">
                      Dashboard insights and performance metrics for data-driven decision making
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-tech-blue-500 text-white font-semibold hover:bg-tech-blue-600 transition-all duration-300 shadow-lg shadow-tech-blue-500/30 hover:shadow-xl hover:shadow-tech-blue-500/40"
                >
                  <Lock size={18} />
                  Access Secure Portal
                  <ArrowRight size={18} />
                </Link>
                <button className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white border-2 border-slate-300 text-slate-700 font-semibold hover:border-tech-blue-400 hover:bg-tech-blue-50 hover:text-tech-blue-700 transition-all duration-300">
                  <FileCheck size={18} />
                  System Documentation
                </button>
              </div>
            </motion.div>

            {/* Right Side - Professional Info Cards */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Image Card */}
              <div className="h-[420px] rounded-3xl border-2 border-slate-200 bg-white shadow-xl overflow-hidden flex items-center justify-center">
                <img
                  src="/Seal_of_Goa.webp"
                  alt="Seal of Goa"
                  className="max-w-[85%] max-h-[85%] object-contain"
                />
              </div>

              {/* Security & Compliance */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="h-10 w-10 rounded-xl bg-rose-100 flex items-center justify-center mb-3">
                    <Lock size={20} className="text-rose-600" />
                  </div>
                  <p className="font-bold text-slate-900 mb-1">Secure Access</p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    256-bit encryption & role-based authentication
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center mb-3">
                    <Database size={20} className="text-emerald-600" />
                  </div>
                  <p className="font-bold text-slate-900 mb-1">Data Integrity</p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Automated backups & audit trail logging
                  </p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="px-6 py-20 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              System Capabilities
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Comprehensive tools designed to support rural development initiatives and streamline administrative workflows
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Users,
                title: "CRP Database Management",
                description: "Centralized repository of all Community Resource Persons with detailed profiles, qualifications, and assignment history.",
                color: "tech-blue"
              },
              {
                icon: MapPin,
                title: "Geographic Coverage Tracking",
                description: "Monitor CRP distribution and field activities across all districts with geo-tagged attendance and task verification.",
                color: "steel"
              },
              {
                icon: TrendingUp,
                title: "Performance Analytics",
                description: "Real-time dashboards displaying attendance trends, task completion rates, and program effectiveness metrics.",
                color: "emerald"
              },
              {
                icon: FileCheck,
                title: "Honorarium Calculation",
                description: "Automated computation of honorariums based on attendance, task completion, and approved rates with audit trails.",
                color: "amber"
              },
              {
                icon: Shield,
                title: "Audit & Compliance",
                description: "Comprehensive logging of all system activities with role-based access controls ensuring data security and accountability.",
                color: "rose"
              },
              {
                icon: Globe,
                title: "Multi-Level Access",
                description: "Hierarchical access system for State, District, Block, and Field level officials with customized views and permissions.",
                color: "purple"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="rounded-2xl border border-slate-200 bg-white p-6 hover:border-tech-blue-300 hover:shadow-lg transition-all duration-300"
              >
                <div className={`h-12 w-12 rounded-xl bg-${feature.color}-100 flex items-center justify-center mb-4`}>
                  <feature.icon size={24} className={`text-${feature.color}-600`} />
                </div>
                <h3 className="font-bold text-slate-900 mb-2 text-lg">{feature.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="px-6 py-20 lg:px-8 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              System Performance Metrics
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Current statistics from the CRP Management System
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Districts Covered", value: "6", icon: Globe, color: "tech-blue" },
              { label: "Active CRPs", value: "12,847", icon: Users, color: "emerald" },
              { label: "Average Attendance", value: "87.3%", icon: Activity, color: "amber" },
              { label: "System Uptime", value: "98.5%", icon: Shield, color: "rose" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-8 rounded-2xl border-2 border-slate-200 bg-slate-50 hover:border-tech-blue-300 transition-all duration-300"
              >
                <div className={`inline-flex h-14 w-14 items-center justify-center rounded-xl bg-${stat.color}-100 mb-4`}>
                  <stat.icon size={28} className={`text-${stat.color}-600`} />
                </div>
                <p className="text-4xl font-bold text-slate-900 mb-2">{stat.value}</p>
                <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 lg:px-8 bg-gradient-to-br from-tech-blue-600 via-steel-600 to-tech-blue-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '48px 48px'
          }} />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Access the Secure Portal
            </h2>
            <p className="text-lg text-tech-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Authorized government officials and CRPs can access the system using
              their official credentials. All access is logged and monitored for security.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-xl bg-white text-tech-blue-600 font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
            >
              <Lock size={22} />
              Login to CRP Portal
              <ArrowRight size={22} />
            </Link>
            <p className="mt-6 text-sm text-tech-blue-100 flex items-center justify-center gap-2">
              <Shield size={16} />
              <span>Verified Government Access Only • Role-Based Authentication</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300">
        <div className="max-w-7xl mx-auto px-6 py-12 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* About */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 relative">
                  <Image
                    src="/Seal_of_Goa.webp"
                    alt="Government of Goa Seal"
                    width={48}
                    height={48}
                    className="object-contain brightness-200"
                  />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">DRDA Goa</p>
                  <p className="text-xs text-slate-400">Government of Goa</p>
                </div>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                District Rural Development Agency committed to empowering rural communities through effective program management.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wide">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/login" className="hover:text-tech-blue-400 transition-colors">Portal Login</Link></li>
                <li><a href="#" className="hover:text-tech-blue-400 transition-colors">System Documentation</a></li>
                <li><a href="#" className="hover:text-tech-blue-400 transition-colors">User Guidelines</a></li>
                <li><a href="#" className="hover:text-tech-blue-400 transition-colors">Support</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wide">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-tech-blue-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-tech-blue-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-tech-blue-400 transition-colors">Security Guidelines</a></li>
                <li><a href="#" className="hover:text-tech-blue-400 transition-colors">FAQ</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wide">Contact</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <Building2 size={16} className="mt-0.5 shrink-0 text-tech-blue-400" />
                  <span>District Rural Development Agency, Panaji, Goa</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone size={16} className="shrink-0 text-tech-blue-400" />
                  <span>+91-832-XXXXXXX</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail size={16} className="shrink-0 text-tech-blue-400" />
                  <span>drda@goa.gov.in</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-slate-400">
                © 2026 District Rural Development Agency, Government of Goa. All Rights Reserved.
              </p>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-2 text-sm">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-slate-400">System Online</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
