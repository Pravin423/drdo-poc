"use client";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import { getSidebarForRole } from "../config/sidebarConfig";

/**
 * ProtectedRoute — two modes:
 *  1. allowedRole provided  → only that specific role can access
 *  2. no allowedRole        → any authenticated user can access (all roles)
 *  3. Also allows access if the current path is dynamically assigned to the user via sidebarConfig
 */
export default function ProtectedRoute({ allowedRole, children }) {
  const { user, authLoading } = useAuth();
  const router = useRouter();

  const isAllowed = useMemo(() => {
    if (authLoading || !user) return false;
    
    // 1. Direct role match
    if (!allowedRole || user.role === allowedRole) return true;

    // 2. Check if the current route is granted to this user via their sidebar config (e.g. viewOnly access)
    const menus = getSidebarForRole(user.role) || [];
    let hasSidebarAccess = false;
    
    for (const group of menus) {
      if (hasSidebarAccess) break;
      for (const item of group.items || []) {
        if (item.path === router.pathname) {
          hasSidebarAccess = true;
          break;
        }
        if (item.subItems && item.subItems.some(sub => sub.path === router.pathname)) {
          hasSidebarAccess = true;
          break;
        }
      }
    }

    return hasSidebarAccess;
  }, [user, authLoading, allowedRole, router.pathname]);

  useEffect(() => {
    if (authLoading) return;
    if (!isAllowed) {
      console.warn(`[ProtectedRoute] Access denied to ${router.pathname} for role: ${user?.role}`);
      router.push("/");
    }
  }, [user, authLoading, isAllowed, router.pathname]);

  if (authLoading) return <p>Checking session...</p>;
  if (!isAllowed) return null;

  return children;
}
