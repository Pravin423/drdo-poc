"use client";
import ProtectedRoute from "../../components/ProtectedRoute";
import DashboardLayout from "../../components/DashboardLayout";





/* ---------------- PAGE ---------------- */
export default function AttendanceManagement() {

    return (
        <ProtectedRoute allowedRole="super-admin">


            <DashboardLayout>

            </DashboardLayout>



        </ProtectedRoute>
    );
} 