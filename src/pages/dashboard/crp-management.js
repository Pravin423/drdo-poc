"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { UploadCloud, MapPin, Activity, FileText, Shield, ShieldCheck, Zap, X } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";

import ProtectedRoute from "../../components/ProtectedRoute";
import DashboardLayout from "../../components/DashboardLayout";
import { exportToExcel } from "../../lib/exportToExcel";

// CRP Components
import StatusBadge from "../../components/super-admin/crp/StatusBadge";
import CrpStatsCards from "../../components/super-admin/crp/CrpStatsCards";
import CrpFilterBar from "../../components/super-admin/crp/CrpFilterBar";
import CrpTable from "../../components/super-admin/crp/CrpTable";
import CrpRegisterModal from "../../components/super-admin/crp/CrpRegisterModal";
import CrpViewModal from "../../components/super-admin/crp/CrpViewModal";
import CrpBulkImportModal from "../../components/super-admin/crp/CrpBulkImportModal";
import CrpProfileImageModal from "../../components/super-admin/crp/CrpProfileImageModal";

const goaVillages = [
  "Panjim", "Mapusa", "Margao", "Vasco da Gama", "Ponda",
  "Calangute", "Candolim", "Benaulim", "Colva", "Curchorem",
  "Quepem", "Sanquelim", "Pernem", "Canacona", "Assagao",
  "Siolim", "Anjuna", "Aldona", "Saligao", "Verna",
];

export default function CrpManagement() {
  const router = useRouter();

  // ── Data ──────────────────────────────────────────────────────────────────
  const [crpList, setCrpList] = useState([]);
  const [isLoadingCRPs, setIsLoadingCRPs] = useState(true);

  const fetchCRPs = async () => {
    setIsLoadingCRPs(true);
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch("/api/crp-employee", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const result = await res.json();
      const arr = Array.isArray(result.data) ? result.data : Array.isArray(result) ? result : [];

      setCrpList(arr.map((c, i) => {
        const name =
          c.fullname || c.fullName || c.name || c.full_name || c.employeeName ||
          c.employee_name || c.userName ||
          [c.firstName || c.first_name || "", c.lastName || c.last_name || ""].filter(Boolean).join(" ") || "";

        const rawStatus = c.status;
        let status = "Active";
        if (rawStatus === 0 || rawStatus === "0" || rawStatus === "Active") status = "Active";
        else if (rawStatus === 1 || rawStatus === "1" || rawStatus === "Inactive" || rawStatus === "Deactive") status = "Inactive";
        else if (rawStatus === 2 || rawStatus === "2" || rawStatus === "Deleted") status = "Deleted";
        else if (typeof rawStatus === "string") status = rawStatus;

        const sigRaw = c.signature_status ?? c.signatureStatus;
        const signatureStatus =
          sigRaw === 1 || sigRaw === "1" ? "Approved" :
          sigRaw === 0 || sigRaw === "0" ? "Pending" :
          sigRaw || "Approved";

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

  useEffect(() => { fetchCRPs(); }, []);

  // ── Filters ───────────────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Status");

  const filteredCRPs = crpList.filter((crp) => {
    const matchSearch =
      (crp.name || "").toLowerCase().includes((search || "").toLowerCase()) ||
      String(crp.aadhaar ?? "").includes(search) ||
      String(crp.mobile ?? "").includes(search);
    const matchStatus = status === "All Status" || crp.status === status;
    return matchSearch && matchStatus;
  });

  const totalCRPs = filteredCRPs.length;
  const activeCRPs = filteredCRPs.filter((c) => c.status === "Active").length;
  const inactiveCRPs = filteredCRPs.filter((c) => c.status === "Inactive").length;

  // ── Export ────────────────────────────────────────────────────────────────
  const exportToCSV = () => {
    if (!filteredCRPs.length) return;
    exportToExcel({
      title: "Goa CRP Management — Records Report",
      headers: ["Name", "Aadhaar", "Mobile", "Email", "District", "Taluka", "Block", "Villages", "Status", "Last Activity", "Timestamp"],
      rows: filteredCRPs.map((crp) => [
        crp.name, crp.aadhaar, crp.mobile, crp.email,
        crp.district, crp.taluka, crp.block, crp.villages,
        crp.status, crp.lastActivity, crp.time,
      ]),
      filename: "goa_crp_records_report",
    });
  };

  // ── Register / Edit Modal ─────────────────────────────────────────────────
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formStep, setFormStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmChecked, setConfirmChecked] = useState(false);

  const [form, setForm] = useState({
    name: "", aadhaar: "", mobile: "", email: "", dob: "", gender: "",
    district: "", taluka: "", block: "", villages: [], vertical: "",
    bankName: "", branchName: "", bankAccount: "", ifsc: "", pan: "", photo: null,
  });
  const [formErrors, setFormErrors] = useState({});

  const [documents, setDocuments] = useState({
    profilePhoto: null, aadhaarCard: null, panCard: null,
    educationalCertificates: null, passBook: null,
  });
  const [documentPreviews, setDocumentPreviews] = useState({
    profilePhoto: null, aadhaarCard: null, panCard: null,
    educationalCertificates: null, passBook: null,
  });
  const [docErrors, setDocErrors] = useState({
    profilePhoto: "", aadhaarCard: "", panCard: "", educationalCertificates: "", passBook: "",
  });

  useEffect(() => {
    if (router.query?.add === "true") setIsRegisterOpen(true);
  }, [router.query]);

  const handleDocumentChange = (docType) => (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setDocErrors((prev) => ({ ...prev, [docType]: "File size must be less than 5MB" }));
      setDocuments((prev) => ({ ...prev, [docType]: null }));
      if (documentPreviews[docType]) URL.revokeObjectURL(documentPreviews[docType]);
      setDocumentPreviews((prev) => ({ ...prev, [docType]: null }));
      e.target.value = "";
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    const isValidExtension = /\.(jpe?g|png|pdf)$/i.test(file.name);
    if (!allowedTypes.includes(file.type) && !isValidExtension) {
      setDocErrors((prev) => ({ ...prev, [docType]: "Please upload a valid document (JPG, PNG, or PDF)" }));
      setDocuments((prev) => ({ ...prev, [docType]: null }));
      if (documentPreviews[docType]) URL.revokeObjectURL(documentPreviews[docType]);
      setDocumentPreviews((prev) => ({ ...prev, [docType]: null }));
      e.target.value = "";
      return;
    }

    if (documentPreviews[docType]) URL.revokeObjectURL(documentPreviews[docType]);
    const previewUrl = URL.createObjectURL(file);
    setDocErrors((prev) => ({ ...prev, [docType]: "" }));
    setDocuments((prev) => ({ ...prev, [docType]: file }));
    setDocumentPreviews((prev) => ({ ...prev, [docType]: previewUrl }));
  };

  const handleNextStep = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = "Full name is required.";
    if (!form.aadhaar || form.aadhaar.length !== 12) errors.aadhaar = "Enter a valid 12-digit Aadhaar number.";
    if (!form.mobile || !/^\d{10}$/.test(form.mobile)) errors.mobile = "Enter a valid 10-digit mobile number.";
    if (!form.email.trim()) errors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = "Enter a valid email address.";
    if (!form.dob) errors.dob = "Date of birth is required.";
    if (!form.gender) errors.gender = "Please select a gender.";
    if (!form.bankName.trim()) errors.bankName = "Bank name is required.";
    if (!form.branchName.trim()) errors.branchName = "Branch name is required.";
    if (!form.bankAccount.trim()) errors.bankAccount = "Account number is required.";
    else if (!/^\d{9,18}$/.test(form.bankAccount.trim())) errors.bankAccount = "Account number must be 9–18 digits.";
    if (!form.ifsc.trim()) errors.ifsc = "IFSC code is required.";
    else if (!/^[A-Z]{4}[A-Z0-9]{7}$/i.test(form.ifsc.trim())) errors.ifsc = "IFSC must be 11 characters.";
    if (!form.pan.trim()) errors.pan = "PAN number is required.";
    else if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/i.test(form.pan.trim())) errors.pan = "Invalid PAN format (e.g. ABCDE1234F).";

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

  const resetForm = () => {
    setIsRegisterOpen(false);
    setIsEditMode(false);
    setEditingId(null);
    setFormStep(1);
    setFormErrors({});
    setForm({ name: "", aadhaar: "", mobile: "", email: "", dob: "", gender: "", district: "", taluka: "", block: "", villages: [], vertical: "", bankName: "", branchName: "", bankAccount: "", ifsc: "", pan: "", photo: null });
    Object.values(documentPreviews).forEach((url) => { if (url) URL.revokeObjectURL(url); });
    setDocuments({ profilePhoto: null, aadhaarCard: null, panCard: null, educationalCertificates: null, passBook: null });
    setDocumentPreviews({ profilePhoto: null, aadhaarCard: null, panCard: null, educationalCertificates: null, passBook: null });
    setConfirmChecked(false);
  };

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
      if (isEditMode) fd.append("ifsc_code", form.ifsc);
      else fd.append("ifsc", form.ifsc);

      if (documents.profilePhoto) fd.append("profile_img", documents.profilePhoto);
      if (documents.aadhaarCard) fd.append("aadhaar_img", documents.aadhaarCard);
      if (documents.panCard) fd.append("pan_img", documents.panCard);
      if (documents.educationalCertificates) fd.append("edu_certificates", documents.educationalCertificates);
      if (documents.passBook) fd.append("passbook_img", documents.passBook);

      const url = isEditMode && editingId ? `/api/crp-update?id=${editingId}` : "/api/add-crp";
      const response = await fetch(url, { method: "POST", body: fd });
      const result = await response.json();

      if (!response.ok || result?.status === false) {
        const msg = typeof result?.message === "string"
          ? result.message
          : JSON.stringify(result?.message ?? result?.error ?? `HTTP ${response.status}`);
        throw new Error(msg);
      }

      resetForm();
      await fetchCRPs();
    } catch (err) {
      console.error("[CRP Update/Add] Failed:", err);
      alert(`Failed to ${isEditMode ? "update" : "register"} CRP:\n${err.message}`);
    } finally {
      setIsSubmitting(false);
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
      if (Array.isArray(d)) d = d[0] || {};
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

  // ── View Modal ────────────────────────────────────────────────────────────
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewCRPData, setViewCRPData] = useState(null);
  const [isViewLoading, setIsViewLoading] = useState(false);

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
      if (Array.isArray(d)) d = d[0] || {};
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

  // ── Bulk Import ───────────────────────────────────────────────────────────
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [bulkFile, setBulkFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // ── Profile Image Preview ─────────────────────────────────────────────────
  const [previewImage, setPreviewImage] = useState(null);

  // ── Body scroll lock ──────────────────────────────────────────────────────
  useEffect(() => {
    if (isRegisterOpen || isBulkImportOpen || viewModalOpen || previewImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isRegisterOpen, isBulkImportOpen, viewModalOpen, previewImage]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <ProtectedRoute allowedRole="super-admin">
      <DashboardLayout>
        <div className="max-w-[1600px] mx-auto space-y-8 p-6">

          {/* Page Header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                CRP{" "}
                <span className="bg-gradient-to-b from-[#3b52ab] to-[#1a2e7a] bg-clip-text text-transparent">
                  Management
                </span>
              </h1>
              <p className="text-slate-500 font-medium">Manage Community Resource Persons across Goa</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsBulkImportOpen(true)}
                className="px-4 cursor-pointer py-2 border rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-slate-50"
              >
                <UploadCloud size={16} /> Bulk Import
              </button>
              <button
                onClick={() => setIsRegisterOpen(true)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800"
              >
                + Register New CRP
              </button>
            </div>
          </motion.header>

          {/* Stats */}
          <CrpStatsCards totalCRPs={totalCRPs} activeCRPs={activeCRPs} inactiveCRPs={inactiveCRPs} />

          {/* Filters */}
          <CrpFilterBar
            search={search} setSearch={setSearch}
            status={status} setStatus={setStatus}
            onClear={() => { setSearch(""); setStatus("All Status"); }}
            onExport={exportToCSV}
          />

          {/* Table */}
          <CrpTable
            filteredCRPs={filteredCRPs}
            isLoadingCRPs={isLoadingCRPs}
            onView={handleViewClick}
            onEdit={handleEditClick}
          />

        </div>
      </DashboardLayout>

      {/* Modals */}
      <CrpBulkImportModal
        isOpen={isBulkImportOpen}
        onClose={() => setIsBulkImportOpen(false)}
        bulkFile={bulkFile}
        setBulkFile={setBulkFile}
        isUploading={isUploading}
        setIsUploading={setIsUploading}
        uploadSuccess={uploadSuccess}
        setUploadSuccess={setUploadSuccess}
      />

      <CrpRegisterModal
        isOpen={isRegisterOpen}
        onClose={resetForm}
        isEditMode={isEditMode}
        formStep={formStep}
        setFormStep={setFormStep}
        form={form}
        setForm={setForm}
        formErrors={formErrors}
        setFormErrors={setFormErrors}
        documents={documents}
        setDocuments={setDocuments}
        documentPreviews={documentPreviews}
        setDocumentPreviews={setDocumentPreviews}
        docErrors={docErrors}
        setDocErrors={setDocErrors}
        confirmChecked={confirmChecked}
        setConfirmChecked={setConfirmChecked}
        isSubmitting={isSubmitting}
        handleNextStep={handleNextStep}
        handleSubmit={handleSubmit}
        handleDocumentChange={handleDocumentChange}
      />

      <CrpViewModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        viewCRPData={viewCRPData}
        isViewLoading={isViewLoading}
        onPreviewImage={setPreviewImage}
        fetchCRPs={fetchCRPs}
      />

      <CrpProfileImageModal previewImage={previewImage} onClose={() => setPreviewImage(null)} />

    </ProtectedRoute>
  );
}