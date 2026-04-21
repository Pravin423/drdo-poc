
import ProtectedRoute  from "../../components/ProtectedRoute";
import DashboardLayout from "../../components/DashboardLayout";

import PageHeader          from "../../components/super-admin/systemoverview/PageHeader";
import SummaryCards        from "../../components/super-admin/systemoverview/SummaryCards";
import CRPDistributionChart from "../../components/super-admin/systemoverview/CRPDistributionChart";
import SystemHealth        from "../../components/super-admin/systemoverview/SystemHealth";
import AttendanceTrends    from "../../components/super-admin/systemoverview/AttendanceTrends";
import ActivityTable       from "../../components/super-admin/systemoverview/ActivityTable";

export default function SuperAdmin() {
  return (
    <ProtectedRoute allowedRole="super-admin">
      <DashboardLayout>
        <div className="max-w-[1600px] mx-auto space-y-8 p-4">

          
          <PageHeader />

          
          <SummaryCards />

          <div className="grid gap-6 lg:grid-cols-3">
            <CRPDistributionChart />
            <SystemHealth />
          </div>


          <AttendanceTrends />

         
          <ActivityTable />

        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}