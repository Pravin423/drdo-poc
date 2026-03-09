"use client";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // 🔄 Restore session from localStorage on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("authToken");
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setAuthLoading(false);
  }, []);

  // 🗺️ Maps API role_name → internal role key + dashboard path
  const ROLE_MAP = {
    "Super Admin":    { role: "super-admin",    dashboard: "/dashboard/super-admin" },
    "State Admin":    { role: "state-admin",     dashboard: "/dashboard/state-admin" },
    "District Admin": { role: "district-admin",  dashboard: "/dashboard/district-admin" },
    "Supervisor":     { role: "supervisor",       dashboard: "/dashboard/supervisor" },
    "Finance":        { role: "finance",          dashboard: "/dashboard/finance" },
    "CRP":            { role: "crp",              dashboard: "/dashboard/crp" },
  };

  // 🔐 Real API Login — all roles supported
  const login = async (phone, password) => {
    try {
      console.log("%c[API] 🔐 POST /api/auth?action=login", "color: #3b82f6; font-weight: bold", { mobile: phone });
      const response = await fetch(`/api/auth?action=login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: phone, password }),
      });
      console.log("%c[API] ✅ Login response status:", "color: #22c55e; font-weight: bold", response.status);

      const data = await response.json();

      if (!data?.status) {
        return {
          success: false,
          message: data?.message || "Login failed. Please try again.",
        };
      }

      // Resolve the role from API response
      const roleName = (data?.data?.role_name || "").trim();
      const mapped = ROLE_MAP[roleName];

      if (!mapped) {
        console.warn("[Auth] Unknown role from API:", roleName);
        return {
          success: false,
          message: `Access denied. Unrecognised role: "${roleName}".`,
        };
      }

      console.log("%c[Auth] ✅ Role resolved:", "color: #8b5cf6; font-weight: bold", roleName, "→", mapped.role);

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

      localStorage.setItem("authToken", token);
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
      const token = localStorage.getItem("authToken");
      if (token) {
        // Call the real logout API via server-side proxy (avoids CORS)
        console.log("%c[API] 🚪 POST /api/auth?action=logout", "color: #f59e0b; font-weight: bold");
        await fetch(`/api/auth?action=logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("%c[API] ✅ Logout API called successfully", "color: #22c55e; font-weight: bold");
      }
    } catch (err) {
      console.error("Logout API error (session cleared locally anyway):", err);
    } finally {
      // Always clear local session — even if the API call fails
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
    }
  };

  // These methods remain for forgot-password / OTP flow (can be wired to real API later)
  const verifyPhone = (phone) => {
    // TODO: Hook to real OTP API
    return { success: true };
  };

  const updatePassword = (phone, newPassword) => {
    // TODO: Hook to real password-reset API
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
