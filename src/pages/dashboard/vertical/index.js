import ProtectedRoute from "../../../components/ProtectedRoute";
import VerticalManagementComponent from "../../../components/super-admin/vertical";

export default function VerticalManagement() {
    return (
        <ProtectedRoute allowedRole={["super-admin", "state-admin"]}>
            <VerticalManagementComponent />
        </ProtectedRoute>
    );
}
