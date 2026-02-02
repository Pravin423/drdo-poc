import ProtectedRoute from "../../components/ProtectedRoute";
import Layout from "../../components/Layout";
import DashboardLayout from "../../components/DashboardLayout";
export default function DistrictAdmin() {
  return (
    <ProtectedRoute allowedRole="district-admin">
     <DashboardLayout>
             <h1 className="text-2xl font-bold">District Admin Dashboard</h1>
             <p className="text-gray-600">District-level CRP monitoring</p>
           </DashboardLayout>
    </ProtectedRoute>
  );
}
