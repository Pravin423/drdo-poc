import ProtectedRoute from "../../components/ProtectedRoute";

import DashboardLayout from "../../components/DashboardLayout";

export default function SuperAdmin() {
  return (
    <ProtectedRoute allowedRole="super-admin">
      <DashboardLayout>
        <h1 className="text-2xl font-bold">Super Admin Dashboard</h1>
        <p className="text-gray-600">Super Admin-level monitoring</p>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
