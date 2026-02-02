import ProtectedRoute from "../../components/ProtectedRoute";
import Layout from "../../components/Layout";
import DashboardLayout from "../../components/DashboardLayout";
export default function Finance() {
  return (
    <ProtectedRoute allowedRole="finance">
      <DashboardLayout>
              <h1 className="text-2xl font-bold">Finance Dashboard</h1>
              <p className="text-gray-600">Finance-level monitoring</p>
            </DashboardLayout>
    </ProtectedRoute>
  );
}
