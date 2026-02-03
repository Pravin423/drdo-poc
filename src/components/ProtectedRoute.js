"use client";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ allowedRole, children }) {
  const { user, authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;

    if (!user || user.role !== allowedRole) {
      router.push("/");
    }
  }, [user, authLoading]);

  if (authLoading) return <p>Checking session...</p>;
  if (!user || user.role !== allowedRole) return null;

  return children;
}
