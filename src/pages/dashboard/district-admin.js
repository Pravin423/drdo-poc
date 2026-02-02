import ProtectedRoute from "../../components/ProtectedRoute";
import DashboardLayout from "../../components/DashboardLayout";
export default function DistrictAdmin() {
  return (
    <ProtectedRoute allowedRole="district-admin">
      <DashboardLayout>
        <div className="space-y-3">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-50">
            District Admin workspace
          </h1>
          <p className="text-sm text-slate-300 max-w-xl">
            Detailed view into block and village-level CRP work, allowing you
            to coordinate support where it is needed most.
          </p>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
