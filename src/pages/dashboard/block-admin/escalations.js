import React from 'react'
import ProtectedRoute from '../../../components/ProtectedRoute'
import DashboardLayout from '../../../components/DashboardLayout'   
import { useAuth } from '../../../context/AuthContext'
import EscalationManager from '../../../components/block-admin/EscalationManager'

export default function Escalations() {
  const { user } = useAuth();

  return (
     <ProtectedRoute allowedRole={["Block-admin", "super-admin", "district-admin"]}>
      <DashboardLayout>
        <div className="max-w-[1600px] mx-auto p-4">
          <EscalationManager user={user} />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
