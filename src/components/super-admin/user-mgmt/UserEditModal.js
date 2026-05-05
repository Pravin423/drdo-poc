import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    X, 
    User, 
    Mail, 
    Phone, 
    Lock, 
    Eye, 
    EyeOff, 
    ImagePlus, 
    Calendar, 
    Users, 
    Shield, 
    Save, 
    CheckCircle2,
    MapPin, 
    Map, 
    Check, 
    ChevronDown, 
    UserCircle,
    UserCircle2,
    Info,
    CheckCircle
} from "lucide-react";
import {
    FormModal,
    FormHeader,
    FormInput,
    FormSelect,
    FormActions,
    FormSection,
    FormError
} from "../../common/FormUI";
import ConfirmationModal from "../../common/ConfirmationModal";

const GENDERS = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" }
];

export default function UserEditModal({ isOpen, user, onClose, onSave }) {
    const fileRef = useRef(null);
    const [form, setForm] = useState(null);
    const [profilePreview, setProfilePreview] = useState(null);
    const [showPass, setShowPass] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [roles, setRoles] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [talukas, setTalukas] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [apiError, setApiError] = useState("");
    const [successOpen, setSuccessOpen] = useState(false);

    // Initialize form with user data
    useEffect(() => {
        if (user && isOpen) {
            setForm({
                ...user,
                role_id: String(user.role_id || ""),
                district_id: String(user.district_id || ""),
                taluka_ids: Array.isArray(user.taluka_id) ? user.taluka_id.map(String) : [],
                password: "", // Keep password empty unless changing
            });
            setProfilePreview(user.profile);
            setApiError("");
        }
    }, [user, isOpen]);

    useEffect(() => {
        if (isOpen) {
            fetchInitialData();
        }
    }, [isOpen]);

    useEffect(() => {
        if (form?.district_id) {
            fetchTalukas(form.district_id);
        } else {
            setTalukas([]);
        }
    }, [form?.district_id]);

    const fetchInitialData = async () => {
        setIsLoadingData(true);
        try {
            const [rolesRes, distRes] = await Promise.all([
                fetch("/api/roles").then(r => r.json()),
                fetch("/api/districts").then(r => r.json())
            ]);
            if (rolesRes.status === 1) setRoles(rolesRes.data.map(r => ({ value: String(r.id), label: r.name })));
            if (distRes.status === 1) setDistricts(distRes.data);
        } finally {
            setIsLoadingData(false);
        }
    };

    const fetchTalukas = async (districtId) => {
        try {
            const res = await fetch(`/api/talukas?district_id=${districtId}`);
            const json = await res.json();
            if (json.status) setTalukas(json.data);
        } catch (err) { console.error(err); }
    };

    const handleTalukaToggle = (id) => {
        const current = form.taluka_ids || [];
        const updated = current.includes(id) ? current.filter(i => i !== id) : [...current, id];
        setForm(f => ({ ...f, taluka_ids: updated }));
    };

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setForm(f => ({ ...f, profile: file }));
        setProfilePreview(URL.createObjectURL(file));
    };

    const handleSubmit = async () => {
        if (!form.fullname || !form.mobile || !form.role_id) {
            setApiError("Required: Name, Mobile, Role");
            return;
        }
        setIsSubmitting(true);
        try {
            const payload = new FormData();
            payload.append("fullname", form.fullname);
            payload.append("mobile", form.mobile);
            payload.append("email", form.email);
            payload.append("gender", form.gender);
            payload.append("role_id", form.role_id);
            if (form.district_id) payload.append("district_id", form.district_id);
            
            form.taluka_ids.forEach(tid => payload.append("taluka_ids", tid));

            if (form.profile instanceof File) {
                payload.append("profile", form.profile);
            }

            const res = await fetch(`/api/user?action=update-user&id=${user.id}`, {
                method: "POST",
                body: payload,
            });

            const result = await res.json();
            if (result.status === 1) {
                onSave();
                setSuccessOpen(true);
            } else {
                setApiError(result.message || "Failed to update user.");
            }
        } catch (err) {
            setApiError("Connection failed.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen || !form) return null;

    return (
        <FormModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-4xl">
            <FormHeader title="Edit User Profile" subtitle={`User ID: ${user.id} • Management Portal`} icon={UserCircle} onClose={onClose} />

            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar overscroll-contain transform-gpu">
                <FormError error={apiError} />

                <div className="space-y-12">
                    <FormSection title="Core Identity" description="Updated user credentials." icon={UserCircle2}>
                        <div className="flex items-center gap-6 mb-4">
                            <div 
                                onClick={() => fileRef.current?.click()}
                                className="w-20 h-20 rounded-[2rem] bg-slate-100 border-2 border-dashed border-slate-200 flex items-center justify-center cursor-pointer hover:bg-slate-200 transition-all overflow-hidden shrink-0"
                            >
                                {profilePreview ? <img src={profilePreview} className="w-full h-full object-cover" /> : <ImagePlus className="text-slate-400" size={24} />}
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-black text-slate-800 uppercase tracking-widest">Update Photo</p>
                                <button type="button" onClick={() => fileRef.current?.click()} className="text-[10px] font-black text-[#3b52ab] uppercase tracking-widest">Choose New Media</button>
                                <input ref={fileRef} type="file" className="hidden" onChange={handleFile} accept="image/*" />
                            </div>
                        </div>

                        <FormInput label="Full Name" icon={User} value={form.fullname} onChange={e => setForm(f => ({ ...f, fullname: e.target.value }))} />
                        
                        <div className="grid grid-cols-2 gap-6">
                            <FormInput label="Mobile Number" icon={Phone} placeholder="10-digit mobile" maxLength={10} value={form.mobile} onChange={e => setForm(f => ({ ...f, mobile: e.target.value.replace(/\D/g, '') }))} />
                            <FormInput label="Email Address" icon={Mail} type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                        </div>
                    </FormSection>

                    <div className="h-px bg-slate-100" />

                    <FormSection title="Role & Authorization" description="Modify access level." icon={Shield}>
                        <div className="grid grid-cols-2 gap-6">
                            <FormSelect label="Assigned Role" icon={Shield} options={roles} value={form.role_id} onChange={e => setForm(f => ({ ...f, role_id: e.target.value }))} />
                            <FormSelect label="Gender" icon={Users} options={GENDERS} value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))} />
                        </div>
                    </FormSection>

                    <div className="h-px bg-slate-100" />

                    <FormSection title="Territory Assignment" description="Geographic operations." icon={MapPin}>
                        <FormSelect label="Active District" icon={Map} options={districts.map(d => ({ value: String(d.id), label: d.distName || d.name }))} value={form.district_id} onChange={e => setForm(f => ({ ...f, district_id: e.target.value }))} />

                        {talukas.length > 0 && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Monitored Talukas ({form.taluka_ids.length})</p>
                                    <button type="button" onClick={() => setForm(f => ({ ...f, taluka_ids: f.taluka_ids.length === talukas.length ? [] : talukas.map(t => String(t.id)) }))} className="text-[10px] font-black text-[#3b52ab] uppercase tracking-widest">
                                        {form.taluka_ids.length === talukas.length ? "Deselect All" : "Select All"}
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-[2rem] max-h-48 overflow-y-auto custom-scrollbar">
                                    {talukas.map(t => (
                                        <button 
                                            key={t.id} 
                                            type="button" 
                                            onClick={() => handleTalukaToggle(String(t.id))} 
                                            className={`p-3 rounded-2xl border-2 text-left transition-all ${form.taluka_ids.includes(String(t.id)) ? "bg-[#3b52ab] border-[#3b52ab] text-white shadow-lg" : "bg-white border-transparent text-slate-600 hover:border-slate-200"}`}
                                        >
                                            <p className="text-[11px] font-black truncate">{t.name}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </FormSection>

                    <FormActions onCancel={onClose} onConfirm={handleSubmit} isLoading={isSubmitting} confirmText="Save Profile" confirmIcon={CheckCircle} />
                </div>
            </div>

            <ConfirmationModal isOpen={successOpen} onClose={() => { setSuccessOpen(false); onClose(); }} title="Profile Updated" message="The user profile has been successfully synchronized." type="success" />
        </FormModal>
    );
}
