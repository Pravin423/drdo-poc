import ProtectedRoute from "../../../components/ProtectedRoute";
import DashboardLayout from "../../../components/DashboardLayout";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { AnimatePresence, motion } from "framer-motion";
import { FileText, Plus, Search, Eye, Trash2, Edit2, X, Edit } from "lucide-react";



export default function AllForms() {
  const [search, setSearch] = useState("");
  const [forms, setForms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [formToDelete, setFormToDelete] = useState(null);
  const router = useRouter();

  const fetchForms = async () => {
    setIsLoading(true);
    try {
        const token = localStorage.getItem("authToken");
        const response = await fetch("/api/activity-forms", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch activity forms`);
        }

        const result = await response.json();
        const dataArray = Array.isArray(result.data) ? result.data : [];

        const fetchedForms = dataArray.map((f, index) => ({
            id: (f.id || index + 1).toString(),
            title: f.form_name || "",
            description: f.description || "",
            fields: f.field_count || 0,
            createdBy: f.created_by_name || f.created_by || "",
            createdAt: f.created_at || "",
            status: f.status === 1 ? "Active" : "Inactive"
        }));

        setForms(fetchedForms);
    } catch (error) {
        console.error("Error fetching forms:", error);
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  const handleDeleteClick = (id) => {
    setFormToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (formToDelete) {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`/api/activity-form-delete?id=${formToDelete}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to delete the form");
        }

        const filtered = forms.filter((f) => f.id !== formToDelete);
        setForms(filtered);
      } catch (error) {
        console.error("Error deleting form:", error);
      } finally {
        setDeleteConfirmOpen(false);
        setFormToDelete(null);
      }
    }
  };

  const filtered = forms.filter((f) =>
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
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">#</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Form Title</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Description</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Fields</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Created By</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Created At</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Status</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-500 mb-3"></div>
                        <p className="text-sm font-semibold">Loading forms...</p>
                      </div>
                    </td>
                  </tr>
                ) : filtered.length > 0 ? filtered.map((form, index) => (
                  <tr key={form.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{index + 1}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-slate-800">{form.title}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-600 line-clamp-2 max-w-xs" title={form.description}>{form.description}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">{form.fields} fields</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-slate-700">{form.createdBy}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-500 whitespace-nowrap">{form.createdAt}</span>
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
                        <button onClick={() => router.push(`/dashboard/activity-forms/view?id=${form.id}`)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="View">
                          <Eye size={15} />
                        </button>
                        <button onClick={() => router.push(`/dashboard/activity-forms/create?id=${form.id}`)} className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors" title="Edit">
                          <Edit size={15} />
                        </button>
                        <button onClick={() => handleDeleteClick(form.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Delete">
                          <X size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center text-slate-400">
                        <FileText size={32} className="mb-3 opacity-40" />
                        <p className="text-sm font-semibold">No forms found.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            </div>
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-500">
                Showing <span className="text-slate-900">{filtered.length}</span> of <span className="text-slate-900">{forms.length}</span> forms
              </p>
            </div>
          </motion.div>

        </div>
      </DashboardLayout>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]"
              onClick={() => setDeleteConfirmOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.4 }}
              className="bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden z-10"
            >
              <div className="p-8 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-5 -rotate-3">
                  <Trash2 size={32} />
                </div>
                <h3 className="text-xl font-extrabold text-slate-800 mb-2">Delete Form?</h3>
                <p className="text-sm font-medium text-slate-500 mb-8">This action cannot be undone. Are you sure you want to permanently delete this form?</p>
                <div className="flex gap-3 justify-center w-full">
                  <button onClick={() => setDeleteConfirmOpen(false)} className="flex-1 px-4 py-3 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
                    Keep It
                  </button>
                  <button onClick={confirmDelete} className="flex-1 px-4 py-3 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md shadow-red-500/20 transition-colors active:scale-95">
                    Yes, Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ProtectedRoute>
  );
}
