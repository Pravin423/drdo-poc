"use client";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    // We check for user data; token is now securely stored in an HttpOnly cookie
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setAuthLoading(false);
  }, []);

  // Normalize: lowercase, collapse spaces, replace ALL dash variants with a plain hyphen
  const normalizeRole = (s) =>
    s.toLowerCase().replace(/[\u2013\u2014\u2012\u2010\-]/g, "-").replace(/\s+/g, " ").trim();

  const ROLE_MAP = [
    { match: "super admin",                          role: "super-admin",    dashboard: "/dashboard/super-admin" },
    { match: "state program manager - mis",          role: "state-admin",    dashboard: "/dashboard/state-admin" },
    { match: "state program manager - hr",           role: "state-admin",    dashboard: "/dashboard/state-admin" },
    { match: "block manager",                        role: "district-admin", dashboard: "/dashboard/district-admin" },
    { match: "block program manager",                role: "district-admin", dashboard: "/dashboard/district-admin" },
    { match: "block resource person",                role: "supervisor",     dashboard: "/dashboard/supervisor" },
    { match: "internal mentor im",                   role: "supervisor",     dashboard: "/dashboard/supervisor" },
    { match: "block coordinator - bc",               role: "supervisor",     dashboard: "/dashboard/supervisor" },
    { match: "community resource person",            role: "crp",            dashboard: "/dashboard/crp" },
  ];

  const resolveRole = (roleName) => {
    const normalized = normalizeRole(roleName);
    return ROLE_MAP.find(entry => normalizeRole(entry.match) === normalized) || null;
  };

  const login = async (phone, password) => {
    try {
      const response = await fetch(`/api/auth?action=login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: phone, password }),
      });

      const data = await response.json();
      
      if (!response.ok || data?.status === false || data?.status === 0) {
        const rawMessage = data?.error || data?.message;
        let errorMessage = "Login failed. Please try again.";
        
        if (typeof rawMessage === "string") {
          errorMessage = rawMessage;
        } else if (rawMessage && typeof rawMessage === "object") {
          // If it's an object/array, get the first value
          const firstVal = Object.values(rawMessage)[0];
          if (Array.isArray(firstVal)) {
            errorMessage = firstVal[0];
          } else if (typeof firstVal === "string") {
            errorMessage = firstVal;
          }
        }
        return { success: false, message: errorMessage };
      }

      const roleName = (data?.data?.role_name || "").trim();
      const mapped = resolveRole(roleName);

      if (!mapped) {
        // Print exact char codes to debug any dash/space mismatch
        const codes = [...roleName].map(c => `U+${c.charCodeAt(0).toString(16).toUpperCase().padStart(4,"0")}`).join(" ");
        console.warn("[Auth] Unknown role — exact chars:", JSON.stringify(roleName), "\n", codes);
        return {
          success: false,
          message: `Access denied. Role "${roleName}" is not configured. Contact your administrator.`,
        };
      }

      const token = data?.token || "";
      const userData = {
        id:        data?.data?.id,
        phone:     data?.data?.mobile,
        name:      data?.data?.fullname || roleName,
        email:     data?.data?.email,
        role:      mapped.role,
        role_name: roleName,
        profile:   data?.data?.profile || "",
      };

      // authToken is intentionally not stored in localStorage anymore as it is managed via HttpOnly cookie
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      return { success: true, role: mapped.role, dashboard: mapped.dashboard };
    } catch (err) {
      console.error("Login error:", err);
      return {
        success: false,
        message: "Network error. Please check your connection and try again.",
      };
    }
  };

  const logout = async () => {
    try {
      console.log("%c[API] 🚪 POST /api/auth?action=logout", "color: #f59e0b; font-weight: bold");
      await fetch(`/api/auth?action=logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("%c[API] ✅ Logout API called successfully", "color: #22c55e; font-weight: bold");
    } catch (err) {
      console.error("Logout API error (session cleared locally anyway):", err);
    } finally {
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
    }
  };

  const verifyPhone = (phone) => {
    return { success: true };
  };

  const updatePassword = (phone, newPassword) => {
    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{ user, authLoading, login, logout, verifyPhone, updatePassword }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
