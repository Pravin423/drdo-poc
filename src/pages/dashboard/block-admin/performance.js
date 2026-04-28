import React from 'react'
import ProtectedRoute from '../../../components/ProtectedRoute'
import DashboardLayout from '../../../components/DashboardLayout'   
import { useAuth } from '../../../context/AuthContext'
import PerformanceOverview from '../../../components/block-admin/PerformanceOverview'

export default function Performance() {
  const { user } = useAuth();

  return (
     <ProtectedRoute allowedRole={["Block-admin", "super-admin", "district-admin"]}>
      <DashboardLayout>
        <div className="max-w-[1600px] mx-auto p-4">
          <PerformanceOverview user={user} />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
