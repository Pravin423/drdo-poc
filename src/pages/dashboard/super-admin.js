import ProtectedRoute  from "../../components/ProtectedRoute";
import DashboardLayout from "../../components/DashboardLayout";
import { useAuth } from "../../context/AuthContext";

import PageHeader          from "../../components/super-admin/systemoverview/PageHeader";
import SummaryCards        from "../../components/super-admin/systemoverview/SummaryCards";
import CRPDistributionChart from "../../components/super-admin/systemoverview/CRPDistributionChart";
import SystemHealth        from "../../components/super-admin/systemoverview/SystemHealth";
import AttendanceTrends    from "../../components/super-admin/systemoverview/AttendanceTrends";
import ActivityTable       from "../../components/super-admin/systemoverview/ActivityTable";
import TaskOverviewMap     from "../../components/super-admin/systemoverview/TaskOverviewMap";

export default function SuperAdmin() {
  const { user } = useAuth();
  const roleName = user?.role_name || (user?.role === "super-admin" ? "Super Admin" : "State Admin");

  return (
    <ProtectedRoute allowedRole={["super-admin"]}>
      <DashboardLayout>
        <div className="max-w-[1600px] mx-auto space-y-8 p-4">

          
          <PageHeader roleName={roleName} />

          
          <SummaryCards />

          <div className="grid gap-6 lg:grid-cols-3">
            <CRPDistributionChart />
            <SystemHealth />
          </div>


          <TaskOverviewMap />

          <AttendanceTrends />

         
          <ActivityTable />

        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}