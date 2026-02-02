import ProtectedRoute from "../../components/ProtectedRoute";
import DashboardLayout from "../../components/DashboardLayout";

export default function Supervisor() {
  return (
    <ProtectedRoute allowedRole="supervisor">
      <DashboardLayout>
        <div className="space-y-3">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-50">
            Supervisor console
          </h1>
          <p className="text-sm text-slate-300 max-w-xl">
            Track assigned CRPs, review their visit logs and ensure timely
            follow-through on planned interventions.
          </p>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
