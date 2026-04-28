import ProtectedRoute from "../../components/ProtectedRoute";
import DashboardLayout from "../../components/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import DistrictDetailOverview from "../../components/super-admin/location/DistrictDetailOverview";
import { motion } from "framer-motion";
import { MapPin, LayoutDashboard, Settings } from "lucide-react";

export default function BlockAdmin() {
  const { user } = useAuth();
  
  // District ID assigned to this Block Manager
  const districtId = user?.district_id;
  const roleName = user?.role_name || "Block Manager";

  return (
    <ProtectedRoute allowedRole={["Block-admin", "district-admin"]}>
      <DashboardLayout>
        <div className="max-w-[1600px] mx-auto space-y-8 p-4">
          
          {/* Header Section */}
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              {roleName}{" "}
              <span className="bg-gradient-to-b from-[#3b52ab] to-[#1a2e7a] bg-clip-text text-transparent">
                Overview
              </span>
            </h1>
            <p className="text-slate-500 font-medium">
              Regional operations and block-level performance monitoring.
            </p>
          </div>

          {/* District Overview Component */}
          {districtId ? (
            <DistrictDetailOverview 
              districtId={districtId} 
              assignedTalukaIds={user?.taluka_id}
            />
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-3xl p-12 text-center flex flex-col items-center space-y-4">
               <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-3xl flex items-center justify-center">
                  <MapPin size={32} />
               </div>
               <div className="max-w-md">
                 <h2 className="text-xl font-bold text-amber-900">No District Assigned</h2>
                 <p className="text-amber-700 text-sm mt-2">
                   Your account has not been assigned to a specific district yet. Please contact your system administrator to configure your jurisdiction.
                 </p>
               </div>
            </div>
          )}

        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
