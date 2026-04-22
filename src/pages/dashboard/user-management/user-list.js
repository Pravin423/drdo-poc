"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Download, Upload, Trash2, Edit, X 
} from "lucide-react";

import ProtectedRoute from "../../../components/ProtectedRoute";
import DashboardLayout from "../../../components/DashboardLayout";
import DataTable from "../../../components/common/DataTable";
import { exportToExcel } from "../../../lib/exportToExcel";

// Components
import UserSummaryCards from "../../../components/super-admin/user-mgmt/UserSummaryCards";
import UserFilterPanel from "../../../components/super-admin/user-mgmt/UserFilterPanel";
import UserAddModal from "../../../components/super-admin/user-mgmt/UserAddModal";
import UserEditModal from "../../../components/super-admin/user-mgmt/UserEditModal";
import UserImportModal from "../../../components/super-admin/user-mgmt/UserImportModal";

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

// Mapping functions for API data
const mapStatus = (s) => (s === 1 || s === "1" ? "Active" : "Inactive");
const mapSignature = (s) => {
  if (s === 1 || s === "1") return "Approved";
  if (s === 2 || s === "2") return "Rejected";
  return "Pending";
};

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal States
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/employees");
      const json = await res.json();
      if (json.status === 1 && json.data) {
        const mapped = json.data.map(u => ({
          ...u,
          role_name: u.rolename || "Unknown",
          status: mapStatus(u.status),
          signature_status: mapSignature(u.signature_status),
          joined: u.created_at ? u.created_at.split("T")[0] : "—"
        }));
        setUsers(mapped);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = useMemo(() => {
    return users.filter(u =>
      [u.fullname, u.email, u.mobile, u.role_name, u.status]
        .join(" ").toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

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

  const handleUserAdded = (newUser) => {
    fetchUsers(); // Refresh list from server
  };

  const handleUserUpdated = (updatedUser) => {
    fetchUsers(); // Refresh list from server
    setEditOpen(false);
    setEditTarget(null);
  };

  const handleImported = (newUsers) => {
    fetchUsers(); // Refresh list from server
  };

  const confirmDelete = () => {
    // In a real app, you'd call a DELETE API here
    const updated = users.filter(u => u.id !== deleteTarget.id);
    setUsers(updated);
    setDeleteOpen(false);
    setDeleteTarget(null);
  };

  const columns = [
  { 
    header: "#", 
    key: "id", 
    width: "70px",
    render: (val, row, idx) => (
      <div className="flex flex-col items-start gap-0.5">
        <span className="text-sm font-extrabold text-slate-800 leading-tight">
          {idx + 1}
        </span>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight whitespace-nowrap">
          Emp ID - {val}
        </span>
      </div>
    )
  },

  { 
    header: "Name", 
    key: "fullname",
    width: "220px",
    render: (val, row) => (
      <div className="flex items-center gap-3 min-w-0">
        
        {/* Avatar */}
        {row.profile ? (
          <img 
            src={row.profile} 
            alt={val} 
            className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {(val || "?").slice(0, 2).toUpperCase()}
          </div>
        )}

        {/* Name */}
        <p className="text-sm font-medium text-slate-800 truncate">
          {val || "Unknown"}
        </p>
      </div>
    )
  },

  { 
    header: "Email", 
    key: "email",
    width: "220px",
    render: (val) => (
      <span className="text-sm text-slate-600 truncate block">
        {val || "—"}
      </span>
    )
  },

  { 
    header: "Mobile", 
    key: "mobile",
    width: "150px",
    render: (val) => (
      <span className="text-sm text-slate-700 font-mono">
        {val || "—"}
      </span>
    )
  },

  { 
    header: "Gender", 
    key: "gender",
    width: "120px",
    render: (val) => (
      <span className="text-sm text-slate-600">
        {val || "—"}
      </span>
    )
  },

  { 
    header: "Role", 
    key: "role_name",
    width: "150px",
    render: (val) => {
      const key = val?.toLowerCase().replace(/\s+/g, "-");
      return (
        <span className={`text-xs font-semibold px-3 py-1 rounded-full border whitespace-nowrap ${
          ROLE_STYLES[key] || "bg-slate-100 text-slate-700 border-slate-200"
        }`}>
          {val || "—"}
        </span>
      );
    }
  },

  { 
    header: "Status", 
    key: "status",
    width: "130px",
    render: (val) => (
      <span className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ${
        val === "Active"
          ? "bg-emerald-100 text-emerald-700"
          : "bg-rose-100 text-rose-600"
      }`}>
        {val || "Inactive"}
      </span>
    )
  },

  { 
    header: "Signature", 
    key: "signature_status",
    width: "150px",
    render: (val) => {
      const status = val || "Pending";

      const styles =
        status === "Approved"
          ? "bg-emerald-100 text-emerald-700"
          : status === "Rejected"
          ? "bg-rose-100 text-rose-600"
          : "bg-amber-100 text-amber-700";

      return (
        <span className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ${styles}`}>
          {status}
        </span>
      );
    }
  },
];

  const actions = [
    {
      icon: Edit,
      onClick: (row) => { setEditTarget(row); setEditOpen(true); },
      title: "Edit User",
      className: "hover:text-blue-600 hover:bg-blue-50 rounded"
    },
    {
      icon: Trash2,
      onClick: (row) => { setDeleteTarget(row); setDeleteOpen(true); },
      title: "Delete User",
      className: "hover:text-red-600 hover:bg-red-50 rounded"
    }
  ];

  return (
    <ProtectedRoute allowedRole="super-admin">
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
                onClick={() => setImportOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all shadow-sm active:scale-95"
              >
                <Upload size={16} /> Import
              </button>
              <button
                onClick={() => setAddOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-tech-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-tech-blue-700 transition-all shadow-md shadow-tech-blue-500/20 active:scale-95"
              >
                <Plus size={16} /> Add User
              </button>
            </div>
          </motion.header>

          {/* Summary Cards */}
          <UserSummaryCards 
            totalUsers={users.length}
            activeUsers={users.filter(u => u.status === "Active").length}
            inactiveUsers={users.filter(u => u.status === "Inactive").length}
            rolesCount={ROLES_LIST.length}
          />

          {/* Table Card */}
          <div className="space-y-4">
            <DataTable 
              columns={columns}
              data={filtered}
              isLoading={loading}
              actions={actions}
              searchProps={{
                placeholder: "Search by name, email, role, mobile...",
                value: search,
                onChange: setSearch
              }}
              footerProps={{
                totalRecords: filtered.length,
                showPagination: true,
                onPageChange: () => {} // Pagination is handled locally in DataTable if implemented, but here filtered is the whole list
              }}
            />
          </div>
        </div>
      </DashboardLayout>

      {/* Modals */}
      <AnimatePresence>
        {addOpen && (
          <UserAddModal 
            isOpen={addOpen} 
            onClose={() => setAddOpen(false)} 
            onUserAdded={handleUserAdded} 
          />
        )}
        {editOpen && editTarget && (
          <UserEditModal 
            isOpen={editOpen} 
            user={editTarget} 
            onClose={() => { setEditOpen(false); setEditTarget(null); }} 
            onSave={handleUserUpdated} 
          />
        )}
        {importOpen && (
          <UserImportModal 
            isOpen={importOpen} 
            users={users} 
            onClose={() => setImportOpen(false)} 
            onImport={handleImported} 
          />
        )}
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
    </ProtectedRoute>
  );
}
