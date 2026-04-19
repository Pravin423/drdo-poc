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
import Footer from '@/components/HomePage/Footer';  
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
     <Footer/>
    </div>
  );
}
