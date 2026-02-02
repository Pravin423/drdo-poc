import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ allowedRole, children }) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/");
    else if (user.role !== allowedRole) router.push("/");
  }, [user]);

  if (!user || user.role !== allowedRole) return null;

  return children;
}
