import React, { useState, useEffect, useMemo } from "react";
import { 
    Calendar, 
    X, 
    ChevronDown, 
    User, 
    Users, 
    MapPin, 
    Globe, 
    Navigation, 
    Search, 
    Check, 
    Plus, 
    AlertCircle,
    Tag,
    Clock,
    FileText,
    CheckCircle2
} from "lucide-react";
import {
    FormModal,
    FormHeader,
    FormInput,
    FormSelect,
    FormTextArea,
    FormActions,
    FormSection,
    FormCheckbox,
    FormError
} from "../../common/FormUI";

export default function CreateEventModal({ isOpen, onClose, onSave }) {
    const [options, setOptions] = useState({
        crps: [],
        shgs: [],
        coordinators: [],
        verticals: [],
        districts: [],
        talukas: [],
        villages: [],
        event_types: []
    });

    const [formData, setFormData] = useState({
        title: "",
        type: "meeting",
        vertical_id: "",
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        location: "",
        latitude: "19.13582",
        longitude: "72.83120",
        district_id: "",
        taluka_id: "",
        village_id: "",
        crp_participants: [],
        shg_participants: [],
        primary_coordinator_id: "",
        secondary_coordinator_id: "",
        description: ""
    });

    const [confirmChecked, setConfirmChecked] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDetectingLocation, setIsDetectingLocation] = useState(false);
    const [searchTerms, setSearchTerms] = useState({ crp: "", shg: "" });
    const [formError, setFormError] = useState("");

    const handleGetLocation = () => {
        if (!navigator.geolocation) return;
        setIsDetectingLocation(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                setFormData(prev => ({ ...prev, latitude: latitude.toString(), longitude: longitude.toString() }));
                setIsDetectingLocation(false);
            },
            () => setIsDetectingLocation(false)
        );
    };

    const filteredCrps = useMemo(() => {
        const term = searchTerms.crp.toLowerCase();
        return (options.crps || []).filter(c => c.fullname.toLowerCase().includes(term));
    }, [options.crps, searchTerms.crp]);

    const filteredShgs = useMemo(() => {
        const term = searchTerms.shg.toLowerCase();
        return (options.shgs || []).filter(s => {
            const name = (s.name || s.shg_name || "").toLowerCase();
            return name.includes(term);
        });
    }, [options.shgs, searchTerms.shg]);

    useEffect(() => {
        if (isOpen) {
            fetch("/api/districts").then(r => r.json()).then(d => setOptions(prev => ({ ...prev, districts: d.data || [] })));
            fetch("/api/events?action=create-options").then(r => r.json()).then(r => {
                if (r.status === 1) setOptions(prev => ({ ...prev, ...r.data }));
            });
        }
    }, [isOpen]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const toggleParticipant = (type, id) => {
        const field = type === "crp" ? "crp_participants" : "shg_participants";
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].includes(id) ? prev[field].filter(i => i !== id) : [...prev[field], id]
        }));
    };

    const handleSubmit = async () => {
        if (!formData.title || !formData.startDate || !formData.vertical_id) {
            setFormError("Required: Title, Vertical, Start Date");
            return;
        }
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/events", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            if ((await res.json()).status === 1) { onSave(); onClose(); }
        } finally { setIsSubmitting(false); }
    };

    return (
        <FormModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-5xl">
            <FormHeader title="Schedule New Event" subtitle="Portal Management System • Phase 4" icon={Calendar} onClose={onClose} />

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar overscroll-contain transform-gpu">
                <FormError error={formError} />

                <div className="space-y-10">
                    <FormSection title="Event Identity" description="Basic purpose." icon={Tag}>
                        <FormInput label="Event Title *" placeholder="e.g., Financial Literacy Workshop" value={formData.title} onChange={e => handleChange("title", e.target.value)} />
                        <div className="grid grid-cols-2 gap-4">
                            <FormSelect label="Vertical *" options={(options.verticals || []).map(v => ({ value: v.id, label: v.name }))} value={formData.vertical_id} onChange={e => handleChange("vertical_id", e.target.value)} />
                            <FormSelect label="Event Type *" options={(options.types || []).map(t => ({ value: t.id, label: t.name }))} value={formData.type} onChange={e => handleChange("type", e.target.value)} />
                        </div>
                    </FormSection>

                    <div className="h-px bg-slate-100" />

                    <FormSection title="Schedule & Venue" description="Define when and where." icon={Clock}>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <FormInput label="Start Date *" type="date" value={formData.startDate} onChange={e => handleChange("startDate", e.target.value)} />
                            <FormInput label="End Date" type="date" value={formData.endDate} onChange={e => handleChange("endDate", e.target.value)} />
                            <FormInput label="Starts *" type="time" value={formData.startTime} onChange={e => handleChange("startTime", e.target.value)} />
                            <FormInput label="Ends *" type="time" value={formData.endTime} onChange={e => handleChange("endTime", e.target.value)} />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <FormSelect label="District" options={(options.districts || []).map(d => ({ value: d.id, label: d.name }))} value={formData.district_id} onChange={e => handleChange("district_id", e.target.value)} />
                            <FormSelect label="Taluka" options={[]} />
                            <FormSelect label="Village" options={[]} />
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Venue Details *</label>
                                <button onClick={handleGetLocation} className="text-[10px] font-black text-[#3b52ab] uppercase tracking-widest flex items-center gap-2">
                                    <Navigation size={12} className="rotate-45" /> Detect GPS
                                </button>
                            </div>
                            <FormInput icon={MapPin} placeholder="Address or coordinates" value={formData.location} onChange={e => handleChange("location", e.target.value)} />
                        </div>
                    </FormSection>

                    <div className="h-px bg-slate-100" />

                    <FormSection title="Human Resources" description="Assign leads." icon={Users}>
                        <div className="grid grid-cols-2 gap-4">
                            <FormSelect label="Primary Lead" options={(options.coordinators || []).map(c => ({ value: c.id, label: c.fullname }))} value={formData.primary_coordinator_id} onChange={e => handleChange("primary_coordinator_id", e.target.value)} />
                            <FormSelect label="Secondary Lead" options={(options.coordinators || []).map(c => ({ value: c.id, label: c.fullname }))} value={formData.secondary_coordinator_id} onChange={e => handleChange("secondary_coordinator_id", e.target.value)} />
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">CRP ({formData.crp_participants.length})</span>
                                <div className="relative w-40">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                                    <input type="text" placeholder="Search..." className="w-full pl-8 pr-3 py-1.5 bg-slate-50 rounded-xl text-[11px] outline-none border-2 border-transparent focus:border-[#3b52ab] transition-all" value={searchTerms.crp} onChange={e => setSearchTerms(prev => ({ ...prev, crp: e.target.value }))} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl max-h-40 overflow-y-auto custom-scrollbar">
                                {filteredCrps.map(c => (
                                    <button key={c.id} type="button" onClick={() => toggleParticipant("crp", c.id)} className={`p-2.5 rounded-xl border-2 text-left transition-all ${formData.crp_participants.includes(c.id) ? "bg-[#3b52ab] border-[#3b52ab] text-white shadow-md" : "bg-white border-transparent text-slate-600 hover:border-slate-200"}`}>
                                        <p className="text-[10px] font-black truncate">{c.fullname}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">SHG ({formData.shg_participants.length})</span>
                                <div className="relative w-40">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                                    <input type="text" placeholder="Search..." className="w-full pl-8 pr-3 py-1.5 bg-slate-50 rounded-xl text-[11px] outline-none border-2 border-transparent focus:border-[#3b52ab] transition-all" value={searchTerms.shg} onChange={e => setSearchTerms(prev => ({ ...prev, shg: e.target.value }))} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl max-h-40 overflow-y-auto custom-scrollbar">
                                {filteredShgs.map(s => (
                                    <button key={s.id} type="button" onClick={() => toggleParticipant("shg", s.id)} className={`p-2.5 rounded-xl border-2 text-left transition-all ${formData.shg_participants.includes(s.id) ? "bg-emerald-600 border-emerald-600 text-white shadow-md" : "bg-white border-transparent text-slate-600 hover:border-slate-200"}`}>
                                        <p className="text-[10px] font-black truncate">{s.name || s.shg_name}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </FormSection>

                    <FormTextArea label="Description" rows={3} value={formData.description} onChange={e => handleChange("description", e.target.value)} />
                    <FormCheckbox label="I verify that all logistics are finalized." checked={confirmChecked} onChange={setConfirmChecked} />
                    <FormActions onCancel={onClose} onConfirm={handleSubmit} isLoading={isSubmitting} confirmDisabled={!confirmChecked} confirmText="Schedule Event" confirmIcon={CheckCircle2} />
                </div>
            </div>
        </FormModal>
    );
}
