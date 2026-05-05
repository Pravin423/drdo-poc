"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Users, Home, Activity, MapPin } from "lucide-react";
import { FormModal, FormHeader, FormSelect, FormActions } from "@/components/common/FormUI";

export default function VillageMappingModal({
  isOpen,
  onClose,
  title,
  crps,
  shgs,
  formData,
  setFormData,
  onSave,
  isSaving,
  saveLabel = "Save Mapping",
}) {
  const crpOptions = crps.map((crp) => ({
    value: crp.crp_id || crp.id || crp._id,
    label: crp.fullname || crp.fullName || crp.name || crp.full_name || crp.employeeName || `CRP ${crp.crp_id || crp.id}`,
  }));

  const shgOptions = shgs.map((shg) => ({
    value: shg.shg_id || shg.id || shg._id,
    label: shg.shg_name || shg.name || shg.shgName || `SHG ${shg.shg_id || shg.id}`,
  }));

  const statusOptions = [
    { value: 0, label: "Active" },
    { value: 1, label: "Inactive" },
  ];

  return (
    <FormModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-xl">
        <FormHeader 
            title={title}
            subtitle="Map a CRP to a village via SHG association"
            icon={MapPin}
            onClose={onClose}
        />

        <div className="p-6 space-y-6">
            {/* Descriptive Card */}
            <div className="p-5 rounded-[24px] bg-slate-50 border border-slate-100 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-indigo-500 shadow-sm shrink-0">
                    <Home size={18} />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-slate-800">Village Mapping Logic</h4>
                    <p className="text-[12px] text-slate-500 mt-1 leading-relaxed">
                        By mapping a CRP to an SHG, you automatically assign them to the village where that SHG is registered. Ensure the SHG data is correct before linking.
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
                    label="Select Target SHG"
                    icon={Home}
                    value={formData.shggroup}
                    onChange={(e) => setFormData({ ...formData, shggroup: e.target.value })}
                    options={shgOptions}
                    placeholder="Choose an SHG..."
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
                loadingLabel="Mapping Village..."
            />
        </div>
    </FormModal>
  );
}

