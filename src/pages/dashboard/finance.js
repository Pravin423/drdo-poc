import ProtectedRoute from "../../components/ProtectedRoute";
import DashboardLayout from "../../components/DashboardLayout";
export default function Finance() {
  return (
    <ProtectedRoute allowedRole="finance">
      <DashboardLayout>
        <div className="space-y-3">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-50">
            Finance oversight
          </h1>
          <p className="text-sm text-slate-300 max-w-xl">
            Financial tracking of CRP activities, fund utilisation and
            time-bound releases across the programme.
          </p>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
