// ✅ USE THIS ONE
import {
  Shield,
  MapPin,
  RefreshCw,
  Menu,
  Filter,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Clock,
  CheckCircle2,
  UploadCloud,
  AlertTriangle,
  Users,
  Activity,
  CreditCard,
  ShieldCheck,
  FileText,
  ShieldAlert,
  Zap,

  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal

} from "lucide-react";

import { useState } from "react";
import { motion } from "framer-motion";

import ProtectedRoute from "../../components/ProtectedRoute";
import DashboardLayout from "../../components/DashboardLayout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  LineChart,

} from "recharts";



export default function CrpManagement() {
  

  return (
    <ProtectedRoute allowedRole="super-admin">
      <DashboardLayout>
       
      </DashboardLayout>
    </ProtectedRoute>
  );
}

