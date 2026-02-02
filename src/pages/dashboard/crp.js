import ProtectedRoute from "../../components/ProtectedRoute";
import DashboardLayout from "../../components/DashboardLayout";
export default function CRP() {
  return (
    <ProtectedRoute allowedRole="crp">
      <DashboardLayout>
        <div className="space-y-3">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-50">
            CRP daily view
          </h1>
          <p className="text-sm text-slate-300 max-w-xl">
            A clean, focused snapshot of field visits, households reached and
            follow-ups due for each Community Resource Person.
          </p>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
