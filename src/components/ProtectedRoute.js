"use client";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute — two modes:
 *  1. allowedRole provided  → only that specific role can access
 *  2. no allowedRole        → any authenticated user can access (all roles)
 */
export default function ProtectedRoute({ allowedRole, children }) {
  const { user, authLoading } = useAuth();
  const router = useRouter();

  const isAllowed = !authLoading && user && (
    !allowedRole || user.role === allowedRole
  );

  useEffect(() => {
    if (authLoading) return;
    if (!isAllowed) router.push("/");
  }, [user, authLoading]);

  if (authLoading) return <p>Checking session...</p>;
  if (!isAllowed) return null;

  return children;
}
