import { useAuth } from "../../context/AuthContext";
import ProtectedRoute from "../../components/ProtectedRoute";
import DashboardLayout from "../../components/DashboardLayout";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Phone, Mail, ShieldCheck, Loader2,
  AlertCircle, RefreshCw, CreditCard, VenetianMask,
  CheckCircle2,
} from "lucide-react";

/* ──────────────────────────────────────────────────────────────
   Animated counter helper
────────────────────────────────────────────────────────────── */
function InfoChip({ icon: Icon, text, color = "bg-slate-100 text-slate-600" }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${color}`}>
      <Icon size={12} />
      {text}
    </span>
  );
}

/* ──────────────────────────────────────────────────────────────
   Detail row used inside the card
────────────────────────────────────────────────────────────── */
function DetailRow({ icon: Icon, label, value, last = false }) {
  return (
    <div className={`flex items-center gap-4 py-3.5 ${!last ? "border-b border-slate-100" : ""}`}>
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#f0f3ff] flex items-center justify-center">
        <Icon size={14} className="text-[#3b52ab]" />
      </div>
      <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
        <span className="text-xs text-slate-400 font-medium whitespace-nowrap">{label}</span>
        <span className="text-sm font-semibold text-slate-800 text-right truncate max-w-[60%]">
          {value || <span className="text-slate-300 font-normal">Not provided</span>}
        </span>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   Aadhar masking  →  XXXX-XXXX-1234
────────────────────────────────────────────────────────────── */
function maskAadhar(val) {
  if (!val) return null;
  const clean = String(val).replace(/\D/g, "");
  if (clean.length < 4) return val;
  const last4 = clean.slice(-4);
  const masked = "XXXX-XXXX-" + last4;
  return masked;
}

/* ──────────────────────────────────────────────────────────────
   Page
────────────────────────────────────────────────────────────── */
export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  const fetchProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("authToken");
      const res   = await fetch("/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data?.status && data?.data) setProfile(data.data);
      else if (data && !data.message)  setProfile(data);
      else setError(data?.message || "Failed to load profile.");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);
  if (!user) return null;

  const p      = profile || {};
  const name   = p.fullname   || p.name        || user.name  || "—";
  const phone  = p.mobile     || p.phone        || user.phone;
  const email  = p.email      || user.email;
  const role   = p.role_name  || user.role_name || user.role || "Super Admin";
  const active = (p.status ?? 0) === 0;
  const gender = p.gender;
  const aadhar = p.aadhar_number || p.aadhar || p.aadhaar_number || p.aadhaar;

  const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <ProtectedRoute allowedRole="super-admin">
      <DashboardLayout>
        <div className="min-h-screen bg-[#f7f8fc] flex flex-col items-center px-4 py-10">

          {/* ── Top bar ────────────────────────────────────────── */}
          <div className="w-full max-w-xl flex items-center justify-between mb-8">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Profile</h1>
              <p className="text-xs text-slate-400 mt-0.5">Your personal account details</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={fetchProfile}
              disabled={loading}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-500 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition shadow-sm disabled:opacity-40"
            >
              <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
              Refresh
            </motion.button>
          </div>

          {/* ── Loading ─────────────────────────────────────────── */}
          <AnimatePresence>
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-3 py-24">
                <Loader2 size={28} className="text-[#3b52ab] animate-spin" />
                <p className="text-xs text-slate-400 font-medium">Loading profile…</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Error ───────────────────────────────────────────── */}
          <AnimatePresence>
            {error && !loading && (
              <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="w-full max-w-xl flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 rounded-2xl mb-4">
                <AlertCircle size={16} className="text-rose-500 shrink-0" />
                <p className="text-sm text-rose-700 font-medium flex-1">{error}</p>
                <button onClick={fetchProfile} className="text-xs font-bold text-rose-600 underline underline-offset-2">Retry</button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Main card ───────────────────────────────────────── */}
          {!loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full max-w-xl"
            >
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">

                {/* Cover gradient */}
                <div className="relative h-28 bg-gradient-to-r from-[#3b52ab] via-[#4f6ac9] to-[#6b84e0] overflow-hidden">
                  {/* Subtle dot grid */}
                  <div className="absolute inset-0"
                    style={{
                      backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)",
                      backgroundSize: "20px 20px",
                    }}
                  />
                  {/* Soft glow orbs */}
                  <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                  <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#1a2e7a]/30 rounded-full blur-2xl" />
                </div>

                {/* Avatar row — overlaps cover */}
                <div className="px-7 pb-6">
                  <div className="flex items-end gap-5 -mt-10 mb-5">
                    <div className="relative shrink-0">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#3b52ab] to-[#1a2e7a] flex items-center justify-center text-white text-2xl font-extrabold ring-4 ring-white shadow-lg">
                        {initials}
                      </div>
                      {active && (
                        <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full ring-2 ring-white flex items-center justify-center">
                          <CheckCircle2 size={11} className="text-white" strokeWidth={3} />
                        </span>
                      )}
                    </div>

                    <div className="pb-1 flex-1 min-w-0">
                      <h2 className="text-lg font-bold text-slate-900 truncate">{name}</h2>
                      <div className="flex flex-wrap gap-2 mt-1.5">
                        <InfoChip
                          icon={ShieldCheck}
                          text={role}
                          color="bg-blue-50 text-blue-700"
                        />
                        <InfoChip
                          icon={active ? CheckCircle2 : AlertCircle}
                          text={active ? "Active" : "Inactive"}
                          color={active ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-600"}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-slate-100 mb-1" />

                  {/* Detail rows */}
                  <div className="pt-1">
                    <DetailRow icon={User}         label="Full Name"    value={name} />
                    <DetailRow icon={Phone}        label="Phone"        value={phone ? `+91 ${phone}` : null} />
                    <DetailRow icon={Mail}         label="Email"        value={email} />
                    <DetailRow icon={ShieldCheck}  label="Role"         value={role} />
                    <DetailRow
                      icon={VenetianMask}
                      label="Gender"
                      value={gender
                        ? gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase()
                        : null}
                    />
                    <DetailRow
                      icon={CreditCard}
                      label="Aadhaar"
                      value={maskAadhar(aadhar)}
                      last
                    />
                  </div>
                </div>

                {/* Footer strip */}
                <div className="px-7 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <p className="text-xs text-slate-400">
                    DRDA Goa — Government of Goa
                  </p>
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Session Active
                  </span>
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
