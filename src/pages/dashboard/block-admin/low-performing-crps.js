import React from 'react'
import ProtectedRoute from '../../../components/ProtectedRoute'
import DashboardLayout from '../../../components/DashboardLayout'   
import { useAuth } from '../../../context/AuthContext'
import LowPerformingCRPs from '../../../components/block-admin/LowPerformingCRPs'

export default function LowPerformingCRPsPage() {
  const { user } = useAuth();

  return (
     <ProtectedRoute allowedRole={["Block-admin", "super-admin", "district-admin"]}>
      <DashboardLayout>
        <div className="max-w-[1600px] mx-auto p-4">
          <LowPerformingCRPs user={user} />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
