import { useEffect } from "react";
import { useRouter } from "next/router";
import DashboardLayout from "../../components/DashboardLayout";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function StateAdmin() {
  const router = useRouter();

  useEffect(() => {
    // Redirect automatically to default dashboard
    router.replace("/dashboard/state-admin/escalations");
  }, [router]);

  return (
    <ProtectedRoute allowedRole="state-admin">
      <DashboardLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-sm font-bold text-slate-500 animate-pulse tracking-wide">Initializing Dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
