"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users, Home, Activity, MapPin, Map, Check } from "lucide-react";
import { FormModal, FormHeader, FormSelect, FormActions } from "@/components/common/FormUI";

export default function VillageMappingModal({
  isOpen,
  onClose,
  title,
  crps,
  formData,
  setFormData,
  onSave,
  isSaving,
  saveLabel = "Save Mapping",
}) {
  const [districts, setDistricts] = useState([]);
  const [talukas, setTalukas] = useState([]);
  const [villages, setVillages] = useState([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);

  const crpOptions = crps.map((crp) => ({
    value: crp.crp_id || crp.id || crp._id,
    label: crp.fullname || crp.fullName || crp.name || crp.full_name || crp.employeeName || `CRP ${crp.crp_id || crp.id}`,
  }));

  useEffect(() => {
    if (isOpen) {
      fetchDistricts();
    }
  }, [isOpen]);

  useEffect(() => {
    if (formData.district_id) {
      fetchTalukas(formData.district_id);
    } else {
      setTalukas([]);
      setVillages([]);
    }
  }, [formData.district_id]);

  useEffect(() => {
    if (formData.taluka_id) {
      fetchVillages(formData.taluka_id);
    } else {
      setVillages([]);
    }
  }, [formData.taluka_id]);

  const fetchDistricts = async () => {
    try {
      setIsLoadingLocations(true);
      const res = await fetch("/api/districts");
      const data = await res.json();
      if (data.status === 1 || data.status === true) {
        setDistricts(data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch districts", err);
    } finally {
      setIsLoadingLocations(false);
    }
  };

  const fetchTalukas = async (districtId) => {
    try {
      const res = await fetch(`/api/talukas?district_id=${districtId}`);
      const data = await res.json();
      if (data.status === 1 || data.status === true) {
        setTalukas(data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch talukas", err);
    }
  };

  const fetchVillages = async (talukaId) => {
    try {
      const res = await fetch(`/api/villages?taluka_id=${talukaId}`);
      const data = await res.json();
      if (data.status === 1 || data.status === true) {
        setVillages(data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch villages", err);
    }
  };

  const handleVillageToggle = (villageId) => {
    const current = formData.village_ids || [];
    const updated = current.includes(Number(villageId))
      ? current.filter((id) => id !== Number(villageId))
      : [...current, Number(villageId)];
    setFormData((prev) => ({ ...prev, village_ids: updated }));
  };

  const districtOptions = districts.map((d) => ({
    value: String(d.id),
    label: d.distName || d.name || `District ${d.id}`,
  }));

  const talukaOptions = talukas.map((t) => ({
    value: String(t.id),
    label: t.name || `Taluka ${t.id}`,
  }));

  return (
    <FormModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-2xl">
      <FormHeader
        title={title}
        subtitle="Directly map a CRP to one or more villages"
        icon={MapPin}
        onClose={onClose}
      />

      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar overscroll-contain transform-gpu">
        <div className="space-y-6">
          {/* Descriptive Card */}
          <div className="p-5 rounded-[24px] bg-slate-50 border border-slate-100 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-indigo-500 shadow-sm shrink-0">
              <Map size={18} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">Direct Village Mapping</h4>
              <p className="text-[12px] text-slate-500 mt-1 leading-relaxed">
                Select a Community Resource Person, then select the target District and Taluka. You can map the CRP to multiple villages at once.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <FormSelect
              label="Select Community Resource Person *"
              icon={Users}
              value={formData.crp_id}
              onChange={(e) => setFormData({ ...formData, crp_id: e.target.value })}
              options={crpOptions}
              placeholder="Choose a CRP..."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormSelect
                label="Select District *"
                icon={Map}
                value={formData.district_id}
                onChange={(e) => setFormData({ ...formData, district_id: e.target.value, taluka_id: "", village_ids: [] })}
                options={districtOptions}
                placeholder="Choose a district..."
              />

              <FormSelect
                label="Select Taluka *"
                icon={MapPin}
                value={formData.taluka_id}
                disabled={!formData.district_id}
                onChange={(e) => setFormData({ ...formData, taluka_id: e.target.value, village_ids: [] })}
                options={talukaOptions}
                placeholder={formData.district_id ? "Choose a taluka..." : "First select district"}
              />
            </div>

            {/* Multi-select Villages */}
            {formData.taluka_id && villages.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-800 uppercase tracking-widest">
                    Select Target Villages * ({formData.village_ids?.length || 0} selected)
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        village_ids:
                          (prev.village_ids?.length === villages.length)
                            ? []
                            : villages.map((v) => Number(v.id)),
                      }))
                    }
                    className="text-[10px] font-black text-[#3b52ab] uppercase tracking-widest hover:underline"
                  >
                    {(formData.village_ids?.length === villages.length) ? "Deselect All" : "Select All"}
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-[2rem] max-h-64 overflow-y-auto custom-scrollbar border border-slate-100">
                  {villages.map((v) => {
                    const isSelected = formData.village_ids?.includes(Number(v.id));
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => handleVillageToggle(v.id)}
                        className={`p-3 rounded-2xl border-2 text-left transition-all active:scale-95 ${
                          isSelected
                            ? "bg-[#3b52ab] border-[#3b52ab] text-white shadow-md"
                            : "bg-white border-transparent text-slate-600 hover:border-slate-200 shadow-sm"
                        }`}
                      >
                        <p className="text-[11px] font-black truncate">{v.name || v.villageName || v.village}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {formData.taluka_id && villages.length === 0 && (
              <p className="text-xs font-semibold text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-100 text-center">
                No villages found for the selected taluka.
              </p>
            )}
          </div>
          
          <FormActions
            onCancel={onClose}
            onConfirm={onSave}
            isLoading={isSaving}
            confirmText={saveLabel}
            confirmIcon={Check}
          />
        </div>
      </div>
    </FormModal>
  );
}
