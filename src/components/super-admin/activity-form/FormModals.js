import { motion, AnimatePresence } from "framer-motion";
import { Save, FilePlus2, Trash2, X } from "lucide-react";

export default function FormModals({
  saveConfirmOpen, setSaveConfirmOpen,
  saveError, isSubmitting, confirmSave,
  isFieldModalOpen, setIsFieldModalOpen,
  isAddingField, fieldData, setFieldData,
  fieldError, initiateAddField, confirmAddField,
  addFieldConfirmOpen, setAddFieldConfirmOpen,
  deleteConfirmOpen, setDeleteConfirmOpen,
  isDeletingField, fieldToDelete, confirmDeleteField
}) {
  return (
    <AnimatePresence>
      {/* Save Confirmation Modal */}
      {saveConfirmOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setSaveConfirmOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.4 }}
            className="bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden z-10"
          >
            <div className="p-8 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-5 rotate-3">
                <Save size={32} />
              </div>
              <h3 className="text-xl font-extrabold text-slate-800 mb-2">Confirm Save</h3>
              <p className="text-sm font-medium text-slate-500 mb-8 px-2">Are you sure you want to save these changes to the activity form?</p>

              <AnimatePresence>
                {saveError && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="w-full text-sm font-medium text-red-500 bg-red-50 p-2.5 rounded-lg border border-red-100 mb-4"
                  >
                    {saveError}
                  </motion.p>
                )}
              </AnimatePresence>

              <div className="flex gap-3 justify-center w-full">
                <button disabled={isSubmitting} onClick={() => setSaveConfirmOpen(false)} className="flex-1 px-4 py-3 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50">
                  Cancel
                </button>
                <button disabled={isSubmitting} onClick={confirmSave} className="flex-1 px-4 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-colors active:scale-95 disabled:opacity-50 flex justify-center items-center gap-2">
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : "Yes, Save"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add Field Modal */}
      {isFieldModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => !isAddingField && setIsFieldModalOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden z-10 border border-slate-200"
          >
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Add New Field</h3>
                <p className="text-xs font-medium text-slate-500 mt-0.5">Define a new property for this form</p>
              </div>
              <button onClick={() => !isAddingField && setIsFieldModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">Label <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={fieldData.label}
                    onChange={(e) => setFieldData(p => ({ ...p, label: e.target.value, name: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '_') }))}
                    placeholder="e.g. Full Name"
                    className="w-full border border-slate-300 rounded-xl px-4 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">Internal Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={fieldData.name}
                    onChange={(e) => setFieldData(p => ({ ...p, name: e.target.value.replace(/[^a-z0-9_]/g, '') }))}
                    placeholder="e.g. full_name"
                    className="w-full border border-slate-300 rounded-xl px-4 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-slate-800 outline-none bg-slate-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">Field Type <span className="text-red-500">*</span></label>
                  <select
                    value={fieldData.type}
                    onChange={(e) => setFieldData(p => ({ ...p, type: e.target.value }))}
                    className="w-full border border-slate-300 rounded-xl px-4 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-slate-800 outline-none appearance-none"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right .5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                  >
                    <option value="text">Text (Short)</option>
                    <option value="textarea">Textarea (Long)</option>
                    <option value="number">Number</option>
                    <option value="date">Date</option>
                    <option value="dropdown">Dropdown Select</option>
                    <option value="radio">Radio Buttons</option>
                    <option value="checkbox">Checkbox</option>
                    <option value="file">File Upload</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">Required?</label>
                  <label className="flex items-center gap-2 mt-2.5 cursor-pointer">
                    <div className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${fieldData.is_required ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                      <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${fieldData.is_required ? 'translate-x-4' : 'translate-x-0'}`} />
                    </div>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={fieldData.is_required}
                      onChange={(e) => setFieldData(p => ({ ...p, is_required: e.target.checked }))}
                    />
                    <span className="text-sm font-bold text-slate-600 select-none">{fieldData.is_required ? 'Yes' : 'No'}</span>
                  </label>
                </div>
              </div>

              <AnimatePresence>
                {(fieldData.type === 'dropdown' || fieldData.type === 'radio') && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">Options List</label>
                    <input
                      type="text"
                      value={fieldData.options}
                      onChange={(e) => setFieldData(p => ({ ...p, options: e.target.value }))}
                      placeholder="e.g. Option 1, Option 2, Option 3 (comma separated)"
                      className="w-full border border-slate-300 rounded-xl px-4 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-slate-800 outline-none"
                    />
                    <p className="text-[11px] font-medium text-slate-400 mt-1">Separate options using commas.</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {fieldError && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-xs font-bold text-red-500 bg-red-50 p-2 rounded-lg border border-red-100"
                  >
                    {fieldError}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/40 flex items-center justify-end gap-3">
              <button
                disabled={isAddingField}
                onClick={() => setIsFieldModalOpen(false)}
                className="px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                disabled={isAddingField}
                onClick={initiateAddField}
                className="px-4 py-2 text-sm font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-xl shadow-sm transition-all shadow-slate-900/10 disabled:opacity-50 flex items-center gap-2"
              >
                {isAddingField ? (
                  <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Adding...</>
                ) : "Add Field"}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add Field Confirm Modal */}
      {addFieldConfirmOpen && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setAddFieldConfirmOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden z-10"
          >
            <div className="p-6 text-center flex flex-col items-center">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4">
                <FilePlus2 size={28} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Add Field?</h3>
              <p className="text-sm font-medium text-slate-500 mb-6 px-2">Are you sure you want to add the field <span className="font-bold text-slate-700">"{fieldData.label}"</span> to this form?</p>

              <div className="flex gap-3 justify-center w-full">
                <button disabled={isAddingField} onClick={() => setAddFieldConfirmOpen(false)} className="flex-1 px-4 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50">
                  Cancel
                </button>
                <button disabled={isAddingField} onClick={confirmAddField} className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-colors active:scale-95 disabled:opacity-50 flex justify-center items-center gap-2">
                  Confirm Add
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Field Confirm Modal */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => !isDeletingField && setDeleteConfirmOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden z-10"
          >
            <div className="p-6 text-center flex flex-col items-center">
              <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-4">
                <Trash2 size={28} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Delete Field?</h3>
              <p className="text-sm font-medium text-slate-500 mb-6 px-2">Are you sure you want to delete the field <span className="font-bold text-slate-800">"{fieldToDelete?.label || fieldToDelete?.name}"</span>? This action cannot be undone.</p>

              <div className="flex gap-3 justify-center w-full">
                <button disabled={isDeletingField} onClick={() => setDeleteConfirmOpen(false)} className="flex-1 px-4 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50">
                  Cancel
                </button>
                <button disabled={isDeletingField} onClick={confirmDeleteField} className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md transition-colors active:scale-95 disabled:opacity-50 flex justify-center items-center gap-2">
                  {isDeletingField ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Deleting...</>
                  ) : "Delete Field"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
