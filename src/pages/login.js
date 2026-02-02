import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const result = login(email, password);

    if (!result.success) {
      setError(result.message);
      return;
    }

    router.push(`/dashboard/${result.role}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 page-fade">
      <div className="max-w-5xl w-full grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] items-center">
        {/* Left: Copy / illustration */}
        <div className="hidden lg:block glass-panel p-8 card-float">
          <p className="pill-badge mb-5">Secure role-based access</p>
          <h1 className="text-2xl font-semibold text-slate-900 mb-3">
            Welcome back to the CRP Management System
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed mb-6">
            This portal is designed for State / District administrators,
            Finance teams, Supervisors and Community Resource Persons to review
            programme progress with clarity and confidence.
          </p>

          <div className="grid grid-cols-2 gap-3 text-[11px] text-slate-600">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 space-y-1.5">
              <p className="font-medium text-slate-900">Real-time signals</p>
              <p className="text-slate-500">
                Field updates flow in continuously, giving you a current view of
                CRP work.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 space-y-1.5">
              <p className="font-medium text-slate-900">Calm interface</p>
              <p className="text-slate-500">
                We keep the visual noise low so you can focus on the decisions
                that matter.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Login form */}
        <div className="glass-panel px-6 py-7 sm:px-8 sm:py-9 card-float">
          <div className="mb-6">
            <p className="pill-badge mb-3">Sign in</p>
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
              Use your official credentials
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Access is restricted to authorised government staff only.
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-2xl border border-rose-300/80 bg-rose-50 px-4 py-3 text-xs text-rose-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-700">
                Official email
              </label>
              <input
                type="email"
                placeholder="name@gov.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-0.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm outline-none ring-0 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-700">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-0.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm outline-none ring-0 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
              />
            </div>

            <button type="submit" className="w-full primary-button mt-2">
              Continue to dashboard
            </button>
          </form>

          <p className="mt-6 text-[11px] text-slate-500 text-center">
            By signing in you confirm that you are using an authorised
            government device and adhering to the programme&apos;s data
            handling guidelines.
          </p>
        </div>
      </div>
    </div>
  );
}
