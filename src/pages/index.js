import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Navbar } from "@/components/HomePage/Navbar";
import { Hero } from "@/components/HomePage/Hero";
import { Workflow } from "@/components/HomePage/Workflow";
import { Stats } from "@/components/HomePage/Stats";
import { Pillars } from "@/components/HomePage/Pillars";
import { Impact } from "@/components/HomePage/Impact";
import Journery from "@/components/HomePage/Journery";
import { Cta } from "@/components/HomePage/Cta";
import Voices from '@/components/HomePage/Voices';
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
      <Head>
        <title>DRDA GOA</title>
        <link rel="icon" href="/Seal_of_Goa.webp" />
      </Head>
      {/* Professional Header */}
      <Navbar />

      {/* Hero Section - Professional & Institutional */}
      <Hero />

      {/* Organization Workflow */}
      <Workflow />

      {/* Statistics Section */}
      <Stats />

      {/* Operational Pillars Section */}
      <Pillars />

      {/* Impact Grid Section */}
      <Impact />

      {/* Shared Journey Section */}
      <Journery />

      <Voices/>

      {/* CTA Section */}
      <Cta />

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
