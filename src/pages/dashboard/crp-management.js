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
  UserPlus, Upload, Activity, FileText, Shield, ShieldCheck, Zap
} from "lucide-react";
import { useState, useEffect } from "react";
// Update your framer-motion import to include AnimatePresence
import { AnimatePresence } from 'framer-motion';
import ProtectedRoute from "../../components/ProtectedRoute";
import DashboardLayout from "../../components/DashboardLayout";
import { exportToExcel } from "../../lib/exportToExcel";



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
  const goaVillages = [
    "Panjim",
    "Mapusa",
    "Margao",
    "Vasco da Gama",
    "Ponda",
    "Calangute",
    "Candolim",
    "Benaulim",
    "Colva",
    "Curchorem",
    "Quepem",
    "Sanquelim",
    "Pernem",
    "Canacona",
    "Assagao",
    "Siolim",
    "Anjuna",
    "Aldona",
    "Saligao",
    "Verna"
  ];
  const [crpList, setCrpList] = useState([]);
  const [isLoadingCRPs, setIsLoadingCRPs] = useState(true);

  const fetchCRPs = async () => {
    setIsLoadingCRPs(true);
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch("/api/crp-employee", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const result = await res.json();
      const arr = Array.isArray(result.data) ? result.data : Array.isArray(result) ? result : [];



      setCrpList(arr.map((c, i) => {
        // Exact field names from API response
        const name = c.fullname           // API returns lowercase "fullname"
          || c.fullName
          || c.name
          || c.full_name
          || c.employeeName
          || c.employee_name
          || c.userName
          || [c.firstName || c.first_name || "", c.lastName || c.last_name || ""].filter(Boolean).join(" ")
          || "";

        // Status: API returns 0 = Inactive, 1 = Active (numeric)
        const rawStatus = c.status;
        const status = rawStatus === 1 || rawStatus === "1" || rawStatus === "Active"
          ? "Active"
          : rawStatus === 0 || rawStatus === "0" || rawStatus === "Inactive"
          ? "Inactive"
          : typeof rawStatus === "string" ? rawStatus : "Active";

        // Signature status: API returns 0/1 numeric
        const sigRaw = c.signature_status ?? c.signatureStatus;
        const signatureStatus = sigRaw === 1 || sigRaw === "1" ? "Approved" : sigRaw === 0 || sigRaw === "0" ? "Pending" : sigRaw || "Approved";

        return {
          id: c.crp_id || c.id || c._id || c.crpId || (i + 1),   // Show CRP0014 style ID
          numericId: c.id || i + 1,
          name,
          aadhaar: c.aadhaar || c.aadhaar_number || c.aadhaarNumber || "",
          mobile: c.mobile || c.phone || c.mobile_number || c.mobileNumber || "",
          email: c.email || c.email_address || c.emailAddress || "",
          gender: c.gender || "",
          dob: c.date_of_birth || c.dob || "",
          status,
          signatureStatus,
          rolename: c.rolename || c.role_name || "Community Resource Person",
          district: c.district || c.districtName || c.district_name || "",
          taluka: c.taluka || c.talukaName || c.taluka_name || "",
          block: c.block || "",
          villages: c.villages || 0,
          vertical: c.vertical || "",
          lastActivity: c.lastActivity || c.last_activity || "",
          time: c.time || c.created_at || c.createdAt || "",
          image: c.profile || c.image || c.profile_photo || c.profilePhoto || `https://i.pravatar.cc/150?img=${i + 1}`,
        };
      }));
    } catch (err) {
      console.error("[CRP] ❌ Failed to fetch CRP list:", err);
    } finally {
      setIsLoadingCRPs(false);
    }
  };

  const [selectedCRP, setSelectedCRP] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [open, setOpen] = useState(false);
  const [searchvill, setSearchvill] = useState("");
  const [village, setVillage] = useState("");

  const filteredVillages = goaVillages.filter(v =>
    v.toLowerCase().includes(searchvill.toLowerCase())
  );

  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [aadhaarVerified, setAadhaarVerified] = useState(false);
  const [otpError, setOtpError] = useState("");


  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [formStep, setFormStep] = useState(1);


  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);


  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [bulkFile, setBulkFile] = useState(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Statuses");
  const [district, setDistrict] = useState("All Districts");
  const [taluka, setTaluka] = useState("All Talukas");
  const [vertical, setVertical] = useState("All Verticals");

  // Filter CRPs
  const filteredCRPs = crpList.filter((crp) => {
    const matchSearch =
      crp.name.toLowerCase().includes(search.toLowerCase()) ||
      (crp.aadhaar || "").includes(search) ||
      (crp.mobile || "").includes(search);

    const matchStatus = status === "All Statuses" || crp.status === status;
    const matchDistrict = district === "All Districts" || crp.district === district;
    const matchTaluka = taluka === "All Talukas" || crp.taluka === taluka;
    const matchVertical = vertical === "All Verticals" || crp.vertical === vertical;

    return matchSearch && matchStatus && matchDistrict && matchTaluka && matchVertical;
  });

  // Stats — derived from filteredCRPs
  const totalCRPs = filteredCRPs.length;
  const activeCRPs = filteredCRPs.filter((c) => c.status === "Active").length;
  const inactiveCRPs = filteredCRPs.filter((c) => c.status === "Inactive").length;
  const villagesCovered = filteredCRPs.reduce((sum, c) => sum + (Number(c.villages) || 0), 0);

  const [documents, setDocuments] = useState({
    profilePhoto: null,
    aadhaarCard: null,
    panCard: null,
    educationalCertificates: null,
    passBook: null
  });
  const [documentPreviews, setDocumentPreviews] = useState({
    profilePhoto: null,
    aadhaarCard: null,
    panCard: null,
    educationalCertificates: null,
    passBook: null
  });
  const [docErrors, setDocErrors] = useState({
    profilePhoto: '',
    aadhaarCard: '',
    panCard: '',
    educationalCertificates: '',
    passBook: ''
  });

  const handleDocumentChange = (docType) => (e) => {
    const file = e.target.files[0];

    if (file) {
      // Check file size (5MB = 5 * 1024 * 1024 bytes)
      if (file.size > 5 * 1024 * 1024) {
        setDocErrors(prev => ({ ...prev, [docType]: 'File size must be less than 5MB' }));
        setDocuments(prev => ({ ...prev, [docType]: null }));
        if (documentPreviews[docType]) URL.revokeObjectURL(documentPreviews[docType]);
        setDocumentPreviews(prev => ({ ...prev, [docType]: null }));
        // Reset input value so same file can be selected again
        e.target.value = '';
        return;
      }

      // Check file type via extension or MIME type
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      const isValidExtension = /\.(jpe?g|png|pdf)$/i.test(file.name);

      if (!allowedTypes.includes(file.type) && !isValidExtension) {
        setDocErrors(prev => ({ ...prev, [docType]: 'Please upload a valid document (JPG, PNG, or PDF)' }));
        setDocuments(prev => ({ ...prev, [docType]: null }));
        if (documentPreviews[docType]) URL.revokeObjectURL(documentPreviews[docType]);
        setDocumentPreviews(prev => ({ ...prev, [docType]: null }));
        e.target.value = '';
        return;
      }

      if (documentPreviews[docType]) {
        URL.revokeObjectURL(documentPreviews[docType]);
      }
      const previewUrl = URL.createObjectURL(file);

      setDocErrors(prev => ({ ...prev, [docType]: '' }));
      setDocuments(prev => ({ ...prev, [docType]: file }));
      setDocumentPreviews(prev => ({ ...prev, [docType]: previewUrl }));

      // We do not reset e.target.value here because maintaining it is fine, 
      // but if you want users to be able to upload the same file twice in a row:
      // e.target.value = ''; 
    }
  };
  const summaryCards = [
    { label: "Total CRPs", value: totalCRPs, icon: Users, accent: "bg-blue-50 text-blue-600 border-blue-200" },
    { label: "Active CRPs", value: activeCRPs, icon: Users, accent: "bg-emerald-50 text-emerald-600 border-emerald-200" },
    { label: "Inactive CRPs", value: inactiveCRPs, icon: Users, accent: "bg-rose-50 text-rose-600 border-rose-200" },
    { label: "Villages Covered", value: villagesCovered, icon: MapPin, accent: "bg-purple-50 text-purple-600 border-purple-200" },
  ];
  const exportToCSV = () => {
    if (!filteredCRPs.length) return;
    exportToExcel({
      title: "Goa CRP Management — Records Report",
      headers: ["Name", "Aadhaar", "Mobile", "Email", "District", "Taluka", "Block", "Villages", "Status", "Last Activity", "Timestamp"],
      rows: filteredCRPs.map(crp => [
        crp.name, crp.aadhaar, crp.mobile, crp.email,
        crp.district, crp.taluka, crp.block, crp.villages,
        crp.status, crp.lastActivity, crp.time,
      ]),
      filename: "goa_crp_records_report",
    });
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
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsRegisterOpen(false);

      setForm({
        name: "",
        aadhaar: "",
        mobile: "",
        email: "",
        dob: "",
        gender: "",
        district: "",
        taluka: "",
        block: "",
        villages: [],
        vertical: "",
        bankName: "",
        bankAccount: "",
        ifsc: "",
        pan: "",
      });
      setVillage("");
      setAadhaarVerified(false);
      setDocuments({
        profilePhoto: null,
        aadhaarCard: null,
        panCard: null,
        educationalCertificates: null,
        passBook: null
      });
      Object.values(documentPreviews).forEach(url => { if (url) URL.revokeObjectURL(url); });
      setDocumentPreviews({
        profilePhoto: null,
        aadhaarCard: null,
        panCard: null,
        educationalCertificates: null,
        passBook: null
      });

      setConfirmChecked(false);
      setSubmitted(false);
      setFormStep(1);
    }, 1500);
  };

  const handleNextStep = () => {
    setSubmitted(true);
    if (!form.name || !form.aadhaar || !form.mobile || !form.dob || !form.gender) {
      alert("Please fill all required fields");
      return;
    }
    if (!aadhaarVerified) {
      alert("Please verify Aadhaar to continue");
      return;
    }
    setFormStep(2);
  };






  const [form, setForm] = useState({
    // Personal
    name: "",
    aadhaar: "",
    mobile: "",
    email: "",
    dob: "",
    gender: "",

    // Administrative Assignment
    district: "",
    taluka: "",
    block: "",
    villages: [],

    // Vertical Assignment
    vertical: "",

    // Financial
    bankName: "",
    bankAccount: "",
    ifsc: "",
    pan: "",

    // Document
    photo: null,
  });


  const [submitted, setSubmitted] = useState(false);

  // Fetch CRPs on mount
  useEffect(() => {
    fetchCRPs();
  }, []);

  // Disable background scroll when any modal is open
  useEffect(() => {
    if (isModalOpen || isRegisterOpen || isBulkImportOpen || isOtpModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen, isRegisterOpen, isBulkImportOpen, isOtpModalOpen]);

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
              <div className="flex flex-col md:flex-row items-end gap-5">

                {/* Search Input - Spanned for importance */}
                <div className="flex-1 w-full md:w-auto">
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

                {/* Status Filter */}
                <div className="w-full md:w-48 relative">
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 ml-1">Status</label>
                  <div className="relative">
                    <select
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none appearance-none bg-slate-50/30 focus:bg-white cursor-pointer transition-all"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      {["All Statuses", "Active", "Inactive", "On Leave"].map(opt => <option key={opt}>{opt}</option>)}
                    </select>
                    {/* Custom Arrow Icon */}
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                      <ChevronDown size={14} />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
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
                    className="w-full sm:w-auto px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
                  >
                    <UploadCloud size={16} />
                    Export CSV
                  </button>
                </div>

              </div>
            </div>
          </div>

          {/* ---------- TABLE ---------- */}
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-slate-50/60">
                  <tr>
                    {[
                      "ID",
                      "Name",
                      "Email",
                      "Mobile",
                      "Gender",
                      "Role Name",
                      "Status",
                      "Signature Status",
                      "Action",
                    ].map((h) => (
                      <th
                        key={h}
                        className={`px-4 py-3 text-xs font-bold text-slate-500 uppercase ${h === "Action" ? "text-right" : "text-left"}`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {isLoadingCRPs ? (
                    // Loading skeleton
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        {Array.from({ length: 9 }).map((_, j) => (
                          <td key={j} className="px-4 py-4">
                            <div className="h-4 bg-slate-100 rounded-lg" style={{ width: j === 1 ? '120px' : j === 2 ? '160px' : '80px' }} />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : filteredCRPs.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-4 py-16 text-center">
                        <div className="flex flex-col items-center gap-3 text-slate-400">
                          <Users size={36} className="opacity-30" />
                          <p className="text-sm font-semibold">No CRP records found</p>
                          <p className="text-xs">Try adjusting your search or filters</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredCRPs.map((crp, idx) => (
                      <motion.tr
                        key={crp.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="hover:bg-slate-50/70"
                      >
                        {/* ID */}
                        <td className="px-4 py-3 text-sm font-bold text-slate-500">{crp.id}</td>

                        {/* Name */}
                        <td className="px-4 py-3">
                          <p className="font-semibold text-slate-900 text-sm">{crp.name}</p>
                        </td>

                        {/* Email */}
                        <td className="px-4 py-3 text-sm text-slate-600">{crp.email}</td>

                        {/* Mobile */}
                        <td className="px-4 py-3 text-sm text-slate-700 font-medium">{crp.mobile}</td>

                        {/* Gender */}
                        <td className="px-4 py-3 text-sm text-slate-600 capitalize">
                          {crp.gender || "—"}
                        </td>

                        {/* Role Name */}
                        <td className="px-4 py-3 text-sm text-slate-600">Community Resource Person</td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          <StatusBadge status={crp.status} />
                        </td>

                        {/* Signature Status */}
                        <td className="px-4 py-3">
                          <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${(crp.signatureStatus || "Approved") === "Pending" ? "bg-yellow-50 text-yellow-700 border-yellow-200" : (crp.signatureStatus === "Rejected" ? "bg-red-50 text-red-700 border-red-200" : "bg-emerald-50 text-emerald-700 border-emerald-100")}`}>
                            {crp.signatureStatus || "Approved"}
                          </span>
                        </td>

                        {/* Action */}
                        <td className="px-4 py-3 text-right">
                          <div className="inline-flex gap-2 items-center">
                            <button
                              onClick={() => openModal(crp)}
                              className="p-1.5 rounded-lg border border-blue-100 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
                            >
                              <Eye size={14} />
                            </button>
                            <button className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-200 transition-colors">
                              <Edit size={14} />
                            </button>
                            <button className="p-1.5 rounded-lg border border-red-100 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors">
                              <X size={14} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>





        </div>
      </DashboardLayout>
      <AnimatePresence>
        {isRegisterOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
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

                {/* Step Indicator */}
                <div className="flex items-center gap-3 mb-2">
                  <div className={`flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-full border ${formStep === 1 ? 'bg-slate-900 text-white border-slate-900' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                    <span className="w-5 h-5 flex items-center justify-center rounded-full bg-white/20">{formStep === 1 ? '1' : '✓'}</span> Fill Details
                  </div>
                  <div className="flex-1 h-px bg-slate-200" />
                  <div className={`flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-full border ${formStep === 2 ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                    <span className="w-5 h-5 flex items-center justify-center rounded-full bg-white/20">2</span> Review & Confirm
                  </div>
                </div>

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

                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Date of Birth *</p>
                      <input
                        type="date"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-500 transition-all outline-none text-sm text-slate-600"
                        value={form.dob}
                        onChange={(e) => setForm({ ...form, dob: e.target.value })}
                      />
                    </div>

                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Gender *</p>
                      <select
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-500 transition-all outline-none text-sm text-slate-600"
                        value={form.gender}
                        onChange={(e) => setForm({ ...form, gender: e.target.value })}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                  </div>
                </div>


                {/* Section: Financial Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <h3 className="text-sm font-bold text-slate-900">Financial Information</h3>
                    <p className="text-xs text-slate-500 mt-1">Banking and payment details.</p>
                  </div>

                  <div className="md:col-span-2 grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Bank Name</p>
                      <input
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none"
                        placeholder="Bank Name"
                        value={form.bankName}
                        onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                      />
                    </div>

                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Account Number</p>
                      <input
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none"
                        placeholder="Account Number"
                        value={form.bankAccount}
                        onChange={(e) => setForm({ ...form, bankAccount: e.target.value })}
                      />
                    </div>

                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">IFSC Code</p>
                      <input
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none"
                        placeholder="IFSC Code"
                        value={form.ifsc}
                        onChange={(e) => setForm({ ...form, ifsc: e.target.value })}
                      />
                    </div>

                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Pass Book</p>
                      <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-center gap-3">
                        <div className="bg-white rounded-lg shadow-sm w-12 h-12 flex justify-center items-center shrink-0 overflow-hidden border border-slate-100 text-blue-600">
                          {documentPreviews['passBook'] ? (
                            documents['passBook']?.type === 'application/pdf' || documents['passBook']?.name.toLowerCase().endsWith('.pdf') ? (
                              <FileText size={20} className="text-blue-600" />
                            ) : (
                              <img src={documentPreviews['passBook']} alt="preview" className="w-full h-full object-cover" />
                            )
                          ) : (
                            <Upload size={20} className="text-blue-600" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest truncate">
                            Pass Book
                          </p>
                          <p className="text-xs text-slate-500 truncate pr-2">
                            {documents['passBook'] ? documents['passBook'].name : 'Bank details (Max 5MB)'}
                          </p>
                          {docErrors['passBook'] && <p className="text-xs text-red-500 mt-1">{docErrors['passBook']}</p>}
                        </div>

                        <input
                          type="file"
                          id="doc-upload-passBook"
                          className="hidden"
                          onChange={handleDocumentChange('passBook')}
                          accept=".jpeg,.jpg,.png,.pdf,image/jpeg,image/png,application/pdf"
                        />
                        <label
                          htmlFor="doc-upload-passBook"
                          className="shrink-0 px-3 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
                        >
                          BROWSE
                        </label>
                      </div>
                    </div>

                    <div className="col-span-2 space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Pan Card Number</p>
                      <input
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none"
                        placeholder="Pan Card Number"
                        value={form.pan}
                        onChange={(e) => setForm({ ...form, pan: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <hr className="border-slate-100" />
                {/* Section: Document Upload */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <h3 className="text-sm font-bold text-slate-900">Document Upload</h3>
                    <p className="text-xs text-slate-500 mt-1">Verification documents.</p>
                  </div>

                  <div className="md:col-span-2 space-y-4">
                    {[
                      { id: 'profilePhoto', label: 'Profile Photo', desc: 'Passport size photo (Max 5MB)' },
                      { id: 'aadhaarCard', label: 'Aadhaar Card', desc: 'Front and back side (Max 5MB)' },
                      { id: 'panCard', label: 'PAN Card', desc: 'Clear copy (Max 5MB)' },
                      { id: 'educationalCertificates', label: 'Educational Certificates', desc: 'Highest qualification (Max 5MB)' }
                    ].map((doc) => (
                      <div key={doc.id} className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-center gap-3">
                        <div className="bg-white rounded-lg shadow-sm w-12 h-12 flex justify-center items-center shrink-0 overflow-hidden border border-slate-100 text-blue-600">
                          {documentPreviews[doc.id] ? (
                            documents[doc.id]?.type === 'application/pdf' || documents[doc.id]?.name.toLowerCase().endsWith('.pdf') ? (
                              <FileText size={20} className="text-blue-600" />
                            ) : (
                              <img src={documentPreviews[doc.id]} alt="preview" className="w-full h-full object-cover" />
                            )
                          ) : (
                            <Upload size={20} className="text-blue-600" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest truncate">
                            {doc.label}
                          </p>
                          <p className="text-xs text-slate-500 truncate pr-2">
                            {documents[doc.id] ? documents[doc.id].name : doc.desc}
                          </p>
                          {docErrors[doc.id] && <p className="text-xs text-red-500 mt-1">{docErrors[doc.id]}</p>}
                        </div>

                        <input
                          type="file"
                          id={`doc-upload-${doc.id}`}
                          className="hidden"
                          onChange={handleDocumentChange(doc.id)}
                          accept=".jpeg,.jpg,.png,.pdf,image/jpeg,image/png,application/pdf"
                        />
                        <label
                          htmlFor={`doc-upload-${doc.id}`}
                          className="px-3 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
                        >
                          BROWSE
                        </label>
                      </div>
                    ))}
                  </div>
                </div>



                {/* ===== STEP 2: PREVIEW ===== */}
                {formStep === 2 && (
                  <div className="space-y-6">

                    {/* Personal Info Preview */}
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Personal Information</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {[
                          { label: 'Full Name', value: form.name },
                          { label: 'Aadhaar', value: form.aadhaar, extra: aadhaarVerified ? <span className="text-emerald-600 text-[10px] font-bold ml-1">✓ Verified</span> : null },
                          { label: 'Mobile', value: form.mobile },
                          { label: 'Email', value: form.email || '—' },
                          { label: 'Date of Birth', value: form.dob },
                          { label: 'Gender', value: form.gender },
                        ].map(item => (
                          <div key={item.label} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">{item.label}</p>
                            <p className="text-sm font-bold text-slate-800 truncate">{item.value}{item.extra}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Financial Info Preview */}
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Financial Information</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {[
                          { label: 'Bank Name', value: form.bankName || '—' },
                          { label: 'Account Number', value: form.bankAccount || '—' },
                          { label: 'IFSC Code', value: form.ifsc || '—' },
                          { label: 'PAN Card', value: form.pan || '—' },
                        ].map(item => (
                          <div key={item.label} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">{item.label}</p>
                            <p className="text-sm font-bold text-slate-800 truncate">{item.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Document Uploads Preview */}
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Uploaded Documents</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {[
                          { id: 'profilePhoto', label: 'Profile Photo' },
                          { id: 'aadhaarCard', label: 'Aadhaar Card' },
                          { id: 'panCard', label: 'PAN Card' },
                          { id: 'educationalCertificates', label: 'Edu. Certificates' },
                          { id: 'passBook', label: 'Pass Book' },
                        ].map(doc => (
                          <div key={doc.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50 flex flex-col items-center gap-2 text-center">
                            <div className="w-14 h-14 rounded-xl overflow-hidden bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                              {documentPreviews[doc.id] ? (
                                documents[doc.id]?.type === 'application/pdf' || documents[doc.id]?.name?.toLowerCase().endsWith('.pdf') ? (
                                  <FileText size={24} className="text-blue-500" />
                                ) : (
                                  <img src={documentPreviews[doc.id]} alt={doc.label} className="w-full h-full object-cover" />
                                )
                              ) : (
                                <Upload size={20} className="text-slate-300" />
                              )}
                            </div>
                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">{doc.label}</p>
                            <p className="text-[10px] text-slate-400 truncate w-full">
                              {documents[doc.id] ? <span className="text-emerald-600 font-semibold">✓ Uploaded</span> : <span className="text-slate-300">Not uploaded</span>}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Confirmation Checkbox */}
                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={confirmChecked}
                          onChange={(e) => setConfirmChecked(e.target.checked)}
                          className="mt-1 w-4 h-4 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                        />
                        <span className="text-xs text-amber-800 leading-relaxed font-medium">
                          I confirm that all the information provided above is accurate and complete. I understand that any discrepancies may lead to the rejection of this registration.
                        </span>
                      </label>
                    </div>

                  </div>
                )}


              </div>

              {/* 3. Footer Actions */}
              <div className="px-8 py-5 bg-slate-50/80 border-t flex justify-end items-center gap-3">
                <button
                  onClick={() => {
                    if (formStep === 2) {
                      setFormStep(1);
                      setConfirmChecked(false);
                    } else {
                      setIsRegisterOpen(false);
                    }
                  }}
                  className="px-6 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-white transition-all shadow-sm"
                >
                  {formStep === 2 ? '← Back' : 'Cancel'}
                </button>
                {formStep === 1 ? (
                  <button
                    onClick={handleNextStep}
                    className="px-8 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-slate-200 bg-slate-900 text-white hover:bg-slate-800 active:scale-95"
                  >
                    Next: Preview →
                  </button>
                ) : (
                  <button
                    disabled={!confirmChecked || isSubmitting}
                    onClick={handleSubmit}
                    className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-slate-200 flex items-center gap-2 ${confirmChecked && !isSubmitting ? 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95' : 'bg-slate-300 text-white cursor-not-allowed'
                      }`}
                  >
                    {isSubmitting ? 'Processing...' : '✓ Confirm & Register CRP'}
                  </button>
                )}
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

            {/* 2. Content Body (Scrollable) */}
            <div className="pt-20 px-8 pb-8 space-y-8 max-h-[65vh] overflow-y-auto custom-scrollbar">

              {/* Navigation Tabs (Visual only for now) */}
              <div className="flex gap-6 border-b border-slate-100 sticky top-0 bg-white z-10">
                <button className="pb-3 border-b-2 border-slate-900 text-sm font-bold text-slate-900">Overview</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Info Column */}
                <div className="md:col-span-2 grid grid-cols-2 gap-4">
                  {[
                    { label: "Phone", value: selectedCRP.mobile, icon: <Activity size={14} /> },
                    { label: "Email", value: selectedCRP.email, icon: <FileText size={14} /> },
                    { label: "Taluka", value: selectedCRP.taluka, icon: <MapPin size={14} /> },
                    { label: "Block", value: selectedCRP.block, icon: <Shield size={14} /> },
                    { label: "Aadhaar", value: selectedCRP.aadhaar, icon: <ShieldCheck size={14} /> },
                    { label: "Vertical", value: selectedCRP.vertical, icon: <Zap size={14} /> },
                  ].map((item) => (
                    <div key={item.label} className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100 hover:bg-white hover:shadow-sm transition-all">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                        {item.icon} {item.label}
                      </p>
                      <p className="text-sm text-slate-800 font-bold truncate">{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* Side Summary Stats */}
                <div className="space-y-4">
                  <div className="p-5 rounded-3xl bg-blue-50/50 border border-blue-100">
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-3">Coverage</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-blue-700">{selectedCRP.villages}</span>
                      <span className="text-blue-600/70 font-semibold text-sm">Villages</span>
                    </div>
                    <div className="mt-4 h-1.5 bg-blue-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 w-2/3 rounded-full" />
                    </div>
                  </div>

                  <div className="p-5 rounded-3xl bg-slate-900 text-white shadow-lg shadow-slate-200">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Last Activity</p>
                    <p className="text-sm font-bold mb-1">{selectedCRP.lastActivity}</p>
                    <p className="text-[11px] text-slate-400 font-medium">{selectedCRP.time}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Footer Actions */}
            <div className="px-8 py-5 bg-slate-50/80 border-t flex justify-end items-center">
              <div className="flex gap-3">
                <button
                  onClick={closeModal}
                  className="px-6 py-2.5 cursor-pointer rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-white transition-all"
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