import { motion } from "framer-motion";
import { Search, Eye, Edit, X, FileText } from "lucide-react";

export default function FormsTable({ 
  search, 
  setSearch, 
  isLoading, 
  filtered, 
  forms, 
  router, 
  handleDeleteClick 
}) {
  return (
    <>
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
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
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
    </>
  );
}
