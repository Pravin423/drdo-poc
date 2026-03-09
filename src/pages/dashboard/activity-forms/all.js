import ProtectedRoute from "../../../components/ProtectedRoute";
import DashboardLayout from "../../../components/DashboardLayout";
import { motion } from "framer-motion";
import { FileText, Plus, Search, Eye, Trash2, Edit2 } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

// Placeholder data — replace with API call when ready
const MOCK_FORMS = [
  { id: "1", title: "Monthly CRP Activity Report", fields: 8, submissions: 124, createdAt: "2026-02-01", status: "Active" },
  { id: "2", title: "Village Survey Form",          fields: 12, submissions: 87,  createdAt: "2026-01-15", status: "Active" },
  { id: "3", title: "Attendance Verification",      fields: 5,  submissions: 210, createdAt: "2026-01-08", status: "Inactive" },
];

export default function AllForms() {
  const [search, setSearch] = useState("");

  const filtered = MOCK_FORMS.filter((f) =>
    f.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ProtectedRoute allowedRole="super-admin">
      <DashboardLayout>
        <div className="max-w-5xl mx-auto space-y-8 p-4">

          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-tech-blue-600 to-tech-blue-700 flex items-center justify-center shadow-md shadow-tech-blue-500/20">
                <FileText size={22} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">All Activity Forms</h1>
                <p className="text-slate-500 text-sm font-medium">View and manage all created forms</p>
              </div>
            </div>
            <Link
              href="/dashboard/activity-forms/create"
              className="flex items-center gap-2 px-4 py-2 bg-tech-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-tech-blue-700 transition-all shadow-md shadow-tech-blue-500/20 active:scale-95 w-fit"
            >
              <Plus size={16} /> Create New Form
            </Link>
          </motion.header>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative max-w-md"
          >
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search forms..."
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-tech-blue-500/20 focus:border-tech-blue-500 transition-all"
            />
          </motion.div>

          {/* Table */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
          >
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">#</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Form Title</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Fields</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Submissions</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Created</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Status</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length > 0 ? filtered.map((form) => (
                  <tr key={form.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{form.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-slate-800">{form.title}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">{form.fields} fields</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-slate-700">{form.submissions}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-500">{form.createdAt}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        form.status === "Active"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : "bg-slate-100 text-slate-500 border border-slate-200"
                      }`}>
                        {form.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="View">
                          <Eye size={15} />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors" title="Edit">
                          <Edit2 size={15} />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Delete">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center text-slate-400">
                        <FileText size={32} className="mb-3 opacity-40" />
                        <p className="text-sm font-semibold">No forms found.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-500">
                Showing <span className="text-slate-900">{filtered.length}</span> of <span className="text-slate-900">{MOCK_FORMS.length}</span> forms
              </p>
            </div>
          </motion.div>

        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
