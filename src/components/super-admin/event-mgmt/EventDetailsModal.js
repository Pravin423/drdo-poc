import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    X, 
    Calendar, 
    MapPin, 
    User, 
    Users, 
    Clock, 
    Globe, 
    FileText,
    Save,
    Folder,
    LayoutDashboard,
    Tag,
    ChevronRight,
    Search,
    Download,
    Share2,
    CheckCircle2
} from "lucide-react";

import ConfirmationModal from "../../common/ConfirmationModal";
import {
    FormModal,
    FormHeader,
    FormInfo,
    FormActions
} from "../../common/FormUI";

const ATTENDANCE_MODES = [
    { value: "pending", label: "Pending" },
    { value: "present", label: "Present" },
    { value: "absent", label: "Absent" }
];

export default function EventDetailsModal({ isOpen, onClose, event: initialEvent }) {
    const [activeTab, setActiveTab] = useState("details");
    const [eventData, setEventData] = useState(null);
    const [crpParticipants, setCrpParticipants] = useState([]);
    const [shgParticipants, setShgParticipants] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [attendanceStatus, setAttendanceStatus] = useState({ crp: {}, shg: {} });

    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: "",
        message: "",
        type: "success"
    });

    useEffect(() => {
        if (isOpen && initialEvent?.id) {
            fetchEventDetails();
        }
    }, [isOpen, initialEvent?.id]);

    const fetchEventDetails = async () => {
        try {
            setIsLoading(true);
            const res = await fetch(`/api/events?action=show&id=${initialEvent.id}&_t=${Date.now()}`);
            const result = await res.json();

            if (result.status === 1 && result.data) {
                setEventData(result.data.event);
                const crps = result.data.crpParticipants || [];
                const shgs = result.data.shgParticipants || [];
                setCrpParticipants(crps);
                setShgParticipants(shgs);

                const crpAtt = {};
                crps.forEach(p => {
                    crpAtt[p.id] = { status: p.attendance?.toLowerCase() || "pending", userId: p.user_id };
                });
                const shgAtt = {};
                shgs.forEach(s => {
                    shgAtt[s.id] = { status: s.attendance?.toLowerCase() || "pending", userId: s.user_id };
                });
                setAttendanceStatus({ crp: crpAtt, shg: shgAtt });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleAttendanceChange = (type, id, userId, status) => {
        setAttendanceStatus(prev => ({
            ...prev,
            [type]: { ...prev[type], [id]: { status, userId } }
        }));
    };

    const handleSaveAttendance = async () => {
        setIsSaving(true);
        try {
            const res = await fetch(`/api/events?action=save-attendance&id=${eventData.id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(attendanceStatus)
            });
            if ((await res.json()).status === 1) {
                setConfirmModal({ isOpen: true, title: "Success", message: "Attendance synchronized successfully.", type: "success" });
            }
        } finally { setIsSaving(false); }
    };

    if (!initialEvent) return null;
    const event = eventData || initialEvent;
    
    const tabs = [
        { id: "details", label: "Details", icon: LayoutDashboard },
        { id: "documents", label: "Docs & Images", icon: Folder },
    ];

    return (
        <FormModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-6xl">
            <FormHeader 
                title={event.title || "Event Details"} 
                subtitle={`${event.type || "Event"} • Management Portal`} 
                icon={Calendar} 
                onClose={onClose} 
            />

            {/* Sub-Header / Tabs */}
            <div className="px-10 py-3 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between shrink-0">
                <div className="flex gap-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`py-2 text-[10px] font-black uppercase tracking-widest transition-all relative flex items-center gap-2.5 ${activeTab === tab.id ? "text-[#3b52ab]" : "text-slate-400 hover:text-slate-600"}`}
                        >
                            <tab.icon size={14} strokeWidth={2.5} />
                            {tab.label}
                            {activeTab === tab.id && (
                                <motion.div layoutId="activeTabDetails" className="absolute -bottom-3 left-0 right-0 h-0.5 bg-[#3b52ab]" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar overscroll-contain transform-gpu">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-slate-100 border-t-[#3b52ab] rounded-full animate-spin mb-4" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Retrieving Data...</p>
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                            {activeTab === "details" && (
                                <div className="grid grid-cols-12 gap-10">
                                    {/* Sidebar Summary */}
                                    <div className="col-span-4 space-y-6">
                                        <div className="space-y-3">
                                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Event Summary</h4>
                                            <div className="space-y-3">
                                                <FormInfo label="Classification" value={event.type} icon={Tag} />
                                                <FormInfo label="Vertical Focus" value={event.vertical} icon={Tag} />
                                                <FormInfo label="Exact Location" value={event.location} icon={MapPin} />
                                                <FormInfo label="Regional District" value={event.district} icon={Globe} />
                                            </div>
                                        </div>
                                        
                                        <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 space-y-3">
                                            <div className="flex items-center gap-2">
                                                <FileText size={14} className="text-[#3b52ab]" />
                                                <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Full Description</h4>
                                            </div>
                                            <p className="text-[13px] font-bold text-slate-500 leading-relaxed">
                                                {event.description || "No detailed description was provided for this event entry."}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Attendance / Participants */}
                                    <div className="col-span-8 space-y-8">
                                        {/* CRP Section */}
                                        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm shadow-slate-100">
                                            <div className="px-8 py-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-[#3b52ab]/10 text-[#3b52ab] rounded-xl">
                                                        <User size={16} strokeWidth={2.5} />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">CRP Attendance</h4>
                                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{crpParticipants.length} Participants</p>
                                                    </div>
                                                </div>
                                                {crpParticipants.length > 0 && (
                                                    <button 
                                                        onClick={handleSaveAttendance} 
                                                        disabled={isSaving} 
                                                        className="px-6 py-2 bg-[#3b52ab] text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-[#3b52ab]/20 hover:bg-[#1a2e7a] transition-all disabled:opacity-50 active:scale-95 flex items-center gap-2"
                                                    >
                                                        {isSaving ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={12} />}
                                                        Sync
                                                    </button>
                                                )}
                                            </div>
                                            <div className="min-h-[120px] flex flex-col">
                                                {crpParticipants.length > 0 ? (
                                                    <table className="w-full text-left">
                                                        <tbody className="divide-y divide-slate-100">
                                                            {crpParticipants.map(p => (
                                                                <tr key={p.id} className="group hover:bg-slate-50/50 transition-all">
                                                                    <td className="px-8 py-4">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[11px] font-black text-[#3b52ab] group-hover:bg-white group-hover:shadow-sm transition-all">
                                                                                {p.name?.charAt(0)}
                                                                            </div>
                                                                            <span className="text-[14px] font-bold text-slate-700">{p.name}</span>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-8 py-4 text-right">
                                                                        <div className="relative inline-block">
                                                                            <select 
                                                                                value={attendanceStatus.crp[p.id]?.status} 
                                                                                onChange={e => handleAttendanceChange("crp", p.id, p.user_id, e.target.value)} 
                                                                                className={`pl-4 pr-10 py-2 rounded-xl border-2 transition-all outline-none text-[10px] font-black uppercase tracking-widest appearance-none cursor-pointer ${
                                                                                    attendanceStatus.crp[p.id]?.status === 'present' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                                                                                    attendanceStatus.crp[p.id]?.status === 'absent' ? 'bg-rose-50 border-rose-100 text-rose-600' :
                                                                                    'bg-slate-100 border-transparent text-slate-500'
                                                                                }`}
                                                                            >
                                                                                {ATTENDANCE_MODES.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                                                                            </select>
                                                                            <ChevronRight size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-current opacity-40 rotate-90" />
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                ) : (
                                                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-2">
                                                        <div className="p-3 bg-slate-50 rounded-2xl text-slate-300">
                                                            <Users size={24} />
                                                        </div>
                                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">No CRP members assigned to this event</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* SHG Section */}
                                        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm shadow-slate-100">
                                            <div className="px-8 py-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                                                        <Users size={16} strokeWidth={2.5} />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">SHG Attendance</h4>
                                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{shgParticipants.length} Groups</p>
                                                    </div>
                                                </div>
                                                {shgParticipants.length > 0 && (
                                                    <button 
                                                        onClick={handleSaveAttendance} 
                                                        disabled={isSaving} 
                                                        className="px-6 py-2 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-all disabled:opacity-50 active:scale-95 flex items-center gap-2"
                                                    >
                                                        {isSaving ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={12} />}
                                                        Sync
                                                    </button>
                                                )}
                                            </div>
                                            <div className="min-h-[120px] flex flex-col">
                                                {shgParticipants.length > 0 ? (
                                                    <table className="w-full text-left">
                                                        <tbody className="divide-y divide-slate-100">
                                                            {shgParticipants.map(s => (
                                                                <tr key={s.id} className="group hover:bg-slate-50/50 transition-all">
                                                                    <td className="px-8 py-4">
                                                                        <span className="text-[14px] font-bold text-slate-700">{s.name || s.shg_name}</span>
                                                                    </td>
                                                                    <td className="px-8 py-4 text-right">
                                                                        <div className="relative inline-block">
                                                                            <select 
                                                                                value={attendanceStatus.shg[s.id]?.status} 
                                                                                onChange={e => handleAttendanceChange("shg", s.id, s.user_id, e.target.value)} 
                                                                                className={`pl-4 pr-10 py-2 rounded-xl border-2 transition-all outline-none text-[10px] font-black uppercase tracking-widest appearance-none cursor-pointer ${
                                                                                    attendanceStatus.shg[s.id]?.status === 'present' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                                                                                    attendanceStatus.shg[s.id]?.status === 'absent' ? 'bg-rose-50 border-rose-100 text-rose-600' :
                                                                                    'bg-slate-100 border-transparent text-slate-500'
                                                                                }`}
                                                                            >
                                                                                {ATTENDANCE_MODES.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                                                                            </select>
                                                                            <ChevronRight size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-current opacity-40 rotate-90" />
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                ) : (
                                                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-2">
                                                        <div className="p-3 bg-slate-50 rounded-2xl text-slate-300">
                                                            <Users size={24} />
                                                        </div>
                                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">No SHG groups assigned to this event</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>

            {/* Simple Status Footer */}
            <div className="px-10 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Archive Active</span>
                </div>
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">ID: {event.id || '---'}</p>
            </div>

            <ConfirmationModal isOpen={confirmModal.isOpen} onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })} title={confirmModal.title} message={confirmModal.message} type={confirmModal.type} />
        </FormModal>
    );
}
