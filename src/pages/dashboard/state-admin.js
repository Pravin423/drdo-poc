import DashboardLayout from "../../components/DashboardLayout";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function StateAdmin() {
  return (
    <ProtectedRoute allowedRole="state-admin">
      <DashboardLayout>
        <div className="space-y-3">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-50">
            State Admin overview
          </h1>
          <p className="text-sm text-slate-300 max-w-xl">
            High-level view of CRP coverage and performance across all
            districts. Use this space to spot emerging gaps early.
          </p>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
