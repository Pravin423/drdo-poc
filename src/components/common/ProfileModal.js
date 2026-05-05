import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    X, 
    User, 
    Phone, 
    Mail, 
    ShieldCheck, 
    Loader2, 
    CreditCard, 
    VenetianMask,
    CheckCircle2,
    Calendar,
    Briefcase,
    Zap,
    MapPin,
    Smartphone,
    Globe,
    Camera,
    Shield,
    Info,
    RefreshCw
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { FormModal } from "./FormUI";

const BACKEND_PUBLIC = "https://goadrda.runtime-solutions.net";

function resolveImageUrl(url) {
    if (!url) return null;
    if (url.startsWith('http') && !url.includes('localhost')) return url;
    return url.replace(/https?:\/\/localhost/i, BACKEND_PUBLIC);
}

function maskAadhar(val) {
    if (!val) return "Not provided";
    const clean = String(val).replace(/\D/g, "");
    if (clean.length < 4) return val;
    return "XXXX-XXXX-" + clean.slice(-4);
}

function ProfileDetail({ icon: Icon, label, value, color = "blue" }) {
    const variants = {
        blue: "bg-blue-50 text-blue-600 border-blue-100",
        emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
        indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
        slate: "bg-slate-50 text-slate-600 border-slate-100",
        rose: "bg-rose-50 text-rose-600 border-rose-100"
    };

    return (
        <div className="group flex items-center gap-4 p-4 rounded-[1.5rem] bg-white border border-slate-100 hover:border-slate-200 hover:shadow-xl hover:shadow-slate-200/40 transition-all">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${variants[color] || variants.blue} group-hover:scale-110 transition-transform`}>
                <Icon size={18} strokeWidth={2.5} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
                <p className="text-sm font-black text-slate-800">{value || <span className="text-slate-300 font-bold">Unspecified</span>}</p>
            </div>
        </div>
    );
}

export default function ProfileModal({ isOpen, onClose }) {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchProfile = async () => {
        setLoading(true);
        setError("");
        try {
            const token = localStorage.getItem("authToken");
            const res = await fetch("/api/profile", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data?.status && data?.data) setProfile(data.data);
            else if (data && !data.message) setProfile(data);
            else setError(data?.message || "Failed to load profile.");
        } catch {
            setError("Connectivity error.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen && user) fetchProfile();
    }, [isOpen, user]);

    const p = profile || {};
    const name = p.fullname || p.name || user?.name || "System User";
    const role = p.role_name || user?.role_name || user?.role || "User";
    const isActive = (p.status ?? 0) === 0;
    const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
    const avatarUrl = resolveImageUrl(p.profile || user?.profile || "");

    return (
        <FormModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-4xl">
            <div className="relative flex flex-col bg-[#f8fafc] max-h-inherit overflow-hidden">
                {/* Visual Header / Cover */}
                <div className="relative h-56 bg-gradient-to-br from-[#0a1945] via-[#0f1c3f] to-[#1a2e7a] shrink-0 overflow-hidden">
                    {/* Background Logo Watermark */}
                    <div className="absolute right-0 top-0 w-80 h-80 opacity-[0.07] translate-x-1/4 -translate-y-1/4 pointer-events-none">
                        <img 
                            src="/Seal_of_Goa.webp" 
                            alt="Watermark" 
                            className="w-full h-full object-contain grayscale invert"
                        />
                    </div>

                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "24px 24px" }} />
                    <div className="absolute top-10 right-10 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute -bottom-20 -left-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl" />
                    
                    <button onClick={onClose} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-all z-20 backdrop-blur-md border border-white/10">
                        <X size={20} />
                    </button>

                    <div className="absolute bottom-8 left-12 flex items-end gap-8">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-[2.5rem] bg-white p-2 shadow-2xl relative z-10 overflow-hidden group-hover:rotate-2 transition-transform duration-500">
                                <div className="w-full h-full rounded-[2rem] bg-gradient-to-br from-[#3b52ab] to-[#1a2e7a] flex items-center justify-center overflow-hidden border-2 border-slate-50">
                                    {avatarUrl ? (
                                        <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-white text-5xl font-black">{initials}</span>
                                    )}
                                </div>
                            </div>
                            <button className="absolute -bottom-2 -right-2 w-11 h-11 rounded-2xl bg-white text-[#3b52ab] shadow-2xl flex items-center justify-center hover:bg-[#3b52ab] hover:text-white transition-all z-20 border-4 border-[#f8fafc]">
                                <Camera size={18} strokeWidth={2.5} />
                            </button>
                        </div>
                        <div className="mb-2 space-y-2">
                            <div className="flex items-center gap-3">
                                <h2 className="text-4xl font-black text-white tracking-tighter leading-none">{name}</h2>
                                <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg border border-white/10 flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                                    <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">Verified</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-500/20 backdrop-blur-md rounded-full border border-blue-400/20">
                                    <Shield size={12} className="text-blue-300" />
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">{role}</span>
                                </div>
                                <div className="h-4 w-px bg-white/20" />
                                <div className="flex items-center gap-1.5 px-4 py-1.5 bg-white/5 backdrop-blur-md rounded-full border border-white/5">
                                    <MapPin size={12} className="text-slate-300" />
                                    <span className="text-[10px] font-black text-slate-100 uppercase tracking-widest text-shadow-sm">Goa Administration</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="flex-1 overflow-y-auto p-10 custom-scrollbar overscroll-contain transform-gpu min-h-0">
                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-20 gap-4">
                                <div className="w-12 h-12 border-4 border-[#3b52ab]/10 border-t-[#3b52ab] rounded-full animate-spin" />
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Retrieving Secure Profile Data...</p>
                            </motion.div>
                        ) : (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                                {/* Identity & Contact */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 ml-1 mb-6">
                                        <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#3b52ab] flex items-center justify-center border border-blue-100">
                                            <Zap size={16} strokeWidth={3} />
                                        </div>
                                        <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Identity & Communication</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <ProfileDetail icon={User} label="Authorized Name" value={name} color="blue" />
                                        <ProfileDetail icon={Smartphone} label="Verified Contact" value={p.mobile ? `+91 ${p.mobile}` : null} color="indigo" />
                                        <ProfileDetail icon={Mail} label="Secure Email" value={p.email} color="slate" />
                                        <ProfileDetail icon={ShieldCheck} label="Account Permissions" value={role} color="emerald" />
                                    </div>
                                </div>

                                <div className="h-px bg-slate-100" />

                                {/* Legal & Demographics */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 ml-1 mb-6">
                                        <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
                                            <Info size={16} strokeWidth={3} />
                                        </div>
                                        <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Legal & Demographics</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <ProfileDetail icon={VenetianMask} label="Gender Identity" value={p.gender} color="rose" />
                                        <ProfileDetail icon={CreditCard} label="Aadhaar Signature" value={maskAadhar(p.aadhar_number || p.aadhar)} color="indigo" />
                                        <ProfileDetail icon={Globe} label="Operational Zone" value="Goa DRDA Headquarters" color="slate" />
                                        <ProfileDetail icon={Calendar} label="Member Since" value={p.joined || "N/A"} color="blue" />
                                    </div>
                                </div>

                                {/* Footer Stats */}
                                <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-[#0f1c3f] to-[#1a2e7a] text-white flex items-center justify-between shadow-2xl shadow-blue-900/20 mt-6 relative overflow-hidden">
                                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "16px 16px" }} />
                                    <div className="relative z-10">
                                        <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-1">Session Integrity</p>
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                            <p className="text-sm font-bold">Secure Connection Established</p>
                                        </div>
                                    </div>
                                    <button onClick={fetchProfile} className="relative z-10 px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                        <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
                                        Refresh Data
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </FormModal>
    );
}
