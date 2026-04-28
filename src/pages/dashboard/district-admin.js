import { useEffect } from "react";
import { useRouter } from "next/router";
import ProtectedRoute from "../../components/ProtectedRoute";
import DashboardLayout from "../../components/DashboardLayout";
import { useAuth } from "../../context/AuthContext";

export default function DistrictAdmin() {
  const { user, refreshUserSession } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If they are a Block-admin, send them to their dedicated dashboard
    if (user?.role === "Block-admin") {
      router.push("/dashboard/block-admin");
    } 
    // If they are still mapped to district-admin role but should be Block-admin (legacy session)
    else if (user?.role_name === "Block Manager" || user?.role_name === "Block Program Manager") {
       refreshUserSession().then(success => {
         if (success) router.push("/dashboard/block-admin");
       });
    }
  }, [user, router, refreshUserSession]);

  return (
    <ProtectedRoute allowedRole="district-admin">
      <DashboardLayout>
        <div className="space-y-3">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-800">
            District Admin workspace
          </h1>
          <p className="text-sm text-slate-500 max-w-xl">
            Detailed view into block and village-level CRP work, allowing you
            to coordinate support where it is needed most.
          </p>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
