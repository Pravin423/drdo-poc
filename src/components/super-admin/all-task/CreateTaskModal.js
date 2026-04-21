import { useState, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ListTodo, X, AlertCircle, ChevronDown } from "lucide-react";

const CreateTaskModal = memo(function CreateTaskModal({ formData, handleInputChange, handleCreateTask, handleClearForm, onClose, apiError }) {
  const [taskCreationData, setTaskCreationData] = useState({ forms: [], crps: [], verticals: [] });
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "unset"; };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setDataLoading(true);
        const res = await fetch("/api/activity-form-list");
        const result = await res.json();
        const d = result?.data || {};
        setTaskCreationData({
          forms: Array.isArray(d.forms) ? d.forms : [],
          crps: Array.isArray(d.crps) ? d.crps : [],
          verticals: Array.isArray(d.verticals) ? d.verticals : [],
        });
      } catch (err) {
        console.error("Failed to fetch task creation data", err);
      } finally {
        setDataLoading(false);
      }
    };
    fetchData();
  }, []);

  const fieldClass = "w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white placeholder:text-slate-400";
  const selectClass = `${fieldClass} appearance-none disabled:opacity-60`;
  const labelClass = "block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 24 }}
        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
      >

        {/* ── Dark Header ── */}
        <div className="bg-[#0f1c3f] px-6 py-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
              <ListTodo size={22} className="text-white" />
            </div>
            <div>
              <h2 className="text-[17px] font-bold text-white leading-tight">Assign New Activity Task</h2>
              <p className="text-[12px] text-slate-400 mt-0.5">Fill in the details to create and assign a task</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* ── Scrollable Body ── */}
        <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
          {apiError && (
            <div className="bg-red-50 text-red-600 px-6 py-4 border-b border-red-100 text-sm font-semibold flex items-start gap-3">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{apiError}</span>
            </div>
          )}

          {/* Section 1 — Task Details */}
          <div className="grid grid-cols-[200px_1fr] gap-8 px-6 py-6">
            <div>
              <p className="text-[14px] font-bold text-slate-800">Task Details</p>
              <p className="text-[12px] text-slate-400 mt-1 leading-relaxed">Core information and type of the task being created.</p>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Task Name <span className="text-red-500">*</span></label>
                  <input type="text" name="taskName" value={formData.taskName} onChange={handleInputChange} placeholder="e.g. Field Survey" className={fieldClass} />
                </div>
                <div>
                  <label className={labelClass}>Task Type <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select name="taskType" value={formData.taskType} onChange={handleInputChange} className={selectClass}>
                      <option value="SPECIAL">SPECIAL</option>
                      <option value="REGULAR">REGULAR</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
              <div>
                <label className={labelClass}>Task Description <span className="text-red-500">*</span></label>
                <textarea name="taskDescription" value={formData.taskDescription} onChange={handleInputChange} rows="3" placeholder="Brief description of the task..." className={`${fieldClass} resize-none`} />
              </div>
            </div>
          </div>

          {/* Section 2 — Schedule & Form */}
          <div className="grid grid-cols-[200px_1fr] gap-8 px-6 py-6">
            <div>
              <p className="text-[14px] font-bold text-slate-800">Schedule & Form</p>
              <p className="text-[12px] text-slate-400 mt-1 leading-relaxed">Set the timeline and link the activity form.</p>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Start Date <span className="text-red-500">*</span></label>
                  <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} className={fieldClass} />
                </div>
                <div>
                  <label className={labelClass}>End Date <span className="text-red-500">*</span></label>
                  <input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} className={fieldClass} />
                </div>
              </div>
              <div className={formData.taskType === "SPECIAL" ? "grid grid-cols-2 gap-4" : ""}>
                <div>
                  <label className={labelClass}>Activity Form <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select name="activityForm" value={formData.activityForm} onChange={handleInputChange} disabled={dataLoading} className={selectClass}>
                      <option value="">{dataLoading ? "Loading..." : "Choose form..."}</option>
                      {taskCreationData.forms.map((form) => (
                        <option key={form.id} value={form.id}>{form.form_name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                {formData.taskType === "SPECIAL" && (
                  <div>
                    <label className={labelClass}>Honorarium Amount (₹)</label>
                    <input type="number" name="honorariumAmount" value={formData.honorariumAmount} onChange={handleInputChange} placeholder="0" className={fieldClass} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 3 — Location */}
          <div className="grid grid-cols-[200px_1fr] gap-8 px-6 py-6">
            <div>
              <p className="text-[14px] font-bold text-slate-800">Location Settings</p>
              <p className="text-[12px] text-slate-400 mt-1 leading-relaxed">Specify where this task operates geographically.</p>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Latitude <span className="text-red-500">*</span></label>
                  <input type="text" name="latitude" value={formData.latitude} onChange={handleInputChange} placeholder="e.g. 15.2993" className={fieldClass} />
                </div>
                <div>
                  <label className={labelClass}>Longitude <span className="text-red-500">*</span></label>
                  <input type="text" name="longitude" value={formData.longitude} onChange={handleInputChange} placeholder="e.g. 74.1240" className={fieldClass} />
                </div>
              </div>
              <div className="w-1/2 pr-2">
                <label className={labelClass}>Radius (Meters) <span className="text-red-500">*</span></label>
                <input type="text" name="radius" value={formData.radius} onChange={handleInputChange} placeholder="e.g. 100" className={fieldClass} />
              </div>
            </div>
          </div>

          {/* Section 4 — Assignment */}
          <div className="grid grid-cols-[200px_1fr] gap-8 px-6 py-6">
            <div>
              <p className="text-[14px] font-bold text-slate-800">Assignment</p>
              <p className="text-[12px] text-slate-400 mt-1 leading-relaxed">
                {formData.taskType === "SPECIAL" ? "Assign directly to a specific CRP." : "Link to a vertical for auto-assignment."}
              </p>
            </div>
            <div>
              {formData.taskType === "SPECIAL" ? (
                <div>
                  <label className={labelClass}>Assign to CRP <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select name="assignToCrp" value={formData.assignToCrp} onChange={handleInputChange} disabled={dataLoading} className={selectClass}>
                      <option value="">{dataLoading ? "Loading..." : "Choose CRP..."}</option>
                      {taskCreationData.crps.map((crp) => (
                        <option key={crp.id} value={crp.id}>{crp.fullname} ({crp.crp_id})</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              ) : (
                <div>
                  <label className={labelClass}>Vertical <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select name="vertical_id" value={formData.vertical_id} onChange={handleInputChange} disabled={dataLoading} className={selectClass}>
                      <option value="">{dataLoading ? "Loading..." : "Choose Vertical..."}</option>
                      {taskCreationData.verticals.map((v) => (
                        <option key={v.id} value={v.id}>{v.vertical_name} ({v.vertical_code})</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* ── Footer ── */}
        <div className="px-6 py-4 bg-white border-t border-slate-100 flex justify-end gap-3 shrink-0">
          <button
            onClick={() => { handleClearForm(); onClose(); }}
            className="px-5 py-2.5 text-[13px] font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateTask}
            className="px-6 py-2.5 text-[13px] font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            Assign Task
          </button>
        </div>
      </motion.div>
    </div>
  );
});

export default CreateTaskModal;
