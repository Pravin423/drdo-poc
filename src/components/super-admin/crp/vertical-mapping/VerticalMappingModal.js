import { motion, AnimatePresence } from "framer-motion";
import { X, Users, Link, ShieldCheck, Activity, AlertCircle, Layers } from "lucide-react";
import { FormModal, FormHeader, FormSelect, FormActions } from "@/components/common/FormUI";

export default function VerticalMappingModal({
  isOpen,
  onClose,
  title,
  crps,
  verticals,
  formData,
  setFormData,
  onSave,
  isSaving,
  apiError,
  saveLabel = "Save Mapping",
}) {
  const crpOptions = crps.map((crp) => ({
    value: crp.id || crp.crp_id,
    label: crp.fullname || crp.name || `CRP ${crp.id}`,
  }));

  const verticalOptions = verticals.map((v) => ({
    value: v.id || v.vertical_id,
    label: v.title || v.name || v.vertical_name || `Vertical ${v.id}`,
  }));

  const statusOptions = [
    { value: 0, label: "Active" },
    { value: 1, label: "Inactive" },
  ];

  return (
    <FormModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-xl">
        <FormHeader 
            title={title}
            subtitle="Link a Community Resource Person to a Program Vertical"
            icon={Layers}
            onClose={onClose}
        />

        <div className="p-6 space-y-6">
            {/* Error banner */}
            {apiError && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-rose-50 text-rose-600 px-4 py-3 rounded-2xl border border-rose-100 text-sm font-bold flex items-center gap-3 shadow-sm shadow-rose-100/50"
                >
                    <AlertCircle size={18} className="shrink-0" />
                    <span>{apiError}</span>
                </motion.div>
            )}

            {/* Descriptive Card */}
            <div className="p-5 rounded-[24px] bg-slate-50 border border-slate-100 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-indigo-500 shadow-sm shrink-0">
                    <Link size={18} />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-slate-800">Vertical Assignment</h4>
                    <p className="text-[12px] text-slate-500 mt-1 leading-relaxed">
                        Assign this CRP to a specific program vertical. This connection enables them to perform tasks and monitor activities within that vertical's domain.
                    </p>
                </div>
            </div>

            <div className="space-y-5">
                <FormSelect
                    label="Select Community Resource Person"
                    icon={Users}
                    value={formData.crpuser}
                    onChange={(e) => setFormData({ ...formData, crpuser: e.target.value })}
                    options={crpOptions}
                    placeholder="Choose a CRP..."
                />

                <FormSelect
                    label="Select Program Vertical"
                    icon={Layers}
                    value={formData.vertical_id}
                    onChange={(e) => setFormData({ ...formData, vertical_id: e.target.value })}
                    options={verticalOptions}
                    placeholder="Choose a Vertical..."
                />

                <FormSelect
                    label="Mapping Status"
                    icon={Activity}
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: Number(e.target.value) })}
                    options={statusOptions}
                />
            </div>
        </div>

        <div className="p-6 bg-slate-50/50 border-t border-slate-100">
            <FormActions 
                onCancel={onClose}
                onConfirm={onSave}
                isLoading={isSaving}
                confirmLabel={saveLabel}
                loadingLabel="Mapping Vertical..."
            />
        </div>
    </FormModal>
  );
}

