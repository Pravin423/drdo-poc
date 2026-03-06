import {
  Users,
  Search,
  Plus,
  Filter,
  Download,
  Upload,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Shield,
  UserCheck,
  UserX,
  X,
  Save,
  Eye,
  EyeOff,
  FileText,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import ProtectedRoute from "../../../components/ProtectedRoute";
import DashboardLayout from "../../../components/DashboardLayout";
import { exportToExcel } from "../../../lib/exportToExcel";

const ROLES_LIST = [
  "super-admin",
  "state-admin",
  "district-admin",
  "supervisor",
  "finance",
  "crp",
];

const ROLE_STYLES = {
  "super-admin":    "bg-purple-50 text-purple-700 border-purple-200",
  "state-admin":    "bg-blue-50 text-blue-700 border-blue-200",
  "district-admin": "bg-cyan-50 text-cyan-700 border-cyan-200",
  supervisor:       "bg-amber-50 text-amber-700 border-amber-200",
  finance:          "bg-emerald-50 text-emerald-700 border-emerald-200",
  crp:              "bg-rose-50 text-rose-700 border-rose-200",
};

// Seed data shown before any users are added via the Add User form
const SEED_USERS = [
  { id: 1, fullname: "Kiran Oundhal",    email: "ramesh.runtime@gmail.com",  mobile: "8004725591", gender: "Male",   role_name: "Super Admin",    signature_status: "Approved", status: "Active",   joined: "2024-01-10", profile: null },
  { id: 2, fullname: "Anjali Desai",     email: "anjali.d@gov.goa.in",       mobile: "9876543210", gender: "Female", role_name: "State Admin",    signature_status: "Pending",  status: "Active",   joined: "2024-02-15", profile: null },
  { id: 3, fullname: "Rohit Naik",       email: "rohit.n@gov.goa.in",        mobile: "9765432109", gender: "Male",   role_name: "District Admin", signature_status: "Pending",  status: "Active",   joined: "2024-03-01", profile: null },
  { id: 4, fullname: "Priya Salgaonkar", email: "priya.s@gov.goa.in",        mobile: "9654321098", gender: "Female", role_name: "Supervisor",     signature_status: "Pending",  status: "Inactive", joined: "2024-03-20", profile: null },
  { id: 5, fullname: "Deepak Borkar",    email: "deepak.b@gov.goa.in",       mobile: "9543210987", gender: "Male",   role_name: "Finance",        signature_status: "Approved", status: "Active",   joined: "2024-04-05", profile: null },
  { id: 6, fullname: "Sneha Kamat",      email: "sneha.k@gov.goa.in",        mobile: "9432109876", gender: "Female", role_name: "CRP",            signature_status: "Pending",  status: "Active",   joined: "2024-04-18", profile: null },
  { id: 7, fullname: "Mahesh Gawas",     email: "mahesh.g@gov.goa.in",       mobile: "9321098765", gender: "Male",   role_name: "CRP",            signature_status: "Pending",  status: "Active",   joined: "2024-05-02", profile: null },
  { id: 8, fullname: "Lata Raikar",      email: "lata.r@gov.goa.in",         mobile: "9210987654", gender: "Female", role_name: "Supervisor",     signature_status: "Approved", status: "Active",   joined: "2024-05-15", profile: null },
];

const ROWS_PER_PAGE = 8;

// Read all users: seed + anything stored in localStorage
function loadUsers() {
  try {
    const stored = JSON.parse(localStorage.getItem("managedUsers") || "[]");
    // Avoid duplicates: stored users always come after seeds
    const storedIds = new Set(stored.map(u => u.id));
    return [...SEED_USERS.filter(u => !storedIds.has(u.id)), ...stored];
  } catch {
    return SEED_USERS;
  }
}

// Persist only the non-seed users to localStorage
function saveUsers(allUsers) {
  const seedIds = new Set(SEED_USERS.map(u => u.id));
  const toSave  = allUsers.filter(u => !seedIds.has(u.id));
  localStorage.setItem("managedUsers", JSON.stringify(toSave));
}

export default function UserList() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [editOpen, setEditOpen]     = useState(false);
  const [editData, setEditData]     = useState(null);
  const [saveOpen, setSaveOpen]     = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // ── Import modal state ────────────────────────────────────────────────────
  const [importOpen, setImportOpen]       = useState(false);
  const [importRole, setImportRole]       = useState("");
  const [importFile, setImportFile]       = useState(null);
  const [importError, setImportError]     = useState("");
  const [importSuccess, setImportSuccess] = useState("");
  const [importing, setImporting]         = useState(false);
  const importFileRef = useRef(null);

  const IMPORT_ROLES = [
    { value: "",               label: "-- Select Role --" },
    { value: "Super Admin",    label: "Super Admin" },
    { value: "State Admin",    label: "State Admin" },
    { value: "District Admin", label: "District Admin" },
    { value: "Supervisor",     label: "Supervisor" },
    { value: "Finance",        label: "Finance" },
  ];

  const downloadTemplate = () => {
    const csv = "Full Name,Mobile,Email,Gender,Date of Birth (YYYY-MM-DD),Password\nJohn Doe,9876543210,john@example.com,Male,1990-01-15,Pass@1234";
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "user_import_template.csv";
    a.click(); URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    setImportError(""); setImportSuccess("");
    if (!importRole)  { setImportError("Please select a role."); return; }
    if (!importFile)  { setImportError("Please choose a CSV file."); return; }
    if (importFile.size > 5 * 1024 * 1024) { setImportError("File exceeds 5MB."); return; }

    setImporting(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const lines   = e.target.result.split(/\r?\n/).filter(Boolean);
        const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
        const existingMobiles = new Set(users.map(u => String(u.mobile).trim()));
        const added = [];
        let skipped = 0;

        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(",").map(c => c.trim());
          if (cols.length < 2) continue;
          const mobile = cols[1];
          if (existingMobiles.has(mobile)) { skipped++; continue; }
          existingMobiles.add(mobile);
          added.push({
            id:               Date.now() + i,
            fullname:         cols[0] || "",
            mobile:           cols[1] || "",
            email:            cols[2] || "",
            gender:           cols[3] || "Male",
            date_of_birth:    cols[4] || null,
            role_name:        importRole,
            signature_status: "Pending",
            status:           "Active",
            joined:           new Date().toISOString().split("T")[0],
            profile:          null,
          });
        }

        const updated = [...users, ...added];
        setUsers(updated);
        saveUsers(updated);
        setImportSuccess(`✓ ${added.length} user(s) imported${skipped ? `, ${skipped} duplicate(s) skipped` : ""}.`);
        setImportFile(null);
        setImportRole("");
        if (importFileRef.current) importFileRef.current.value = "";
      } catch {
        setImportError("Failed to parse CSV. Please check the file format.");
      } finally {
        setImporting(false);
      }
    };
    reader.readAsText(importFile);
  };

  const closeImport = () => {
    setImportOpen(false); setImportRole(""); setImportFile(null);
    setImportError(""); setImportSuccess("");
    if (importFileRef.current) importFileRef.current.value = "";
  };

  // ── Export Excel (shared utility) ──────────────────────────────────
  const exportCSV = () => {
    exportToExcel({
      title:    "User Management Report",
      filename: `users_export_${new Date().toISOString().split("T")[0]}`,
      headers:  ["#", "Full Name", "Email", "Mobile", "Gender", "Date of Birth", "Role", "Status", "Signature Status", "Joined"],
      rows: users.map((u, i) => [
        i + 1,
        u.fullname        || "",
        u.email           || "",
        u.mobile          || "",
        u.gender          || "",
        u.date_of_birth   || "",
        u.role_name       || "",
        u.status          || "",
        u.signature_status || "Pending",
        u.joined          || "",
      ]),
    });
  };

  // ── Load from localStorage on mount ──────────────────────────────────────
  useEffect(() => {
    setUsers(loadUsers());
  }, []);

  // ── Lock scroll when modal open ───────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = editOpen || saveOpen || deleteOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [editOpen, saveOpen, deleteOpen]);

  // ── Derived summary counts (live from state) ──────────────────────────────
  const summaryCards = [
    { label: "Total Users",    value: users.length,                                    icon: Users,     accent: "text-blue-600 bg-blue-50 border-blue-100",         sub: "Registered accounts" },
    { label: "Active Users",   value: users.filter(u => u.status === "Active").length,  icon: UserCheck, accent: "text-emerald-600 bg-emerald-50 border-emerald-100", sub: "Currently active" },
    { label: "Inactive Users", value: users.filter(u => u.status === "Inactive").length,icon: UserX,     accent: "text-rose-600 bg-rose-50 border-rose-100",         sub: "Deactivated" },
    { label: "Roles Defined",  value: ROLES_LIST.length,                                icon: Shield,    accent: "text-purple-600 bg-purple-50 border-purple-100",    sub: "Permission levels" },
  ];

  const filtered = users.filter(u =>
    [u.fullname, u.email, u.mobile, u.role_name, u.status]
      .join(" ").toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);
  const paginated  = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  const openEdit   = (u) => { setEditData({ ...u }); setEditOpen(true); };
  const openDelete = (u) => { setDeleteTarget(u); setDeleteOpen(true); };

  const confirmSave = () => {
    const updated = users.map(u => u.id === editData.id ? editData : u);
    setUsers(updated);
    saveUsers(updated);   // ← persist to localStorage
    setSaveOpen(false);
    setEditOpen(false);
  };

  const confirmDelete = () => {
    const updated = users.filter(u => u.id !== deleteTarget.id);
    setUsers(updated);
    saveUsers(updated);   // ← persist to localStorage
    setDeleteOpen(false);
    setDeleteTarget(null);
  };

  return (
    <ProtectedRoute allowedRole="super-admin">
      <>
        <DashboardLayout>
          <div className="max-w-[1600px] mx-auto space-y-8 p-4">

            {/* Header */}
            <motion.header
              initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
                  User <span className="bg-gradient-to-b from-[#3b52ab] to-[#1a2e7a] bg-clip-text text-transparent">List</span>
                </h1>
                <p className="text-slate-500 font-medium">Browse and manage all registered users in the system.</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={exportCSV}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-all shadow-sm shadow-emerald-500/20 active:scale-95"
                >
                  <Download size={16} /> Export CSV
                </button>
                <button
                  onClick={() => { setImportOpen(true); setImportError(""); setImportSuccess(""); }}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                >
                  <Upload size={16} /> Import
                </button>
                <button
                  onClick={() => router.push("/dashboard/user-management/add-user")}
                  className="flex items-center gap-2 px-4 py-2 bg-tech-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-tech-blue-700 transition-all shadow-md shadow-tech-blue-500/20 active:scale-95"
                >
                  <Plus size={16} /> Add User
                </button>
              </div>
            </motion.header>

            {/* Summary Cards — live counts */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {summaryCards.map((card, i) => (
                <motion.section
                  key={card.label}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="flex justify-between items-start">
                    <div className={`p-3 rounded-2xl ${card.accent} border`}>
                      <card.icon size={22} />
                    </div>
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 rounded-full">{card.sub}</span>
                  </div>
                  <div className="mt-6 space-y-1">
                    <p className="text-3xl font-extrabold text-slate-900 tracking-tight">{card.value}</p>
                    <p className="text-sm font-semibold text-slate-500">{card.label}</p>
                  </div>
                </motion.section>
              ))}
            </div>

            {/* Table Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col"
            >
              {/* Controls */}
              <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
                <div className="relative max-w-md w-full">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text" value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    placeholder="Search by name, email, role, mobile..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-tech-blue-500/20 focus:border-tech-blue-500 transition-all font-medium"
                  />
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm">
                  <Filter size={16} /> Filters
                </button>
              </div>

              {/* Table */}
              <div className="flex-1 w-full">
                <table className="w-full text-left border-collapse table-fixed">
                  <colgroup>
                    <col style={{ width: "4%" }} />
                    <col style={{ width: "13%" }} />
                    <col style={{ width: "17%" }} />
                    <col style={{ width: "11%" }} />
                    <col style={{ width: "7%" }} />
                    <col style={{ width: "14%" }} />
                    <col style={{ width: "8%" }} />
                    <col style={{ width: "13%" }} />
                    <col style={{ width: "7%" }} />
                  </colgroup>
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-100">
                      {["#", "Name", "Email", "Mobile", "Gender", "Role Name", "Status", "Signature Status", "Actions"].map(h => (
                        <th key={h} className={`px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 truncate ${h === "Actions" ? "text-right" : ""}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginated.length > 0 ? paginated.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                        {/* # */}
                        <td className="px-3 py-3">
                          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">{u.id}</span>
                        </td>
                        {/* Name + avatar */}
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2 min-w-0">
                            {u.profile ? (
                              <img src={u.profile} alt={u.fullname} className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0" />
                            ) : (
                              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-tech-blue-400 to-tech-blue-700 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                                {(u.fullname || "?").slice(0, 2).toUpperCase()}
                              </div>
                            )}
                            <p className="text-xs font-semibold text-slate-800 truncate">{u.fullname}</p>
                          </div>
                        </td>
                        {/* Email */}
                        <td className="px-3 py-3 text-xs text-slate-600 truncate">{u.email}</td>
                        {/* Mobile */}
                        <td className="px-3 py-3 text-xs text-slate-600 font-mono">{u.mobile}</td>
                        {/* Gender */}
                        <td className="px-3 py-3 text-xs text-slate-600">{u.gender || "—"}</td>
                        {/* Role Name */}
                        <td className="px-3 py-3">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border whitespace-nowrap ${ROLE_STYLES[u.role_name?.toLowerCase().replace(" ", "-")] || "bg-slate-50 text-slate-600 border-slate-200"}`}>
                            {u.role_name}
                          </span>
                        </td>
                        {/* Status */}
                        <td className="px-3 py-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${
                            u.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-600"
                          }`}>
                            {u.status}
                          </span>
                        </td>
                        {/* Signature Status */}
                        <td className="px-3 py-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${
                            u.signature_status === "Approved"
                              ? "bg-emerald-100 text-emerald-700"
                              : u.signature_status === "Rejected"
                              ? "bg-rose-100 text-rose-600"
                              : "bg-amber-100 text-amber-700"
                          }`}>
                            {u.signature_status || "Pending"}
                          </span>
                        </td>
                        {/* Actions */}
                        <td className="px-3 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => openEdit(u)} className="p-1 text-slate-400 cursor-pointer hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Edit User">
                              <Edit2 size={14} />
                            </button>
                            <button onClick={() => openDelete(u)} className="p-1 text-slate-400 cursor-pointer hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete User">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={8} className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center text-slate-400">
                            <Users size={32} className="mb-3 opacity-50" />
                            <p className="text-sm font-semibold">No users match your search.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
                <p className="text-xs font-semibold text-slate-500">
                  Showing <span className="text-slate-900">{Math.min((page - 1) * ROWS_PER_PAGE + 1, filtered.length)}</span>
                  {" "}–{" "}
                  <span className="text-slate-900">{Math.min(page * ROWS_PER_PAGE, filtered.length)}</span>
                  {" "}of{" "}
                  <span className="text-slate-900">{filtered.length}</span> users
                </p>
                <div className="flex items-center gap-1">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    className="p-1.5 text-slate-500 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:text-slate-300 disabled:cursor-not-allowed transition-colors">
                    <ChevronLeft size={16} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => setPage(p)}
                      className={`min-w-[32px] h-8 px-2 text-xs font-bold rounded-lg border transition-colors ${page === p ? "bg-tech-blue-600 text-white border-tech-blue-600" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"}`}>
                      {p}
                    </button>
                  ))}
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages || totalPages === 0}
                    className="p-1.5 text-slate-500 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:text-slate-300 disabled:cursor-not-allowed transition-colors">
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </motion.div>

          </div>
        </DashboardLayout>

        {/* ── EDIT MODAL ── */}
        <AnimatePresence>
          {editOpen && editData && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setEditOpen(false)} />
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }} transition={{ type: "spring", duration: 0.4, bounce: 0.3 }}
                className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative z-10">
                <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-slate-800">Edit User</h3>
                  <button onClick={() => setEditOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors">
                    <X size={16} />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  {[
                    { label: "Full Name", key: "fullname", type: "text" },
                    { label: "Email",     key: "email",    type: "email" },
                    { label: "Mobile",    key: "mobile",   type: "tel" },
                  ].map(({ label, key, type }) => (
                    <div key={key}>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
                      <input type={type} value={editData[key] || ""}
                        onChange={(e) => setEditData({ ...editData, [key]: e.target.value })}
                        className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-tech-blue-500 focus:ring-2 focus:ring-tech-blue-500/20 transition-all text-slate-700 font-medium" />
                    </div>
                  ))}
                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Gender</label>
                    <select value={editData.gender || "Male"} onChange={(e) => setEditData({ ...editData, gender: e.target.value })}
                      className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-tech-blue-500 focus:ring-2 focus:ring-tech-blue-500/20 transition-all text-slate-700 font-medium bg-white">
                      {["Male","Female","Other"].map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  {/* Role */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Role</label>
                    <select value={editData.role_name || ""} onChange={(e) => setEditData({ ...editData, role_name: e.target.value })}
                      className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-tech-blue-500 focus:ring-2 focus:ring-tech-blue-500/20 transition-all text-slate-700 font-medium bg-white capitalize">
                      {["Super Admin","State Admin","District Admin","Supervisor","Finance","CRP"].map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  {/* Signature Status */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Signature Status</label>
                    <select value={editData.signature_status || "Pending"} onChange={(e) => setEditData({ ...editData, signature_status: e.target.value })}
                      className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-tech-blue-500 focus:ring-2 focus:ring-tech-blue-500/20 transition-all text-slate-700 font-medium bg-white">
                      {["Pending","Approved","Rejected"].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Status</label>
                    <select value={editData.status} onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                      className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-tech-blue-500 focus:ring-2 focus:ring-tech-blue-500/20 transition-all text-slate-700 font-medium bg-white">
                      <option>Active</option>
                      <option>Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                  <button onClick={() => setEditOpen(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">Cancel</button>
                  <button onClick={() => setSaveOpen(true)} className="px-5 py-2.5 text-sm font-bold text-white bg-tech-blue-600 hover:bg-tech-blue-700 rounded-xl shadow-sm transition-colors">Save Changes</button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ── SAVE CONFIRM ── */}
        <AnimatePresence>
          {saveOpen && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setSaveOpen(false)} />
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", duration: 0.4, bounce: 0.4 }}
                className="bg-white rounded-3xl shadow-xl w-full max-w-sm z-10">
                <div className="p-8 text-center flex flex-col items-center">
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-5 rotate-3"><Save size={32} /></div>
                  <h3 className="text-xl font-extrabold text-slate-800 mb-2">Confirm Save</h3>
                  <p className="text-sm font-medium text-slate-500 mb-8">Are you sure you want to save changes to this user?</p>
                  <div className="flex gap-3 w-full">
                    <button onClick={() => setSaveOpen(false)} className="flex-1 px-4 py-3 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">Cancel</button>
                    <button onClick={confirmSave} className="flex-1 px-4 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-colors active:scale-95">Yes, Save</button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ── DELETE CONFIRM ── */}
        <AnimatePresence>
          {deleteOpen && deleteTarget && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setDeleteOpen(false)} />
              <motion.div initial={{ opacity: 0, scale: 0.9, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }} transition={{ type: "spring", duration: 0.4, bounce: 0.4 }}
                className="bg-white rounded-3xl shadow-xl w-full max-w-sm z-10">
                <div className="p-8 text-center flex flex-col items-center">
                  <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-5 -rotate-3"><Trash2 size={32} /></div>
                  <h3 className="text-xl font-extrabold text-slate-800 mb-2">Delete User?</h3>
                  <p className="text-sm font-medium text-slate-500 mb-8">
                    Are you sure you want to delete <span className="font-bold text-slate-700">{deleteTarget.fullname}</span>? This cannot be undone.
                  </p>
                  <div className="flex gap-3 w-full">
                    <button onClick={() => setDeleteOpen(false)} className="flex-1 px-4 py-3 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">Keep It</button>
                    <button onClick={confirmDelete} className="flex-1 px-4 py-3 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md shadow-red-500/20 transition-colors active:scale-95">Yes, Delete</button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ── IMPORT MODAL ── */}
        <AnimatePresence>
          {importOpen && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={closeImport} />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }} transition={{ type: "spring", duration: 0.4, bounce: 0.25 }}
                className="bg-white rounded-2xl shadow-xl w-full max-w-lg relative z-10 overflow-hidden"
              >
                {/* Modal Header */}
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-tech-blue-600 flex items-center justify-center shadow-sm">
                      <Upload size={18} className="text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">Import Users</h3>
                  </div>
                  <button onClick={closeImport} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                    <X size={18} />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-5">

                  {/* Role Selector */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-slate-700">
                      Select Role <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={importRole}
                      onChange={(e) => { setImportRole(e.target.value); setImportError(""); }}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 bg-white outline-none focus:border-tech-blue-500 focus:ring-4 focus:ring-tech-blue-500/10 transition-all appearance-none"
                    >
                      {IMPORT_ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                    </select>
                    <p className="text-[11px] text-slate-400 font-medium">
                      Note: CRP role is excluded. Use CRP section to manage CRP users.
                    </p>
                  </div>

                  {/* CSV File Picker */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-slate-700">
                      Select CSV File <span className="text-rose-500">*</span>
                    </label>
                    <div
                      onClick={() => importFileRef.current?.click()}
                      className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl border-2 cursor-pointer transition-all ${
                        importError && !importRole ? "border-slate-200" :
                        importFile ? "border-tech-blue-400 bg-tech-blue-50/30" : "border-slate-200 hover:border-tech-blue-400 hover:bg-slate-50"
                      }`}
                    >
                      <FileText size={18} className="text-slate-400 shrink-0" />
                      <span className={`text-sm truncate ${importFile ? "text-slate-800 font-semibold" : "text-slate-400"}`}>
                        {importFile ? importFile.name : "No file chosen"}
                      </span>
                      <span className="ml-auto text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg shrink-0">
                        Choose File
                      </span>
                    </div>
                    <input
                      ref={importFileRef}
                      type="file"
                      accept=".csv"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files[0];
                        setImportFile(f || null);
                        setImportError("");
                        setImportSuccess("");
                      }}
                    />
                    <p className="text-[11px] text-slate-400 font-medium">Only CSV files are supported (max 5MB)</p>
                  </div>

                  {/* Download Template */}
                  <button
                    onClick={downloadTemplate}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <Download size={15} /> Download CSV Template
                  </button>

                  {/* CSV Format Info */}
                  <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3.5 space-y-1.5">
                    <p className="text-xs font-bold text-sky-700">
                      <span className="font-extrabold">CSV Format:</span>{" "}
                      <span className="font-semibold">Full Name, Mobile, Email, Gender, Date of Birth (YYYY-MM-DD), Password</span>
                    </p>
                    <p className="text-xs text-sky-600 font-medium">
                      <span className="font-extrabold">Note:</span>{" "}
                      Duplicate mobile numbers will be skipped. The Role selected above will be applied to all imported users.
                    </p>
                  </div>

                  {/* Error / Success feedback */}
                  <AnimatePresence>
                    {importError && (
                      <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                        <AlertCircle size={16} className="shrink-0" /> {importError}
                      </motion.div>
                    )}
                    {importSuccess && (
                      <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                        <CheckCircle2 size={16} className="shrink-0" /> {importSuccess}
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button onClick={closeImport}
                    className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-slate-200 hover:bg-slate-300 rounded-xl transition-colors">
                    Cancel
                  </button>
                  <motion.button
                    onClick={handleImport}
                    disabled={importing}
                    whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-tech-blue-600 hover:bg-tech-blue-700 rounded-xl shadow-md shadow-tech-blue-500/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {importing ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full" />
                    ) : <Upload size={15} />}
                    {importing ? "Importing…" : "Import"}
                  </motion.button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </>
    </ProtectedRoute>
  );
}
