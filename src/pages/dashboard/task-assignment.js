"use client";

import { motion } from "framer-motion";
import { Users, MapPin } from "lucide-react";
import { Download } from "lucide-react";

import { X } from "lucide-react";

import {
  Eye,
  Edit,
  MoreHorizontal,
  Search,
  RefreshCw,
  UploadCloud,
  ChevronDown,
  UserPlus, Upload,Activity ,FileText,Shield ,ShieldCheck ,Zap
} from "lucide-react";
import { useState, useEffect } from "react";
// Update your framer-motion import to include AnimatePresence
import { AnimatePresence } from 'framer-motion';
import ProtectedRoute from "../../components/ProtectedRoute";
import DashboardLayout from "../../components/DashboardLayout";

/* ---------------- MOCK DATA ---------------- */
const CRP_DATA = [
  {
    id: 1,
    name: "Priya Desai",
    aadhaar: "1234-5678-9012",
    mobile: "9876543210",
    email: "priya.desai@goagov.in",
    district: "North Goa",
    taluka: "Bardez",
    block: "Block 1",
    villages: 5,
    status: "Active",
    lastActivity: "Task Submitted",
    vertical: "Health & Nutrition",
    time: "29 Jan 2026, 10:30 AM",
    image: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    aadhaar: "2345-6789-0123",
    mobile: "9876543211",
    email: "rajesh.kumar@goagov.in",
    district: "South Goa",
    taluka: "Salcete",
    block: "Block 2",
    villages: 7,
    status: "Active",
    lastActivity: "Attendance Marked",
    vertical: "Education & Literacy",
    time: "30 Jan 2026, 09:15 AM",
    image: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: 3,
    name: "Anita Fernandes",
    aadhaar: "3456-7890-1234",
    mobile: "9876543212",
    email: "anita.fernandes@goagov.in",
    district: "North Goa",
    taluka: "Tiswadi",
    block: "Block 3",
    villages: 4,
    status: "Active",
    lastActivity: "Training Attended",
    vertical: "Livelihood & Skills",
    time: "28 Jan 2026, 02:45 PM",
    image: "https://i.pravatar.cc/150?img=3",
  },
  {
    id: 4,
    name: "Suresh Naik",
    aadhaar: "4567-8901-2345",
    mobile: "9876543213",
    email: "suresh.naik@goagov.in",
    district: "South Goa",
    taluka: "Quepem",
    block: "Block 1",
    villages: 6,
    status: "Inactive",
    lastActivity: "Leave Applied",
    vertical: "Agriculture & Allied",
    time: "25 Jan 2026, 11:20 AM",
    image: "https://i.pravatar.cc/150?img=4",
  },
  {
    id: 5,
    name: "Meera Patel",
    aadhaar: "5678-9012-3456",
    mobile: "9876543214",
    email: "meera.patel@goagov.in",
    district: "North Goa",
    taluka: "Pernem",
    block: "Block 2",
    villages: 8,
    status: "Active",
    lastActivity: "Report Verified",
    vertical: "Infrastructure Development",
    time: "30 Jan 2026, 08:00 AM",
    image: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: 6,
    name: "Vikram Singh",
    aadhaar: "6789-0123-4567",
    mobile: "9876543215",
    email: "vikram.singh@goagov.in",
    district: "South Goa",
    taluka: "Canacona",
    block: "Block 3",
    villages: 3,
    status: "Blacklisted",
    lastActivity: "Disciplinary Action",
    vertical: "Social Welfare",
    time: "20 Jan 2026, 03:30 PM",
    image: "https://i.pravatar.cc/150?img=6",
  },
];


/* ---------------- BADGES ---------------- */
const StatusBadge = ({ status }) => {
  const styles = {
    Active: "bg-emerald-50 text-emerald-700 border-emerald-100",
    Inactive: "bg-slate-100 text-slate-600 border-slate-200",
    "On Leave": "bg-amber-50 text-amber-700 border-amber-100",
    Blacklisted: "bg-red-50 text-red-700 border-red-100",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-[11px] font-bold border ${styles[status]}`}
    >
      {status}
    </span>
  );
};

/* ---------------- PAGE ---------------- */
export default function CrpManagement() {
  
  return (
    <ProtectedRoute allowedRole="super-admin">
      

      <DashboardLayout>
        
      </DashboardLayout>
     


    </ProtectedRoute>
  );
} 