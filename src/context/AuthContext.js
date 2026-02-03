"use client";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

const USERS = [
  { email: "superadmin@gov.in", password: "123456", role: "super-admin" },
  { email: "state@gov.in", password: "123456", role: "state-admin" },
  { email: "district@gov.in", password: "123456", role: "district-admin" },
  { email: "supervisor@gov.in", password: "123456", role: "supervisor" },
  { email: "finance@gov.in", password: "123456", role: "finance" },
  { email: "crp@gov.in", password: "123456", role: "crp" },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // 🔄 Restore session on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setAuthLoading(false);
  }, []);

  const login = (email, password) => {
    const foundUser = USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (!foundUser) {
      return { success: false, message: "Invalid email or password" };
    }

    setUser(foundUser);
    localStorage.setItem("user", JSON.stringify(foundUser));

    return { success: true, role: foundUser.role };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, authLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
