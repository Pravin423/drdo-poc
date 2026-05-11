import React, { useState, useEffect, useMemo, useRef } from "react";
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
        latitude: "",
        longitude: "",
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
    const [fieldErrors, setFieldErrors] = useState({});
    const scrollRef = useRef(null);

    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            setFormError("Geolocation is not supported by this browser.");
            return;
        }
        setIsDetectingLocation(true);
        setFormError("");
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                const coordString = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
                setFormData(prev => ({
                    ...prev,
                    latitude: latitude.toString(),
                    longitude: longitude.toString(),
                    // Also populate the visible address field so the user sees feedback
                    location: prev.location || coordString
                }));
                setIsDetectingLocation(false);
            },
            (err) => {
                console.error("[GPS] Error:", err);
                setFormError(
                    err.code === 1
                        ? "Location permission denied. Please allow location access in your browser and try again."
                        : "Unable to detect location. Please enter the address manually."
                );
                setIsDetectingLocation(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
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
            // Fetch districts
            fetch("/api/districts")
                .then(r => r.json())
                .then(d => setOptions(prev => ({ ...prev, districts: d.data || [] })))
                .catch(err => console.error("[CreateEventModal] districts fetch failed:", err));

            // Fetch verticals — log first item to confirm real field names
            fetch("/api/vertical-list")
                .then(r => r.json())
                .then(res => {
                    const data = Array.isArray(res) ? res : (res.data || []);
                    if (data.length > 0) console.log("[CreateEventModal] vertical sample:", data[0]);
                    setOptions(prev => ({ ...prev, verticals: data }));
                })
                .catch(err => console.error("[CreateEventModal] vertical-list fetch failed:", err));

            // Fetch create-options — log raw data to confirm CRP/SHG/coordinator keys
            fetch("/api/events?action=create-options")
                .then(r => r.json())
                .then(r => {
                    console.log("[CreateEventModal] create-options raw data:", r.data);
                    if (r.status === 1) {
                        const d = r.data;
                        setOptions(prev => ({
                            ...prev,
                            // Explicit multi-key fallbacks for each list
                            crps: d.crps || d.community_resource_persons || d.crp_list || [],
                            shgs: d.shgs || d.self_help_groups || d.shg_list || [],
                            coordinators: d.coordinators || d.coordinator_list || d.users || [],
                            event_types: d.event_types || d.types || [],
                            types: d.types || d.event_types || [],
                        }));
                    } else {
                        console.warn("[CreateEventModal] create-options returned non-1 status:", r);
                    }
                })
                .catch(err => console.error("[CreateEventModal] create-options fetch failed:", err));

            // Coordinator fallback: fetch separately in case create-options fails
            fetch("/api/coordinators")
                .then(r => r.json())
                .then(r => {
                    const list = r.data || r.coordinators || [];
                    if (list.length > 0) {
                        setOptions(prev => ({
                            ...prev,
                            coordinators: prev.coordinators.length > 0 ? prev.coordinators : list
                        }));
                    }
                })
                .catch(() => { /* /api/coordinators may not exist — that's OK */ });
        }
    }, [isOpen]);

    // Issue 1 — Taluka cascade: refetch whenever district changes
    useEffect(() => {
        if (!formData.district_id) {
            setOptions(prev => ({ ...prev, talukas: [], villages: [] }));
            return;
        }
        setOptions(prev => ({ ...prev, talukas: [], villages: [] }));
        setFormData(prev => ({ ...prev, taluka_id: "", village_id: "" }));
        fetch(`/api/talukas?district_id=${formData.district_id}`)
            .then(r => r.json())
            .then(r => setOptions(prev => ({ ...prev, talukas: r.data || r.talukas || [] })))
            .catch(err => console.error("[CreateEventModal] talukas fetch failed:", err));
    }, [formData.district_id]);

    // Issue 1 — Village cascade: refetch whenever taluka changes
    useEffect(() => {
        if (!formData.taluka_id) {
            setOptions(prev => ({ ...prev, villages: [] }));
            return;
        }
        setOptions(prev => ({ ...prev, villages: [] }));
        setFormData(prev => ({ ...prev, village_id: "" }));
        fetch(`/api/villages?taluka_id=${formData.taluka_id}`)
            .then(r => r.json())
            .then(r => setOptions(prev => ({ ...prev, villages: r.data || r.villages || [] })))
            .catch(err => console.error("[CreateEventModal] villages fetch failed:", err));
    }, [formData.taluka_id]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear inline error for that field as the user fixes it
        if (fieldErrors[field]) setFieldErrors(prev => ({ ...prev, [field]: "" }));
    };

    const toggleParticipant = (type, id) => {
        const field = type === "crp" ? "crp_participants" : "shg_participants";
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].includes(id) ? prev[field].filter(i => i !== id) : [...prev[field], id]
        }));
    };

    const handleSubmit = async () => {
        // Per-field validation
        const errors = {};
        if (!formData.title.trim())        errors.title        = "Event title is required.";
        if (!formData.vertical_id)         errors.vertical_id  = "Please select a vertical.";
        if (!formData.type)                errors.type         = "Please select an event type.";
        if (!formData.startDate)           errors.startDate    = "Start date is required.";
        if (!formData.startTime)           errors.startTime    = "Start time is required.";
        if (!formData.endTime)             errors.endTime      = "End time is required.";
        if (!confirmChecked)               errors.confirm      = "Please tick the confirmation checkbox before submitting.";

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            setFormError("Please fix the highlighted fields before submitting.");
            // Scroll back to top of modal so the banner and first error are visible
            if (scrollRef.current) scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        setFieldErrors({});
        setFormError("");
        setIsSubmitting(true);
        try {
            // Transform camelCase formData → snake_case payload the backend expects.
            // The API stores datetimes as "YYYY-MM-DDTHH:mm:ss" (confirmed via event-management.js
            // which reads back: e.start_datetime.split('T')[0] and [1].substring(0,5))
            const payload = {
                title:                    formData.title,
                type:                     formData.type,
                vertical_id:              formData.vertical_id,
                start_datetime:           `${formData.startDate}T${formData.startTime}:00`,
                end_datetime:             formData.endDate && formData.endTime
                                            ? `${formData.endDate}T${formData.endTime}:00`
                                            : "",
                location:                 formData.location,
                latitude:                 formData.latitude,
                longitude:                formData.longitude,
                district_id:             formData.district_id,
                taluka_id:               formData.taluka_id,
                village_id:              formData.village_id,
                crp_participants:         formData.crp_participants,
                shg_participants:         formData.shg_participants,
                primary_coordinator_id:  formData.primary_coordinator_id,
                secondary_coordinator_id: formData.secondary_coordinator_id,
                description:              formData.description,
            };

            const res = await fetch("/api/events", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const json = await res.json();
            if (json.status === 1) { onSave(); onClose(); }
            else setFormError(json.message || "Failed to create event. Please try again.");
        } catch {
            setFormError("Network error. Please check your connection and try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const DEFAULT_EVENT_TYPES = [
        { value: "meeting", label: "Meeting" },
        { value: "workshop", label: "Workshop" },
        { value: "training", label: "Training" },
        { value: "seminar", label: "Seminar" },
        { value: "other", label: "Other" }
    ];

    const verticalOptions = useMemo(() => {
        const items = options.verticals || [];
        return items.map(v => {
            if (typeof v === 'string') return { value: v, label: v };
            // Issue 3 — multi-key fallback; add more fields here after checking the console log
            const label = v.vertical_name || v.name || v.verticalName || v.title || v.label || v.vertical || "Unknown Vertical";
            return { 
                value: String(v.id || v.value || ""), 
                label 
            };
        });
    }, [options.verticals]);

    const eventTypeOptions = useMemo(() => {
        const items = options.types || options.event_types || [];
        if (items.length === 0) return DEFAULT_EVENT_TYPES;
        
        return items.map(t => {
            if (typeof t === 'string') return { value: t.toLowerCase(), label: t };
            // Issue 4 — normalise all values to strings so "meeting" default matches numeric IDs too
            return { 
                value: String(t.id || t.value || t.name?.toLowerCase() || ""),
                label: t.name || t.label || t.type_name || "Unknown Type" 
            };
        });
    }, [options.types, options.event_types]);

    return (
        <FormModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-5xl">
            <FormHeader title="Schedule New Event" subtitle="Portal Management System • Phase 4" icon={Calendar} onClose={onClose} />

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 custom-scrollbar overscroll-contain transform-gpu">
                <FormError error={formError} />

                <div className="space-y-10">
                    <FormSection title="Event Identity" description="Basic purpose." icon={Tag}>
                        <FormInput label="Event Title *" placeholder="e.g., Financial Literacy Workshop" value={formData.title} onChange={e => handleChange("title", e.target.value)} error={fieldErrors.title} />
                        <div className="grid grid-cols-2 gap-4">
                            <FormSelect 
                                label="Vertical *" 
                                options={verticalOptions} 
                                value={formData.vertical_id} 
                                onChange={e => handleChange("vertical_id", e.target.value)}
                                error={fieldErrors.vertical_id}
                            />
                            <FormSelect 
                                label="Event Type *" 
                                options={eventTypeOptions} 
                                value={formData.type} 
                                onChange={e => handleChange("type", e.target.value)}
                                error={fieldErrors.type}
                            />
                        </div>
                    </FormSection>

                    <div className="h-px bg-slate-100" />

                    <FormSection title="Schedule & Venue" description="Define when and where." icon={Clock}>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <FormInput label="Start Date *" type="date" value={formData.startDate} onChange={e => handleChange("startDate", e.target.value)} error={fieldErrors.startDate} />
                            <FormInput label="End Date" type="date" value={formData.endDate} onChange={e => handleChange("endDate", e.target.value)} />
                            <FormInput label="Starts *" type="time" value={formData.startTime} onChange={e => handleChange("startTime", e.target.value)} error={fieldErrors.startTime} />
                            <FormInput label="Ends *" type="time" value={formData.endTime} onChange={e => handleChange("endTime", e.target.value)} error={fieldErrors.endTime} />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <FormSelect label="District" options={(options.districts || []).map(d => ({ value: d.id, label: d.name }))} value={formData.district_id} onChange={e => handleChange("district_id", e.target.value)} />
                            <FormSelect
                                label="Taluka"
                                options={(options.talukas || []).map(t => ({ value: String(t.id), label: t.name || t.taluka_name || t.taluka || String(t.id) }))}
                                value={formData.taluka_id}
                                onChange={e => handleChange("taluka_id", e.target.value)}
                            />
                            <FormSelect
                                label="Village"
                                options={(options.villages || []).map(v => ({ value: String(v.id), label: v.name || v.village_name || v.village || String(v.id) }))}
                                value={formData.village_id}
                                onChange={e => handleChange("village_id", e.target.value)}
                            />
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Venue Details *</label>
                                <button
                                    type="button"
                                    onClick={handleGetLocation}
                                    disabled={isDetectingLocation}
                                    className="text-[10px] font-black text-[#3b52ab] uppercase tracking-widest flex items-center gap-2 disabled:opacity-50 disabled:cursor-wait transition-opacity"
                                >
                                    <Navigation size={12} className={isDetectingLocation ? "animate-spin" : "rotate-45"} />
                                    {isDetectingLocation ? "Detecting..." : "Detect GPS"}
                                </button>
                            </div>
                            {/* Address field — auto-parses "lat, lng" strings into lat/lng fields */}
                            <FormInput
                                icon={MapPin}
                                placeholder='Address, or paste coordinates e.g. "15.4956, 73.9782"'
                                value={formData.location}
                                onChange={e => {
                                    const val = e.target.value;
                                    handleChange("location", val);
                                    // Auto-parse if it looks like "lat, lng"
                                    const coordMatch = val.match(/^\s*(-?\d{1,3}\.\d+)\s*[,\s]\s*(-?\d{1,3}\.\d+)\s*$/);
                                    if (coordMatch) {
                                        const [, lat, lng] = coordMatch;
                                        setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));
                                    }
                                }}
                            />

                            {/* Explicit lat / lng fields */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Latitude</label>
                                    <input
                                        type="text"
                                        inputMode="decimal"
                                        placeholder="e.g. 15.4956385"
                                        value={formData.latitude}
                                        onChange={e => handleChange("latitude", e.target.value)}
                                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-[#3b52ab] transition-all outline-none text-sm font-bold text-slate-800 shadow-sm"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Longitude</label>
                                    <input
                                        type="text"
                                        inputMode="decimal"
                                        placeholder="e.g. 73.9782924"
                                        value={formData.longitude}
                                        onChange={e => handleChange("longitude", e.target.value)}
                                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-[#3b52ab] transition-all outline-none text-sm font-bold text-slate-800 shadow-sm"
                                    />
                                </div>
                            </div>

                            {/* Live GPS badge */}
                            {formData.latitude && formData.longitude && (
                                <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-100 rounded-xl">
                                    <Navigation size={12} className="text-emerald-600 rotate-45 shrink-0" />
                                    <span className="text-[11px] font-bold text-emerald-700">
                                        📍 {parseFloat(formData.latitude).toFixed(6)}°N, {parseFloat(formData.longitude).toFixed(6)}°E
                                    </span>
                                </div>
                            )}
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
                    <FormCheckbox label="I verify that all logistics are finalized." checked={confirmChecked} onChange={setConfirmChecked} error={fieldErrors.confirm} />
                    <FormActions onCancel={onClose} onConfirm={handleSubmit} isLoading={isSubmitting} confirmText="Schedule Event" confirmIcon={CheckCircle2} />
                </div>
            </div>
        </FormModal>
    );
}
