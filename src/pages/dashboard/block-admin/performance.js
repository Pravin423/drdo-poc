import React from 'react'
import ProtectedRoute from '../../../components/ProtectedRoute'
import DashboardLayout from '../../../components/DashboardLayout'   

export default function Performance() {
  return (
     <ProtectedRoute allowedRole={["Block-admin", "super-admin"]}>
      <DashboardLayout>
        <div className="p-8">
           <h1 className="text-2xl font-bold">Talukas Performance</h1>
           <p className="text-slate-500 mt-2">Performance metrics coming soon...</p>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
