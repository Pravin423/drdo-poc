"use client";

import { motion } from "framer-motion";
import {
  Users, MapPin, X, Download, Eye, Edit, MoreHorizontal, Search, RefreshCw,
  UploadCloud, ChevronDown, UserPlus, Upload, Activity, FileText, Shield, ShieldCheck, Zap
} from "lucide-react";
import { useState, useEffect } from "react";

import { AnimatePresence } from 'framer-motion';
import ProtectedRoute from "../../components/ProtectedRoute";
import DashboardLayout from "../../components/DashboardLayout";
import { exportToExcel } from "../../lib/exportToExcel";
import { useRouter } from "next/router";




const StatusBadge = ({ status }) => {
  const styles = {
    Active: "bg-emerald-50 text-emerald-700 border-emerald-100",
    Inactive: "bg-amber-50 text-amber-500 border-amber-100",
    "On Leave": "bg-amber-50 text-amber-700 border-amber-100",
    Blacklisted: "bg-red-50 text-red-700 border-red-100",
    Deleted: "bg-rose-50 text-rose-700 border-rose-100",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-[11px] font-bold border ${styles[status] || "bg-slate-100 text-slate-600 border-slate-200"}`}
    >
      {status}
    </span>
  );
};

const StatusToggle = ({ id, currentStatus, onStatusChange, fetchList }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const statusToCode = {
    Active: 0,
    Inactive: 1,
    Deleted: 2,
  };

  const codeToStatus = {
    0: "Active",
    1: "Inactive",
    2: "Deleted",
  };

  const handleToggle = async (newCode) => {
    if (isUpdating || statusToCode[currentStatus] === newCode) return;

    setIsUpdating(true);
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch("/api/update-user-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, status: newCode }),
      });

      const result = await res.json();
      if (result.status === true || result.success || result.status === 1) {
        onStatusChange(codeToStatus[newCode]);
        if (fetchList) fetchList();
      } else {
        alert(result.message || "Failed to update status");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const currentCode = statusToCode[currentStatus] ?? 0;

  return (
    <div className="flex items-center gap-1.5 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200 w-fit h-fit relative shadow-inner">
      <AnimatePresence mode="wait">
        {isUpdating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex items-center justify-center bg-white/40 rounded-2xl backdrop-blur-[1px]"
          >
            <RefreshCw size={14} className="animate-spin text-slate-800" />
          </motion.div>
        )}
      </AnimatePresence>

      {[
        { code: 0, label: "Active", color: "bg-emerald-500", shadow: "shadow-emerald-200" },
        { code: 1, label: "Inactive", color: "bg-amber-500", shadow: "shadow-amber-200" },
        { code: 2, label: "Deleted", color: "bg-rose-500", shadow: "shadow-rose-200" },
      ].map((stage) => {
        const isActive = currentCode === stage.code;
        return (
          <motion.button
            key={stage.code}
            onClick={() => handleToggle(stage.code)}
            disabled={isUpdating}
            whileHover={!isActive && !isUpdating ? { scale: 1.02, backgroundColor: "rgba(255,255,255,0.8)" } : {}}
            whileTap={!isUpdating ? { scale: 0.95 } : {}}
            className={`relative px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center min-w-[80px] ${isActive ? "text-white" : "text-slate-400 hover:text-slate-600"
              }`}
          >
            {isActive && (
              <motion.div
                initial={false}
                animate={{
                  opacity: isActive ? 1 : 0,
                  scale: isActive ? 1 : 0.9,
                }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className={`absolute inset-0 ${stage.color} rounded-xl shadow-sm`}
              />
            )}
            <span className="relative z-10">{stage.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
};


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

        const name = c.fullname
          || c.fullName
          || c.name
          || c.full_name
          || c.employeeName
          || c.employee_name
          || c.userName
          || [c.firstName || c.first_name || "", c.lastName || c.last_name || ""].filter(Boolean).join(" ")
          || "";


        const rawStatus = c.status;
        let status = "Active";
        if (rawStatus === 0 || rawStatus === "0" || rawStatus === "Active") {
          status = "Active";
        } else if (rawStatus === 1 || rawStatus === "1" || rawStatus === "Inactive" || rawStatus === "Deactive") {
          status = "Inactive";
        } else if (rawStatus === 2 || rawStatus === "2" || rawStatus === "Deleted") {
          status = "Deleted";
        } else if (typeof rawStatus === "string") {
          status = rawStatus;
        }


        const sigRaw = c.signature_status ?? c.signatureStatus;
        const signatureStatus = sigRaw === 1 || sigRaw === "1" ? "Approved" : sigRaw === 0 || sigRaw === "0" ? "Pending" : sigRaw || "Approved";

        return {
          id: c.crp_id || c.id || c._id || c.crpId || (i + 1),
          numericId: c.id || i + 1,
          name,
          aadhaar: c.aadhaar || c.aadhaar_number || c.aadhar_number || c.aadhaarNumber || "",
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

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewCRPData, setViewCRPData] = useState(null);
  const [isViewLoading, setIsViewLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const handleViewClick = async (crp) => {
    setViewModalOpen(true);
    setIsViewLoading(true);
    setViewCRPData(null);
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`/api/crp-details?id=${crp.numericId || crp.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      let d = result.data || result;
      if (Array.isArray(d)) {
        d = d[0] || {};
      }
      setViewCRPData({
        id: d.crp_id || d.id || crp.id,
        numericId: d.id || crp.numericId || crp.id,
        name: d.fullname || d.fullName || crp.name,
        aadhaar: d.aadhar_number || d.aadhaar_number || d.aadhaar || crp.aadhaar || "",
        mobile: d.mobile || crp.mobile,
        email: d.email || crp.email,
        gender: d.gender || crp.gender,
        dob: d.date_of_birth || d.dob || crp.dob,
        status: crp.status,
        district: d.district || crp.district,
        taluka: d.taluka || crp.taluka,
        bankName: d.bank_name || "",
        branchName: d.branch_name || "",
        accountNumber: d.account_number || "",
        ifsc: d.ifsc || d.ifsc_code || "",
        pan: d.pan_number || d.pan || "",
        image: d.profile || d.profile_img || crp.image,
        signatureStatus: crp.signatureStatus,
      });
    } catch (err) {
      setViewCRPData({ error: "Failed to load CRP details." });
    } finally {
      setIsViewLoading(false);
    }
  };

  const handleEditClick = async (crp) => {
    setIsEditMode(true);
    setEditingId(crp.numericId || crp.id);
    setIsViewLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`/api/crp-details?id=${crp.numericId || crp.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      let d = result.data || result;
      if (Array.isArray(d)) {
        d = d[0] || {};
      }

      setForm({
        name: d.fullname || d.fullName || crp.name || "",
        aadhaar: d.aadhar_number || d.aadhaar_number || d.aadhaar || crp.aadhaar || "",
        mobile: d.mobile || crp.mobile || "",
        email: d.email || crp.email || "",
        gender: d.gender || crp.gender || "",
        dob: d.date_of_birth || d.dob || crp.dob || "",
        bankName: d.bank_name || "",
        branchName: d.branch_name || "",
        bankAccount: d.account_number || "",
        ifsc: d.ifsc || d.ifsc_code || "",
        pan: d.pan_number || d.pan || "",
        district: d.district || "",
        taluka: d.taluka || "",
        block: d.block || "",
        villages: d.villages ? (Array.isArray(d.villages) ? d.villages : d.villages.split(",")) : [],
        vertical: d.vertical || "",
      });
      setIsRegisterOpen(true);
    } catch (err) {
      console.error(err);
      alert("Failed to load CRP details for editing.");
    } finally {
      setIsViewLoading(false);
    }
  };

  const [open, setOpen] = useState(false);
  const [searchvill, setSearchvill] = useState("");
  const [village, setVillage] = useState("");

  const filteredVillages = goaVillages.filter(v =>
    (v || "").toLowerCase().includes((searchvill || "").toLowerCase())
  );



  const router = useRouter();

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (router.query?.add === "true") {
      setIsRegisterOpen(true);
    }
  }, [router.query]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [formStep, setFormStep] = useState(1);


  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);


  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [bulkFile, setBulkFile] = useState(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Status");
  const [district, setDistrict] = useState("All Districts");
  const [taluka, setTaluka] = useState("All Talukas");
  const [vertical, setVertical] = useState("All Verticals");


  const filteredCRPs = crpList.filter((crp) => {
    const matchSearch =
      (crp.name || "").toLowerCase().includes((search || "").toLowerCase()) ||
      String(crp.aadhaar ?? "").includes(search) ||
      String(crp.mobile ?? "").includes(search)

    const matchStatus = status === "All Status" || crp.status === status;
    const matchDistrict = district === "All Districts" || crp.district === district;
    const matchTaluka = taluka === "All Talukas" || crp.taluka === taluka;
    const matchVertical = vertical === "All Verticals" || crp.vertical === vertical;

    return matchSearch && matchStatus && matchDistrict && matchTaluka && matchVertical;
  });


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

      if (file.size > 5 * 1024 * 1024) {
        setDocErrors(prev => ({ ...prev, [docType]: 'File size must be less than 5MB' }));
        setDocuments(prev => ({ ...prev, [docType]: null }));
        if (documentPreviews[docType]) URL.revokeObjectURL(documentPreviews[docType]);
        setDocumentPreviews(prev => ({ ...prev, [docType]: null }));

        e.target.value = '';
        return;
      }


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


    }
  };
  const summaryCards = [
    { label: "Total CRPs", value: totalCRPs, icon: Users, accent: "bg-blue-50 text-blue-600 border-blue-200" },
    { label: "Active CRPs", value: activeCRPs, icon: Users, accent: "bg-emerald-50 text-emerald-600 border-emerald-200" },
    { label: "Inactive CRPs", value: inactiveCRPs, icon: Users, accent: "bg-rose-50 text-rose-600 border-rose-200" },
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

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const fd = new FormData();
      fd.append("fullname", form.name);
      fd.append("aadharnumber", form.aadhaar);
      fd.append("mobile", form.mobile);
      fd.append("email", form.email);
      fd.append("gender", form.gender);
      fd.append("dob", form.dob);
      fd.append("pan_number", form.pan);
      fd.append("bank_name", form.bankName);
      fd.append("branch_name", form.branchName);
      fd.append("account_number", form.bankAccount);
      // use ifsc_code for update, ifsc for add — proxy handles the correct key
      if (isEditMode) {
        fd.append("ifsc_code", form.ifsc);
      } else {
        fd.append("ifsc", form.ifsc);
      }

      if (documents.profilePhoto) fd.append("profile_img", documents.profilePhoto);
      if (documents.aadhaarCard) fd.append("aadhaar_img", documents.aadhaarCard);
      if (documents.panCard) fd.append("pan_img", documents.panCard);
      if (documents.educationalCertificates) fd.append("edu_certificates", documents.educationalCertificates);
      if (documents.passBook) fd.append("passbook_img", documents.passBook);

      let url = "/api/add-crp";
      if (isEditMode && editingId) {
        url = `/api/crp-update?id=${editingId}`;
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {},   // auth is handled server-side via cookies
        body: fd,
      });

      const result = await response.json();
      if (!response.ok || result?.status === false) {
        const msg = typeof result?.message === "string"
          ? result.message
          : JSON.stringify(result?.message ?? result?.error ?? `HTTP ${response.status}`);
        throw new Error(msg);
      }


      setIsRegisterOpen(false);
      setIsEditMode(false);
      setEditingId(null);
      setFormStep(1);
      setFormErrors({});
      setForm({
        name: "", aadhaar: "", mobile: "", email: "", dob: "", gender: "",
        district: "", taluka: "", block: "", villages: [], vertical: "",
        bankName: "", branchName: "", bankAccount: "", ifsc: "", pan: ""
      });
      setVillage("");
      Object.values(documentPreviews).forEach(url => { if (url) URL.revokeObjectURL(url); });
      setDocuments({ profilePhoto: null, aadhaarCard: null, panCard: null, educationalCertificates: null, passBook: null });
      setDocumentPreviews({ profilePhoto: null, aadhaarCard: null, panCard: null, educationalCertificates: null, passBook: null });
      setConfirmChecked(false);
      setSubmitted(false);
      await fetchCRPs();
    } catch (err) {
      console.error("[CRP Update/Add] Failed:", err);
      alert(`Failed to ${isEditMode ? 'update' : 'register'} CRP:\n${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextStep = () => {
    const errors = {};

    if (!form.name.trim()) errors.name = "Full name is required.";
    if (!form.aadhaar || form.aadhaar.length !== 12) errors.aadhaar = "Enter a valid 12-digit Aadhaar number.";
    if (!form.mobile || !/^\d{10}$/.test(form.mobile)) errors.mobile = "Enter a valid 10-digit mobile number.";
    if (!form.email.trim()) errors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      errors.email = "Enter a valid email address.";
    if (!form.dob) errors.dob = "Date of birth is required.";
    if (!form.gender) errors.gender = "Please select a gender.";

    if (!form.bankName.trim()) errors.bankName = "Bank name is required.";
    if (!form.branchName.trim()) errors.branchName = "Branch name is required.";
    if (!form.bankAccount.trim()) errors.bankAccount = "Account number is required.";
    else if (!/^\d{9,18}$/.test(form.bankAccount.trim()))
      errors.bankAccount = "Account number must be 9–18 digits.";
    if (!form.ifsc.trim()) errors.ifsc = "IFSC code is required.";
    else if (!/^[A-Z]{4}[A-Z0-9]{7}$/i.test(form.ifsc.trim()))
      errors.ifsc = "IFSC must be 11 characters (e.g. PUNB0026000).";
    if (!form.pan.trim()) errors.pan = "PAN number is required.";
    else if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/i.test(form.pan.trim()))
      errors.pan = "Invalid PAN format (e.g. ABCDE1234F).";

    if (!isEditMode) {
      if (!documents.profilePhoto) errors.profilePhoto = "Profile photo is required.";
      if (!documents.aadhaarCard) errors.aadhaarCard = "Aadhaar card image is required.";
      if (!documents.panCard) errors.panCard = "PAN card image is required.";
      if (!documents.educationalCertificates) errors.educationalCertificates = "Education certificate is required.";
      if (!documents.passBook) errors.passBook = "Passbook image is required.";
    }

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setFormStep(2);
  };

  const [formErrors, setFormErrors] = useState({});
  const clearErr = (f) => setFormErrors(p => { const n = { ...p }; delete n[f]; return n; });




  const [form, setForm] = useState({

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
    branchName: "",
    bankAccount: "",
    ifsc: "",
    pan: "",


    photo: null,
  });


  const [submitted, setSubmitted] = useState(false);


  useEffect(() => {
    fetchCRPs();
  }, []);


  useEffect(() => {
    if (isModalOpen || isRegisterOpen || isBulkImportOpen || viewModalOpen || previewImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen, isRegisterOpen, isBulkImportOpen, viewModalOpen, previewImage]);

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


            <div className="p-6 space-y-6">

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


              <div className="flex justify-center">
                <button

                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold hover:bg-slate-100 transition"
                >
                  <Download size={16} />
                  Download Import Template
                </button>
              </div>


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


          <div className="grid gap-y-8 gap-x-6 md:grid-cols-2 lg:grid-cols-4 ">
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


          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Filter Records</h3>
            </div>

            <div className="p-6">

              <div className="flex flex-col md:flex-row items-end gap-5">


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


                <div className="w-full md:w-48 relative">
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 ml-1">Status</label>
                  <div className="relative">
                    <select
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none appearance-none bg-slate-50/30 focus:bg-white cursor-pointer transition-all"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      {["All Status", "Active", "Inactive", "Deleted"].map(opt => <option key={opt}>{opt}</option>)}
                    </select>

                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                      <ChevronDown size={14} />
                    </div>
                  </div>
                </div>


                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto mt-4 md:mt-0">

                  <button
                    onClick={() => {
                      setSearch("");
                      setStatus("All Status");

                    }}
                    className="w-full sm:w-auto text-slate-500 border border-slate-200 hover:text-slate-800 hover:bg-slate-50 rounded-xl px-5 py-2.5 text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <RefreshCw size={16} />
                    Clear All
                  </button>


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

                        <td className="px-4 py-3 text-sm font-bold text-slate-500">{crp.id}</td>


                        <td className="px-4 py-3">
                          <p className="font-semibold text-slate-900 text-sm">{crp.name}</p>
                        </td>


                        <td className="px-4 py-3 text-sm text-slate-600">{crp.email}</td>


                        <td className="px-4 py-3 text-sm text-slate-700 font-medium">{crp.mobile}</td>


                        <td className="px-4 py-3 text-sm text-slate-600 capitalize">
                          {crp.gender || "—"}
                        </td>


                        <td className="px-4 py-3 text-sm text-slate-600">Community Resource Person</td>


                        <td className="px-4 py-3">
                          <StatusBadge status={crp.status} />
                        </td>


                        <td className="px-4 py-3">
                          <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${(crp.signatureStatus || "Approved") === "Pending" ? "bg-yellow-50 text-yellow-700 border-yellow-200" : (crp.signatureStatus === "Rejected" ? "bg-red-50 text-red-700 border-red-200" : "bg-emerald-50 text-emerald-700 border-emerald-100")}`}>
                            {crp.signatureStatus || "Approved"}
                          </span>
                        </td>


                        <td className="px-4 py-3 text-right">
                          <div className="inline-flex gap-2 items-center">
                            <button
                              onClick={() => handleViewClick(crp)}
                              className="p-1.5 rounded-lg border border-blue-100 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              onClick={() => handleEditClick(crp)}
                              className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100 transition-colors"
                            >
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

              <div className="relative h-28 bg-gradient-to-r from-slate-800 to-slate-900 px-8 flex items-center">
                <div className="flex items-center gap-5">
                  <div className="p-3.5 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20 shadow-inner">
                    <UserPlus className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white drop-shadow-sm">
                      {isEditMode ? "Edit CRP Profile" : "Register New CRP"}
                    </h2>
                    <p className="text-slate-400 text-xs font-medium mt-0.5">
                      {isEditMode ? "Update the details of an existing Community Resource Person" : "Onboard a new Community Resource Person to the platform"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsRegisterOpen(false)}
                  className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>


              <div className="relative overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                  {formStep === 1 ? (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: -32 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -32 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="max-h-[70vh] overflow-y-auto pt-8 px-8 pb-4 space-y-8 custom-scrollbar"
                    >

                      <div className="flex items-center gap-3 mb-2">
                        <div className={`flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-full border ${formStep === 1 ? 'bg-slate-900 text-white border-slate-900' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                          <span className="w-5 h-5 flex items-center justify-center rounded-full bg-white/20">{formStep === 1 ? '1' : '✓'}</span> Fill Details
                        </div>
                        <div className="flex-1 h-px bg-slate-200" />
                        <div className={`flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-full border ${formStep === 2 ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                          <span className="w-5 h-5 flex items-center justify-center rounded-full bg-white/20">2</span> Review & Confirm
                        </div>
                      </div>


                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1">
                          <h3 className="text-sm font-bold text-slate-900">Personal Information</h3>
                          <p className="text-xs text-slate-500 mt-1">Identity and contact information for the individual.</p>
                        </div>
                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name *</p>
                            <input
                              className={`w-full px-4 py-2.5 rounded-xl border focus:bg-white transition-all outline-none text-sm ${formErrors.name ? 'bg-red-50 border-red-400' : 'bg-slate-50 border-slate-100 focus:border-blue-500'}`}
                              placeholder="Enter name"
                              value={form.name}
                              onChange={(e) => { setForm({ ...form, name: e.target.value }); clearErr('name'); }}
                            />
                            {formErrors.name && <p className="text-xs text-red-500 mt-1 ml-1">{formErrors.name}</p>}
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Aadhaar Number *</p>
                            <input
                              type="text"
                              inputMode="numeric"
                              maxLength={12}
                              placeholder="000000000000"
                              value={form.aadhaar}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, "");
                                setForm({ ...form, aadhaar: value });
                                clearErr('aadhaar');
                              }}
                              className={`w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all ${formErrors.aadhaar
                                ? "bg-red-50 border border-red-400"
                                : "bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500"
                                }`}
                            />
                            {formErrors.aadhaar && <p className="text-xs text-red-500 mt-1 ml-1">{formErrors.aadhaar}</p>}
                          </div>

                          <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Mobile Number *</p>
                            <input
                              className={`w-full px-4 py-2.5 rounded-xl border focus:bg-white transition-all outline-none text-sm ${formErrors.mobile ? 'bg-red-50 border-red-400' : 'bg-slate-50 border-slate-100 focus:border-blue-500'}`}
                              placeholder="10-digit mobile"
                              value={form.mobile}
                              onChange={(e) => { setForm({ ...form, mobile: e.target.value.replace(/\D/g, '') }); clearErr('mobile'); }}
                            />
                            {formErrors.mobile && <p className="text-xs text-red-500 mt-1 ml-1">{formErrors.mobile}</p>}
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</p>
                            <input
                              className={`w-full px-4 py-2.5 rounded-xl border focus:bg-white transition-all outline-none text-sm ${formErrors.email ? 'bg-red-50 border-red-400' : 'bg-slate-50 border-slate-100 focus:border-blue-500'}`}
                              placeholder="email@domain.com"
                              value={form.email}
                              onChange={(e) => { setForm({ ...form, email: e.target.value }); clearErr('email'); }}
                            />
                            {formErrors.email && <p className="text-xs text-red-500 mt-1 ml-1">{formErrors.email}</p>}
                          </div>

                          <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Date of Birth *</p>
                            <input
                              type="date"
                              className={`w-full px-4 py-2.5 rounded-xl border focus:bg-white transition-all outline-none text-sm text-slate-600 ${formErrors.dob ? 'bg-red-50 border-red-400' : 'bg-slate-50 border-slate-100 focus:border-blue-500'}`}
                              value={form.dob}
                              onChange={(e) => { setForm({ ...form, dob: e.target.value }); clearErr('dob'); }}
                            />
                            {formErrors.dob && <p className="text-xs text-red-500 mt-1 ml-1">{formErrors.dob}</p>}
                          </div>

                          <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Gender *</p>
                            <select
                              className={`w-full px-4 py-2.5 rounded-xl border focus:bg-white transition-all outline-none text-sm text-slate-600 ${formErrors.gender ? 'bg-red-50 border-red-400' : 'bg-slate-50 border-slate-100 focus:border-blue-500'}`}
                              value={form.gender}
                              onChange={(e) => { setForm({ ...form, gender: e.target.value }); clearErr('gender'); }}
                            >
                              <option value="">Select Gender</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                            </select>
                            {formErrors.gender && <p className="text-xs text-red-500 mt-1 ml-1">{formErrors.gender}</p>}
                          </div>
                        </div>
                      </div>



                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1">
                          <h3 className="text-sm font-bold text-slate-900">Financial Information</h3>
                          <p className="text-xs text-slate-500 mt-1">Banking and payment details.</p>
                        </div>

                        <div className="md:col-span-2 grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Bank Name <span className="text-red-400">*</span></p>
                            <input
                              className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:bg-white transition-all ${formErrors.bankName ? 'bg-red-50 border-red-400' : 'bg-slate-50 border-slate-100 focus:border-blue-500'}`}
                              placeholder="e.g. Punjab National Bank"
                              value={form.bankName}
                              onChange={(e) => { setForm({ ...form, bankName: e.target.value }); clearErr('bankName'); }}
                            />
                            {formErrors.bankName && <p className="text-xs text-red-500 mt-1 ml-1">{formErrors.bankName}</p>}
                          </div>

                          <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Branch Name <span className="text-red-400">*</span></p>
                            <input
                              className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:bg-white transition-all ${formErrors.branchName ? 'bg-red-50 border-red-400' : 'bg-slate-50 border-slate-100 focus:border-blue-500'}`}
                              placeholder="e.g. Panaji Main Branch"
                              value={form.branchName}
                              onChange={(e) => { setForm({ ...form, branchName: e.target.value }); clearErr('branchName'); }}
                            />
                            {formErrors.branchName && <p className="text-xs text-red-500 mt-1 ml-1">{formErrors.branchName}</p>}
                          </div>

                          <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Account Number</p>
                            <input
                              className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:bg-white transition-all ${formErrors.bankAccount ? 'bg-red-50 border-red-400' : 'bg-slate-50 border-slate-100 focus:border-blue-500'}`}
                              placeholder="Account Number"
                              value={form.bankAccount}
                              onChange={(e) => { setForm({ ...form, bankAccount: e.target.value.replace(/\D/g, '') }); clearErr('bankAccount'); }}
                            />
                            {formErrors.bankAccount && <p className="text-xs text-red-500 mt-1 ml-1">{formErrors.bankAccount}</p>}
                          </div>

                          <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">IFSC Code</p>
                            <input
                              className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:bg-white transition-all ${formErrors.ifsc ? 'bg-red-50 border-red-400' : 'bg-slate-50 border-slate-100 focus:border-blue-500'}`}
                              placeholder="e.g. PUNB0026000"
                              value={form.ifsc}
                              onChange={(e) => { setForm({ ...form, ifsc: e.target.value.toUpperCase() }); clearErr('ifsc'); }}
                            />
                            {formErrors.ifsc && <p className="text-xs text-red-500 mt-1 ml-1">{formErrors.ifsc}</p>}
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
                                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest truncate">Pass Book</p>
                                <p className="text-xs text-slate-500 truncate pr-2">{documents['passBook'] ? documents['passBook'].name : 'Bank details (Max 5MB)'}</p>
                                {docErrors['passBook'] && <p className="text-xs text-red-500 mt-1">{docErrors['passBook']}</p>}
                              </div>
                              <input type="file" id="doc-upload-passBook" className="hidden" onChange={handleDocumentChange('passBook')} accept=".jpeg,.jpg,.png,.pdf,image/jpeg,image/png,application/pdf" />
                              <label htmlFor="doc-upload-passBook" className="shrink-0 px-3 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-lg cursor-pointer hover:bg-blue-700 transition-colors">BROWSE</label>
                            </div>
                          </div>

                          <div className="col-span-2 space-y-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">PAN Card Number</p>
                            <input
                              className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:bg-white transition-all ${formErrors.pan ? 'bg-red-50 border-red-400' : 'bg-slate-50 border-slate-100 focus:border-blue-500'}`}
                              placeholder="e.g. ABCDE1234F"
                              value={form.pan}
                              onChange={(e) => { setForm({ ...form, pan: e.target.value.toUpperCase() }); clearErr('pan'); }}
                            />
                            {formErrors.pan && <p className="text-xs text-red-500 mt-1 ml-1">{formErrors.pan}</p>}
                          </div>
                        </div>
                      </div>

                      <hr className="border-slate-100" />

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1">
                          <h3 className="text-sm font-bold text-slate-900">Document Upload</h3>
                          <p className="text-xs text-slate-500 mt-1">Verification documents.</p>
                        </div>

                        <div className="md:col-span-2 space-y-4">
                          {[
                            { id: 'profilePhoto', label: 'Profile Photo', desc: 'Passport size photo (Max 5MB)', required: true },
                            { id: 'aadhaarCard', label: 'Aadhaar Card', desc: 'Front and back side (Max 5MB)', required: true },
                            { id: 'panCard', label: 'PAN Card', desc: 'Clear copy (Max 5MB)', required: true },
                            { id: 'educationalCertificates', label: 'Educational Certificates', desc: 'Highest qualification (Max 5MB)', required: true }
                          ].map((doc) => (
                            <div key={doc.id} className={`p-4 rounded-2xl flex items-center gap-3 border ${formErrors[doc.id] ? 'bg-red-50 border-red-300' : 'bg-blue-50/50 border-blue-100'
                              }`}>
                              <div className="bg-white rounded-lg shadow-sm w-12 h-12 flex justify-center items-center shrink-0 overflow-hidden border border-slate-100">
                                {documentPreviews[doc.id] ? (
                                  documents[doc.id]?.type === 'application/pdf' || documents[doc.id]?.name?.toLowerCase().endsWith('.pdf') ? (
                                    <FileText size={20} className="text-blue-600" />
                                  ) : (
                                    <img src={documentPreviews[doc.id]} alt="preview" className="w-full h-full object-cover" />
                                  )
                                ) : (
                                  <Upload size={20} className={formErrors[doc.id] ? 'text-red-400' : 'text-blue-600'} />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-[10px] font-bold uppercase tracking-widest truncate ${formErrors[doc.id] ? 'text-red-500' : 'text-blue-600'
                                  }`}>
                                  {doc.label}{doc.required && <span className="text-red-400 ml-0.5">*</span>}
                                </p>
                                <p className="text-xs text-slate-500 truncate pr-2">{documents[doc.id] ? documents[doc.id].name : doc.desc}</p>
                                {formErrors[doc.id] && <p className="text-xs text-red-500 mt-0.5">{formErrors[doc.id]}</p>}
                                {docErrors[doc.id] && <p className="text-xs text-red-500 mt-0.5">{docErrors[doc.id]}</p>}
                              </div>
                              <input type="file" id={`doc-upload-${doc.id}`} className="hidden"
                                onChange={(e) => { handleDocumentChange(doc.id)(e); clearErr(doc.id); }}
                                accept=".jpeg,.jpg,.png,.pdf,image/jpeg,image/png,application/pdf" />
                              <label htmlFor={`doc-upload-${doc.id}`} className="px-3 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-lg cursor-pointer hover:bg-blue-700 transition-colors">BROWSE</label>
                            </div>
                          ))}
                        </div>
                      </div>

                    </motion.div>
                  ) : (

                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 32 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 32 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="max-h-[70vh] overflow-y-auto pt-8 px-8 pb-4 space-y-6 custom-scrollbar"
                    >


                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200">
                          <span className="w-5 h-5 flex items-center justify-center rounded-full bg-emerald-100">✓</span> Fill Details
                        </div>
                        <div className="flex-1 h-px bg-emerald-200" />
                        <div className="flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-full border bg-slate-900 text-white border-slate-900">
                          <span className="w-5 h-5 flex items-center justify-center rounded-full bg-white/20">2</span> Review &amp; Confirm
                        </div>
                      </div>


                      <div className="rounded-2xl bg-blue-50 border border-blue-100 px-5 py-4 flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-xl text-blue-600"><Eye size={18} /></div>
                        <div>
                          <p className="text-sm font-bold text-blue-800">Review before submitting</p>
                          <p className="text-xs text-blue-500 mt-0.5">Please verify all information is accurate. You can go back to edit.</p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Personal Information</p>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {[
                              { label: 'Full Name', value: form.name },
                              { label: 'Aadhaar', value: form.aadhaar },
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


                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Financial Information</p>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {[
                              { label: 'Bank Name', value: form.bankName || '—' },
                              { label: 'Branch Name', value: form.branchName || '—' },
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

                    </motion.div>
                  )}
                </AnimatePresence>
              </div>


              <div className="px-8 py-5 bg-slate-50/80 border-t flex justify-end items-center gap-3">
                <button
                  onClick={() => {
                    if (formStep === 2) {
                      setFormStep(1);
                      setConfirmChecked(false);
                    } else {
                      setIsRegisterOpen(false);
                      setIsEditMode(false);
                      setEditingId(null);
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
                    {isSubmitting ? 'Processing...' : (isEditMode ? '✓ Confirm & Update CRP' : '✓ Confirm & Register CRP')}
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isModalOpen && selectedCRP && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-3xl rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200"
            >

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
                      onClick={() => setPreviewImage(selectedCRP.image)}
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl bg-white cursor-pointer hover:scale-105 transition-transform"
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


              <div className="pt-20 px-8 pb-8 space-y-8 max-h-[65vh] overflow-y-auto custom-scrollbar">


                <div className="flex gap-6 border-b border-slate-100 sticky top-0 bg-white z-10">
                  <button className="pb-3 border-b-2 border-slate-900 text-sm font-bold text-slate-900">Overview</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

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
      </AnimatePresence>

      <AnimatePresence>
        {viewModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
              onClick={() => setViewModalOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0.25 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden relative z-10 border border-slate-100"
            >
              <div className="relative h-24 bg-gradient-to-r from-slate-800 to-slate-900 px-6 flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20">
                  <Eye className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">CRP Details</h3>
                  <p className="text-slate-400 text-xs mt-0.5">Full profile information</p>
                </div>
                <button onClick={() => setViewModalOpen(false)}
                  className="absolute top-5 right-5 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
                  <X size={16} />
                </button>
              </div>

              <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                {isViewLoading ? (
                  <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-700 mb-4" />
                    <p className="text-sm font-semibold">Loading CRP details...</p>
                  </div>
                ) : viewCRPData?.error ? (
                  <div className="text-center py-10">
                    <p className="text-red-500 font-medium text-sm">{viewCRPData.error}</p>
                  </div>
                ) : viewCRPData && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <img src={viewCRPData.image || `https://i.pravatar.cc/80?u=${viewCRPData.id}`}
                        alt={viewCRPData.name}
                        onClick={() => setPreviewImage(viewCRPData.image || `https://i.pravatar.cc/80?u=${viewCRPData.id}`)}
                        className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md cursor-pointer hover:scale-105 transition-transform" />
                      <div>
                        <p className="text-lg font-bold text-slate-900">{viewCRPData.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">CRP ID: {viewCRPData.id}</p>
                        <div className="flex flex-col gap-2 mt-2">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Adjust Status</p>
                          <StatusToggle
                            id={viewCRPData.numericId}
                            currentStatus={viewCRPData.status}
                            onStatusChange={(newStatus) => setViewCRPData(prev => ({ ...prev, status: newStatus }))}
                            fetchList={fetchCRPs}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Personal Information</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {[
                          { label: "Aadhaar", value: viewCRPData.aadhaar || "—" },
                          { label: "Mobile", value: viewCRPData.mobile || "—" },
                          { label: "Email", value: viewCRPData.email || "—" },
                          { label: "Gender", value: viewCRPData.gender || "—" },
                          { label: "DOB", value: viewCRPData.dob || "—" },
                        ].map(item => (
                          <div key={item.label} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">{item.label}</p>
                            <p className="text-sm font-semibold text-slate-800 truncate">{item.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Financial Information</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {[
                          { label: "Bank Name", value: viewCRPData.bankName || "—" },
                          { label: "Branch Name", value: viewCRPData.branchName || "—" },
                          { label: "Acct. Number", value: viewCRPData.accountNumber || "—" },
                          { label: "IFSC", value: viewCRPData.ifsc || "—" },
                          { label: "PAN", value: viewCRPData.pan || "—" },
                        ].map(item => (
                          <div key={item.label} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">{item.label}</p>
                            <p className="text-sm font-semibold text-slate-800 truncate">{item.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button onClick={() => setViewModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-xl transition-colors">
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {previewImage && (
          <div
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm cursor-pointer"
            onClick={() => setPreviewImage(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
              className="relative max-w-4xl max-h-[90vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={previewImage}
                alt="Profile Preview"
                className="max-w-[85vw] max-h-[85vh] aspect-square object-cover rounded-full shadow-2xl border-4 border-white"
              />
              <button
                onClick={() => setPreviewImage(null)}
                className="absolute -top-4 -right-4 p-2 bg-white text-slate-900 rounded-full shadow-lg hover:bg-slate-100 transition-colors z-[100000]"
              >
                <X size={20} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


    </ProtectedRoute>
  );
} 