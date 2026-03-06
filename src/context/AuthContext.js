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

  // 🔐 Real API Login — Super Admin only
  const login = async (phone, password) => {
    try {
      // Call the local Next.js proxy to avoid CORS errors
      const response = await fetch(`/api/auth?action=login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mobile: phone, password }),
      });

      const data = await response.json();

      // API returns status:true on success (not HTTP status codes in some cases)
      if (!data?.status) {
        return {
          success: false,
          message: data?.message || "Login failed. Please try again.",
        };
      }

      // ✅ Role is at data.data.role_name = "Super Admin"
      const roleName = (data?.data?.role_name || "").trim();

      if (roleName !== "Super Admin") {
        return {
          success: false,
          message: "Access denied. Only Super Admins can log in here.",
        };
      }

      // ✅ Token is at data.token
      const token = data?.token || "";

      const userData = {
        id: data?.data?.id,
        phone: data?.data?.mobile,
        name: data?.data?.fullname || "Super Admin",
        email: data?.data?.email,
        role: "super-admin",
        role_name: roleName,
        profile: data?.data?.profile || "",
      };

      // 💾 Persist to localStorage so session survives page refresh
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(userData));

      setUser(userData);

      return { success: true, role: "super-admin" };
    } catch (err) {
      console.error("Login error:", err);
      return {
        success: false,
        message: "Network error. Please check your connection and try again.",
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
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
