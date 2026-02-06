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
  UserPlus, Upload
} from "lucide-react";
import { useState } from "react";
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
  const [selectedCRP, setSelectedCRP] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [aadhaarVerified, setAadhaarVerified] = useState(false);
  const [otpError, setOtpError] = useState("");


  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmChecked, setConfirmChecked] = useState(false);


  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);


  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [bulkFile, setBulkFile] = useState(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [district, setDistrict] = useState("All Districts");
  const [taluka, setTaluka] = useState("All Talukas");
  const [vertical, setVertical] = useState("All Verticals");

  // Stats
  const totalCRPs = CRP_DATA.length;
  const activeCRPs = CRP_DATA.filter((c) => c.status === "Active").length;
  const inactiveCRPs = CRP_DATA.filter((c) => c.status === "Inactive").length;
  const villagesCovered = CRP_DATA.reduce((sum, c) => sum + c.villages, 0);


  const summaryCards = [
    { label: "Total CRPs", value: totalCRPs, icon: Users, accent: "bg-blue-50 text-blue-600 border-blue-200" },
    { label: "Active CRPs", value: activeCRPs, icon: Users, accent: "bg-emerald-50 text-emerald-600 border-emerald-200" },
    { label: "Inactive CRPs", value: inactiveCRPs, icon: Users, accent: "bg-rose-50 text-rose-600 border-rose-200" },
    { label: "Villages Covered", value: villagesCovered, icon: MapPin, accent: "bg-purple-50 text-purple-600 border-purple-200" },
  ];
  const exportToCSV = () => {
    if (!filteredCRPs.length) return;

    const headers = [
      "Name",
      "Aadhaar",
      "Mobile",
      "Email",
      "District",
      "Taluka",
      "Block",
      "Villages",
      "Status",
      "Last Activity",
      "Time",
    ];

    const rows = filteredCRPs.map(crp => [
      crp.name,
      crp.aadhaar,
      crp.mobile,
      crp.email,
      crp.district,
      crp.taluka,
      crp.block,
      crp.villages,
      crp.status,
      crp.lastActivity,
      crp.time,
    ]);

    const csvContent =
      [headers, ...rows]
        .map(row => row.map(val => `"${val ?? ""}"`).join(","))
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `CRP_Records_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  const openModal = (crp) => {
    setSelectedCRP(crp);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCRP(null);
  }

  const handleSubmit = () => {
    setSubmitted(true);

    if (!form.name || !form.aadhaar || !form.mobile) {
      alert("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsRegisterOpen(false);

      setForm({
        name: "",
        aadhaar: "",
        mobile: "",
        email: ""
      });

      setConfirmChecked(false);
      setSubmitted(false);
    }, 1500);
  };




  // Filter CRPs
  const filteredCRPs = CRP_DATA.filter((crp) => {
    const matchSearch =
      crp.name.toLowerCase().includes(search.toLowerCase()) ||
      crp.aadhaar.includes(search) ||
      crp.mobile.includes(search);

    const matchStatus = status === "All" || crp.status === status;
    const matchDistrict = district === "All Districts" || crp.district === district;
    const matchTaluka = taluka === "All Talukas" || crp.taluka === taluka;
    const matchVertical = vertical === "All Verticals" || crp.vertical === vertical;

    return matchSearch && matchStatus && matchDistrict && matchTaluka && matchVertical;
  });

  const [form, setForm] = useState({
    // Personal Details
    name: "",
    aadhaar: "",
    mobile: "",
    email: "",

    // Assignment Details
    district: "",
    taluka: "",
    block: "",
    vertical: "",

    // Work Details
    villagesAssigned: "",

    // Banking Details
    bankAccountNo: "",
    ifscCode: "",
    bankName: "",
    branchName: "",

    // Documents
    photo: null,

    // Status / Meta
    status: "Active",
    remarks: ""
  });

  const [submitted, setSubmitted] = useState(false);


  return (
    <ProtectedRoute allowedRole="super-admin">
      {isBulkImportOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/50 backdrop-blur-md px-4">
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="bg-white w-full max-w-2xl rounded-3xl shadow-xl border border-slate-200 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Bulk Import CRPs</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Upload CRP details using a CSV or Excel file
                </p>
              </div>

              <button
                onClick={() => setIsBulkImportOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Instructions */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <h4 className="font-semibold text-slate-800 mb-3">
                  Before you upload
                </h4>
                <ul className="text-sm text-slate-600 space-y-2 list-disc list-inside">
                  <li>Download the template and fill in CRP details</li>
                  <li>All mandatory fields must be completed</li>
                  <li>Aadhaar must be 12 digits and mobile number 10 digits</li>
                  <li>Separate multiple villages or verticals using semicolons (;)</li>
                  <li>Maximum file size allowed is 5MB</li>
                </ul>
              </div>

              {/* Download Template */}
              <div className="flex justify-center">
                <button

                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold hover:bg-slate-100 transition"
                >
                  <Download size={16} />
                  Download Import Template
                </button>
              </div>

              {/* Upload Area */}
              <label className="group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 p-8 cursor-pointer transition hover:border-slate-400 hover:bg-slate-50">
                <UploadCloud
                  size={34}
                  className="text-slate-400 group-hover:text-slate-600 mb-3 transition"
                />

                {!bulkFile ? (
                  <>
                    <p className="text-sm font-medium text-slate-700">
                      Click to upload or drag & drop
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      CSV or XLSX (max 5MB)
                    </p>
                  </>
                ) : (
                  <div className="flex items-center gap-3 bg-white border rounded-xl px-4 py-2">
                    <span className="text-sm font-medium text-slate-700 truncate max-w-[200px]">
                      {bulkFile.name}
                    </span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setBulkFile(null);
                      }}
                      className="text-slate-400 hover:text-red-500"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}

                <input
                  type="file"
                  accept=".csv,.xlsx"
                  className="hidden"
                  onChange={(e) => setBulkFile(e.target.files[0])}
                />
              </label>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t bg-slate-50">
              <button
                onClick={() => {
                  setIsBulkImportOpen(false);
                  setBulkFile(null);
                }}
                className="px-4 py-2 rounded-xl cursor-pointer border text-sm font-semibold hover:bg-white transition"
              >
                Cancel
              </button>

              <button
                disabled={!bulkFile || isUploading}
                onClick={() => {
                  setIsUploading(true);

                  // simulate API call
                  setTimeout(() => {
                    setIsUploading(false);
                    setUploadSuccess(true);

                    setTimeout(() => {
                      setUploadSuccess(false);
                      setBulkFile(null);
                      setIsBulkImportOpen(false);
                    }, 1200);
                  }, 2000);
                }}
                className={`px-5 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition
    ${!bulkFile || isUploading
                    ? "bg-slate-300 text-white cursor-not-allowed"
                    : "bg-slate-900 text-white hover:bg-slate-800"
                  }`}
              >
                {isUploading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    Uploading...
                  </>
                ) : uploadSuccess ? (
                  <span className="text-emerald-200">
                    Imported
                  </span>
                ) : (
                  <>
                    <UploadCloud size={16} />
                    Import CRPs
                  </>
                )}
              </button>

            </div>
          </motion.div>
        </div>
      )}

      <DashboardLayout>
        <div className="max-w-[1600px]  mx-auto space-y-8 p-6">
          {/* ---------- HEADER ---------- */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col  md:flex-row md:items-center justify-between gap-4"
          >
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                CRP{" "}
                <span className="bg-gradient-to-b from-[#3b52ab] to-[#1a2e7a] bg-clip-text text-transparent">
                  Management
                </span>
              </h1>
              <p className="text-slate-500 font-medium">
                Manage Community Resource Persons across Goa
              </p>
            </div>



            <div className="flex gap-3">
              <button onClick={() => setIsBulkImportOpen(true)} className="px-4 cursor-pointer py-2 border rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-slate-50">
                <UploadCloud size={16} /> Bulk Import
              </button>
              <button onClick={() => {
                setIsRegisterOpen(true)
              }} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800">
                + Register New CRP
              </button>
            </div>
          </motion.header>

          {/* ---------- SUMMARY CARDS ---------- */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {summaryCards.map((card, index) => (
              <motion.section
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex justify-between items-start">
                  <div className={`p-2.5 rounded-2xl border ${card.accent}`}>
                    <card.icon size={20} />
                  </div>
                </div>

                <div className="mt-5 space-y-1">
                  <p className="text-2xl font-bold text-slate-900 tracking-tight">{card.value}</p>
                  <p className="text-sm font-medium text-slate-500">{card.label}</p>
                </div>

                <div className="absolute -right-2 -bottom-2 opacity-5 transition-transform group-hover:scale-110">
                  <card.icon size={80} />
                </div>
              </motion.section>
            ))}
          </div>

          {/* ---------- FILTERS ---------- */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            {/* Header Section */}
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Filter Records</h3>
            </div>

            <div className="p-6">
              {/* Main Responsive Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-5">

                {/* Search Input - Spanned for importance */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 ml-1">Search</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Search size={16} className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                      placeholder="Name, Aadhaar, mobile..."
                      className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none bg-slate-50/30 focus:bg-white"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>

                {/* Select Groups */}
                {[
                  { label: "District", value: district, setter: setDistrict, options: ["All Districts", "North Goa", "South Goa"] },
                  { label: "Taluka", value: taluka, setter: setTaluka, options: ["All Talukas", "Bardez", "Tiswadi"] },
                  { label: "Status", value: status, setter: setStatus, options: ["All Statuses", "Active", "Inactive", "On Leave"] },
                  { label: "Vertical", value: vertical, setter: setVertical, options: ["All Verticals", "Health", "Education"] },
                ].map((filter, idx) => (
                  <div key={idx} className="relative">
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 ml-1">{filter.label}</label>
                    <div className="relative">
                      <select
                        className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none appearance-none bg-slate-50/30 focus:bg-white cursor-pointer transition-all"
                        value={filter.value}
                        onChange={(e) => filter.setter(e.target.value)}
                      >
                        {filter.options.map(opt => <option key={opt}>{opt}</option>)}
                      </select>
                      {/* Custom Arrow Icon */}
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                        <ChevronDown size={14} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Footer */}
              <div className="flex flex-col sm:flex-row justify-end items-center mt-8 pt-6 border-t border-slate-100 gap-3">

                {/* Clear Filters */}
                <button
                  onClick={() => {
                    setSearch("");
                    setStatus("All Statuses");
                    setDistrict("All Districts");
                    setTaluka("All Talukas");
                    setVertical("All Verticals");
                  }}
                  className="w-full sm:w-auto text-slate-500 border border-slate-200 hover:text-slate-800 hover:bg-slate-50 rounded-xl px-5 py-2.5 text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <RefreshCw size={16} />
                  Clear All
                </button>



                {/* Export CSV */}
                <button
                  onClick={exportToCSV}
                  className="px-4 py-2 border rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-slate-50"
                >
                  <UploadCloud size={16} />
                  Export CSV
                </button>


              </div>

            </div>
          </div>

          {/* ---------- TABLE ---------- */}
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50/60">
                <tr>
                  {["Image", "CRP Details", "Contact", "Assignment", "Status", "Last Activity", "Actions"].map(
                    (h) => (
                      <th
                        key={h}
                        className={`px-6 py-4 text-xs font-bold text-slate-500 uppercase ${h === "Actions" ? "text-right" : "text-left"
                          }`}
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredCRPs.map((crp, idx) => (
                  <motion.tr
                    key={crp.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-slate-50/70"
                  >
                    <td className="px-6 py-4">
                      <img src={crp.image} alt={crp.name} className="w-10 h-10 rounded-full object-cover" />
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900">{crp.name}</p>
                      <p className="text-xs text-slate-500">Aadhaar: {crp.aadhaar}</p>
                    </td>

                    <td className="px-6 py-4 text-sm">
                      <p>{crp.mobile}</p>
                      <p className="text-xs text-slate-500">{crp.email}</p>
                    </td>

                    <td className="px-6 py-4 text-sm">
                      <p className="font-medium">{crp.district}</p>
                      <p className="text-xs text-slate-500">
                        {crp.taluka} – {crp.block} • {crp.villages} villages
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge status={crp.status} />
                    </td>

                    <td className="px-6 py-4 text-sm">
                      <p>{crp.lastActivity}</p>
                      <p className="text-xs text-slate-500">{crp.time}</p>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex gap-3 text-slate-500">
                        <Eye size={18} onClick={() => openModal(crp)} className="cursor-pointer hover:text-blue-600" />
                        <Edit size={18} className="cursor-pointer hover:text-emerald-600" />
                        <MoreHorizontal size={18} className="cursor-pointer hover:text-slate-700" />
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>




        </div>
      </DashboardLayout>
      <AnimatePresence>
        {isRegisterOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md px-4">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-4xl rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200"
            >
              {/* 1. Profile-Style Header */}
              <div className="relative h-28 bg-gradient-to-r from-slate-800 to-slate-900 px-8 flex items-center">
                <div className="flex items-center gap-5">
                  <div className="p-3.5 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20 shadow-inner">
                    <UserPlus className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white drop-shadow-sm">
                      Register New CRP
                    </h2>
                    <p className="text-slate-400 text-xs font-medium mt-0.5">Onboard a new Community Resource Person to the platform</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsRegisterOpen(false)}
                  className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* 2. Content Body (Scrollable) */}
              <div className="max-h-[70vh] overflow-y-auto pt-8 px-8 pb-4 space-y-8 custom-scrollbar">

                {/* Section: Personal Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <h3 className="text-sm font-bold text-slate-900">Personal Information</h3>
                    <p className="text-xs text-slate-500 mt-1">Identity and contact information for the individual.</p>
                  </div>
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name *</p>
                      <input
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-500 transition-all outline-none text-sm"
                        placeholder="Enter name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                        Aadhaar Number *
                      </p>

                      <div className="relative">
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={12}
                          placeholder="000000000000"
                          value={form.aadhaar}
                          disabled={aadhaarVerified}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            setForm({ ...form, aadhaar: value });
                          }}
                          className={`w-full px-4 py-2.5 rounded-xl pr-28 text-sm outline-none transition-all
        ${aadhaarVerified
                              ? "bg-slate-100 border border-emerald-400 text-slate-600"
                              : "bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500"
                            }`}
                        />

                        {/* Right Button */}
                        {aadhaarVerified ? (
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-600 font-semibold text-sm">
                            Verified
                          </span>
                        ) : (
                          <button
                            type="button"
                            disabled={form.aadhaar.length !== 12}
                            onClick={() => setIsOtpModalOpen(true)}
                            className={`absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-sm font-semibold
          ${form.aadhaar.length === 12
                                ? "text-blue-500 hover:underline"
                                : "text-slate-300 cursor-not-allowed"
                              }`}
                          >
                            Verify Aadhaar
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Mobile Number *</p>
                      <input
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-500 transition-all outline-none text-sm"
                        placeholder="+91"
                        value={form.mobile}
                        onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</p>
                      <input
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-500 transition-all outline-none text-sm"
                        placeholder="email@domain.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <hr className="border-slate-100" />

                {/* Section: Assignment & Financial */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <h3 className="text-sm font-bold text-slate-900">Work & Finance</h3>
                    <p className="text-xs text-slate-500 mt-1">Village assignments and banking credentials.</p>
                  </div>
                  <div className="md:col-span-2 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <select className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none"><option>Select District</option></select>
                      <select className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none"><option>Select Vertical</option></select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none" placeholder="Bank Account No." />
                      <input className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none" placeholder="IFSC Code" />
                    </div>
                    <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm"><Upload size={16} className="text-blue-600" /></div>
                      <div className="flex-1">
                        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Document Upload</p>
                        <p className="text-xs text-slate-500">Upload Photo (Max 2MB)</p>
                      </div>
                      <input type="file" className="hidden" id="file-upload" />
                      <label htmlFor="file-upload" className="px-3 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-lg cursor-pointer hover:bg-blue-700 transition-colors">BROWSE</label>
                    </div>
                  </div>
                </div>

                {/* Confirmation Checkbox */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={confirmChecked}
                      onChange={(e) => setConfirmChecked(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                    />
                    <span className="text-xs text-slate-600 leading-relaxed font-medium">
                      I confirm that all the information provided above is accurate. I understand that any discrepancies may lead to the rejection of this registration.
                    </span>
                  </label>
                </div>
              </div>

              {/* 3. Footer Actions */}
              <div className="px-8 py-5 bg-slate-50/80 border-t flex justify-end items-center gap-3">
                <button
                  onClick={() => setIsRegisterOpen(false)}
                  className="px-6 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-white transition-all shadow-sm"
                >
                  Cancel
                </button>
                <button
                  disabled={!confirmChecked || isSubmitting}
                  onClick={handleSubmit}
                  className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-slate-200 flex items-center gap-2 ${confirmChecked ? "bg-slate-900 text-white hover:bg-slate-800 active:scale-95" : "bg-slate-300 text-white cursor-not-allowed"
                    }`}
                >
                  {isSubmitting ? "Processing..." : "Register CRP"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {isModalOpen && selectedCRP && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md px-4">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white w-full max-w-3xl rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200"
          >
            {/* 1. Profile Header with Gradient Background */}
            <div className="relative h-32 bg-gradient-to-r from-slate-800 to-slate-900 px-8 flex items-end">
              <button
                onClick={closeModal}
                className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex translate-y-12 items-end gap-6">
                <div className="relative">
                  <img
                    src={selectedCRP.image}
                    alt={selectedCRP.name}
                    className="w-32 h-32 rounded-3xl object-cover border-4 border-white shadow-xl bg-white"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-emerald-500 border-4 border-white w-8 h-8 rounded-full" />
                </div>
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-white drop-shadow-sm">
                    {selectedCRP.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <StatusBadge status={selectedCRP.status} />
                    <span className="text-slate-300 text-sm font-medium flex items-center gap-1">
                      <MapPin size={14} /> {selectedCRP.district}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Content Body */}
            <div className="pt-20 px-8 pb-8 space-y-8">

              {/* Navigation Tabs (Visual only for now) */}
              <div className="flex gap-8 border-b border-slate-100">
                <button className="pb-3 border-b-2 border-blue-600 text-sm font-bold text-slate-900">Overview</button>
                <button className="pb-3 text-sm font-medium text-slate-400 hover:text-slate-600">Activity Log</button>
                <button className="pb-3 text-sm font-medium text-slate-400 hover:text-slate-600">Assigned Villages</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Info Column */}
                <div className="md:col-span-2 grid grid-cols-2 gap-4">
                  {[
                    { label: "Phone", value: selectedCRP.mobile, icon: "📞" },
                    { label: "Email", value: selectedCRP.email, icon: "✉️" },
                    { label: "Taluka", value: selectedCRP.taluka, icon: "🏛️" },
                    { label: "Block", value: selectedCRP.block, icon: "🏢" },
                    { label: "Aadhaar", value: selectedCRP.aadhaar, icon: "🪪" },
                    { label: "Vertical", value: selectedCRP.vertical, icon: "🎯" },
                  ].map((item) => (
                    <div key={item.label} className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100 hover:border-slate-200 transition-colors">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                        {item.label}
                      </p>
                      <p className="text-slate-800 font-semibold truncate">{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* Side Summary Stats */}
                <div className="space-y-4">
                  <div className="p-5 rounded-3xl bg-blue-50/50 border border-blue-100">
                    <p className="text-xs font-bold text-blue-600 uppercase mb-3">Coverage</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-blue-700">{selectedCRP.villages}</span>
                      <span className="text-blue-600/70 font-semibold text-sm">Villages</span>
                    </div>
                    <div className="mt-4 h-2 bg-blue-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 w-2/3 rounded-full" />
                    </div>
                  </div>

                  <div className="p-5 rounded-3xl bg-slate-900 text-white">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Last Activity</p>
                    <p className="text-sm font-medium mb-1">{selectedCRP.lastActivity}</p>
                    <p className="text-xs text-slate-500">{selectedCRP.time}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Footer Actions */}
            <div className="px-8 py-5 bg-slate-50/80 border-t flex justify-end items-center">

              <div className="flex gap-3">
                <button
                  onClick={closeModal}
                  className="px-6 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-white transition-all shadow-sm"
                >
                  Close
                </button>

              </div>
            </div>
          </motion.div>
        </div>
      )}

      {isOtpModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6"
          >
            {/* Header */}
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              Verify Aadhaar OTP
            </h2>

            {/* Info Box */}
            <div className="bg-emerald-50 text-emerald-700 text-sm p-3 rounded-lg mb-4">
              UIDAI has sent a temporary OTP to your registered mobile number
              (valid for 10 mins).
            </div>

            {/* OTP Input */}
            <p className="text-sm text-slate-600 mb-1">
              Please enter OTP to complete verification
            </p>

            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value.replace(/\D/g, ""));
                setOtpError("");
              }}
              placeholder="Enter 6-digit OTP"
              className="w-full px-4 py-2.5 rounded-xl border border-emerald-500 outline-none text-lg tracking-widest text-center"
            />

            {otpError && (
              <p className="text-xs text-red-500 mt-1">{otpError}</p>
            )}

            {/* Submit */}
            <button
              className="w-full mt-4 bg-emerald-600 text-white py-2.5 rounded-xl font-semibold hover:bg-emerald-700 transition"
              onClick={() => {
                if (otp === "123456") {
                  setAadhaarVerified(true);
                  setIsOtpModalOpen(false);
                  setOtp("");
                } else {
                  setOtpError("Invalid OTP. Please try again.");
                }
              }}
            >
              Submit
            </button>

            {/* Resend */}
            <p className="text-center text-sm text-slate-500 mt-3">
              Didn’t get the OTP?{" "}
              <button className="text-blue-600 font-semibold hover:underline">
                Resend OTP
              </button>
            </p>
          </motion.div>
        </div>
      )}

    </ProtectedRoute>
  );
}
