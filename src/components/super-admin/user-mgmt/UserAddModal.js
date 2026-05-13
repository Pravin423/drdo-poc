import React, { useState, useRef, useEffect } from "react";
import { 
    X, 
    UserPlus, 
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
    FormError,
    FormCheckbox
} from "../../common/FormUI";
import ConfirmationModal from "../../common/ConfirmationModal";

const GENDERS = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" }
];

const EMPTY = {
    fullname: "",
    mobile: "",
    password: "",
    email: "",
    gender: "Male",
    role_id: "",
    date_of_birth: "",
    profile: null,
    district_id: "",
    taluka_ids: [],
};

export default function UserAddModal({ isOpen, onClose, onUserAdded }) {
    const fileRef = useRef(null);
    const [form, setForm] = useState(EMPTY);
    const [profilePreview, setProfilePreview] = useState(null);
    const [showPass, setShowPass] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [roles, setRoles] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [talukas, setTalukas] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [apiError, setApiError] = useState("");
    const [successOpen, setSuccessOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchInitialData();
        }
    }, [isOpen]);

    useEffect(() => {
        if (form.district_id) {
            fetchTalukas(form.district_id);
        } else {
            setTalukas([]);
        }
    }, [form.district_id]);

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

    const selectedRoleObj = roles.find(r => String(r.value) === String(form?.role_id));
    const isSingleTaluka = (selectedRoleObj?.label || "").toLowerCase().includes("block program manager");

    // If the user switches to a single-taluka role, auto-prune to 1 taluka
    useEffect(() => {
        if (isSingleTaluka && form?.taluka_ids?.length > 1) {
            const first = form.taluka_ids.find(id => id !== undefined);
            setForm(f => ({ ...f, taluka_ids: first ? [first] : [] }));
        }
    }, [isSingleTaluka, form?.role_id]);

    const handleTalukaToggle = (id) => {
        const current = form.taluka_ids || [];
        if (isSingleTaluka) {
            // For single-taluka roles, behave as a radio button group: 
            // clicking an unselected one selects ONLY it, clicking it again clears it.
            setForm(f => ({ ...f, taluka_ids: current.includes(id) ? [] : [id] }));
        } else {
            // Traditional multi-select checkbox group logic
            const updated = current.includes(id) ? current.filter(i => i !== id) : [...current, id];
            setForm(f => ({ ...f, taluka_ids: updated }));
        }
    };

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            setApiError("Profile photo must be under 2MB.");
            return;
        }
        setForm(f => ({ ...f, profile: file }));
        setProfilePreview(URL.createObjectURL(file));
        setApiError("");
    };

    const handleSubmit = async () => {
        if (!form.fullname || !form.mobile || !form.role_id) {
            setApiError("Required: Name, Mobile, Role");
            return;
        }
        setIsSubmitting(true);
        try {
            const payload = new FormData();
            Object.entries(form).forEach(([key, val]) => {
                if (key === 'taluka_ids') {
                    val.forEach((id, idx) => payload.append(`taluka_id[${idx}]`, id));
                } else if (key === 'profile') {
                    if (val) payload.append("profile", val);
                } else if (val) {
                    payload.append(key === 'date_of_birth' ? 'dob' : key, val);
                }
            });

            const res = await fetch("/api/user?action=add-user", { method: "POST", body: payload });
            const result = await res.json();
            if (result.status === 1 || result.status === true) {
                onUserAdded();
                setSuccessOpen(true);
                setForm(EMPTY);
                setProfilePreview(null);
            } else {
                setApiError(result.message || "Failed to add user.");
            }
        } catch (err) {
            setApiError("Connection failed.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <FormModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-4xl">
            <FormHeader title="Register New User" subtitle="Portal Management System • Phase 4" icon={UserPlus} onClose={onClose} />

            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar overscroll-contain transform-gpu">
                <FormError error={apiError} />

                <div className="space-y-12">
                    <FormSection title="Account Identity" description="Basic user information." icon={UserCircle2}>
                        <div className="flex items-center gap-6 mb-4">
                            <div 
                                onClick={() => fileRef.current?.click()}
                                className="w-20 h-20 rounded-[2rem] bg-slate-100 border-2 border-dashed border-slate-200 flex items-center justify-center cursor-pointer hover:bg-slate-200 transition-all overflow-hidden shrink-0"
                            >
                                {profilePreview ? <img src={profilePreview} className="w-full h-full object-cover" /> : <ImagePlus className="text-slate-400" size={24} />}
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-black text-slate-800 uppercase tracking-widest">Profile Photo *</p>
                                <p className="text-[10px] font-bold text-slate-400 leading-tight">JPG or PNG. Max 2MB recommended.</p>
                                <input ref={fileRef} type="file" className="hidden" onChange={handleFile} accept="image/*" />
                            </div>
                        </div>

                        <FormInput label="Full Name *" icon={User} placeholder="Enter full name" value={form.fullname} onChange={e => setForm(f => ({ ...f, fullname: e.target.value }))} />
                        
                        <div className="grid grid-cols-2 gap-6">
                            <FormInput label="Mobile Number *" icon={Phone} placeholder="10-digit mobile" maxLength={10} value={form.mobile} onChange={e => setForm(f => ({ ...f, mobile: e.target.value.replace(/\D/g, '') }))} />
                            <FormInput label="Email Address *" icon={Mail} type="email" placeholder="user@dgoa.gov.in" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="relative group">
                                <FormInput label="Access Password *" icon={Lock} type={showPass ? "text" : "password"} placeholder="Minimum 8 chars" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
                                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 bottom-3 text-slate-400 hover:text-[#3b52ab] transition-colors p-1">
                                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            <FormInput label="Date of Birth *" icon={Calendar} type="date" value={form.date_of_birth} onChange={e => setForm(f => ({ ...f, date_of_birth: e.target.value }))} />
                        </div>
                    </FormSection>

                    <div className="h-px bg-slate-100" />

                    <FormSection title="Role & Access" description="Determine permissions." icon={Shield}>
                        <div className="grid grid-cols-2 gap-6">
                            <FormSelect label="Assigned Role *" icon={Shield} options={roles} value={form.role_id} onChange={e => setForm(f => ({ ...f, role_id: e.target.value }))} />
                            <FormSelect label="Gender *" icon={Users} options={GENDERS} value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))} />
                        </div>
                    </FormSection>

                    <div className="h-px bg-slate-100" />

                    <FormSection title="Geographic Assignment" description="Select operations area." icon={MapPin}>
                        <FormSelect label="Assigned District" icon={Map} options={districts.map(d => ({ value: String(d.id), label: d.distName || d.name }))} value={form.district_id} onChange={e => setForm(f => ({ ...f, district_id: e.target.value }))} />

                        {talukas.length > 0 && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Assigned Talukas ({form.taluka_ids.length})</p>
                                    {!isSingleTaluka && (
                                        <button type="button" onClick={() => setForm(f => ({ ...f, taluka_ids: f.taluka_ids.length === talukas.length ? [] : talukas.map(t => String(t.id)) }))} className="text-[10px] font-black text-[#3b52ab] uppercase tracking-widest">
                                            {form.taluka_ids.length === talukas.length ? "Deselect All" : "Select All"}
                                        </button>
                                    )}
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

                    <FormActions onCancel={onClose} onConfirm={handleSubmit} isLoading={isSubmitting} confirmText="Register User" confirmIcon={CheckCircle} />
                </div>
            </div>

            <ConfirmationModal isOpen={successOpen} onClose={() => { setSuccessOpen(false); onClose(); }} title="Success" message="The user account has been successfully registered." type="success" />
        </FormModal>
    );
}
