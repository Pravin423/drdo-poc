import DashboardLayout from "../../components/DashboardLayout";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function StateAdmin() {
  return (
    <ProtectedRoute allowedRole="state-admin">
      <DashboardLayout>
        <h1 className="text-2xl font-bold">State Admin Dashboard</h1>
        <p className="text-gray-600">State-level CRP monitoring</p>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
