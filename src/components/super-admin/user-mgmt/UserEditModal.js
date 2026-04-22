import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save } from "lucide-react";

export default function UserEditModal({ isOpen, user, onClose, onSave }) {
  const [editData, setEditData] = useState(user ? { ...user } : null);
  const [saveConfirmOpen, setSaveConfirmOpen] = useState(false);

  // Sync state when user prop changes
  React.useEffect(() => {
    if (user) setEditData({ ...user });
  }, [user]);

  if (!isOpen || !editData) return null;

  const handleSave = () => {
    onSave(editData);
    setSaveConfirmOpen(false);
  };

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
        
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }} transition={{ type: "spring", duration: 0.4, bounce: 0.3 }}
          className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative z-10 my-auto">
          
          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800">Edit User</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors">
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

            {/* Status */}
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
            <button onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">Cancel</button>
            <button onClick={() => setSaveConfirmOpen(true)} className="px-5 py-2.5 text-sm font-bold text-white bg-tech-blue-600 hover:bg-tech-blue-700 rounded-xl shadow-sm transition-colors">Save Changes</button>
          </div>
        </motion.div>
      </div>

      {/* Save Confirmation Modal */}
      <AnimatePresence>
        {saveConfirmOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setSaveConfirmOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0.4 }}
              className="bg-white rounded-3xl shadow-xl w-full max-w-sm z-10">
              <div className="p-8 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-5 rotate-3"><Save size={32} /></div>
                <h3 className="text-xl font-extrabold text-slate-800 mb-2">Confirm Save</h3>
                <p className="text-sm font-medium text-slate-500 mb-8">Are you sure you want to save changes to this user?</p>
                <div className="flex gap-3 w-full">
                  <button onClick={() => setSaveConfirmOpen(false)} className="flex-1 px-4 py-3 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">Cancel</button>
                  <button onClick={handleSave} className="flex-1 px-4 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-colors active:scale-95">Yes, Save</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
