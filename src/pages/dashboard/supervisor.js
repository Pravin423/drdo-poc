import ProtectedRoute from "../../components/ProtectedRoute";
import Layout from "../../components/Layout";
import DashboardLayout from "../../components/DashboardLayout";

export default function Supervisor() {
  return (
    <ProtectedRoute allowedRole="supervisor">
     <DashboardLayout>
             <h1 className="text-2xl font-bold">Supervisor Dashboard</h1>
           </DashboardLayout>
    </ProtectedRoute>
  );
}
