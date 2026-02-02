import ProtectedRoute from "../../components/ProtectedRoute";
import Layout from "../../components/Layout";
import DashboardLayout from "../../components/DashboardLayout";
export default function CRP() {
  return (
    <ProtectedRoute allowedRole="crp">
       <DashboardLayout>
              <h1 className="text-2xl font-bold">CRP Dashboard</h1>
              <p className="text-gray-600">CRP-level monitoring</p>
            </DashboardLayout>
    </ProtectedRoute>
  );
}
