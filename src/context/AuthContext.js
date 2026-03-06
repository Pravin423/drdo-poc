"use client";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

const INITIAL_USERS = [
  { phone: "9999999999", password: "123456", role: "super-admin" },
  { phone: "8888888888", password: "123456", role: "state-admin" },
  { phone: "7777777777", password: "123456", role: "district-admin" },
  { phone: "6666666666", password: "123456", role: "supervisor" },
  { phone: "5555555555", password: "123456", role: "finance" },
  { phone: "4444444444", password: "123456", role: "crp" },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [authLoading, setAuthLoading] = useState(true);

  // 🔄 Restore session and users on refresh
  useEffect(() => {
    // Load stored users (for persistent passwords)
    const storedUsers = localStorage.getItem("users");
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }

    // Load active logged-in user session
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setAuthLoading(false);
  }, []);

  const login = (phone, password) => {
    const foundUser = users.find(
      (u) => u.phone === phone && u.password === password
    );

    if (!foundUser) {
      return { success: false, message: "Invalid phone number or password" };
    }

    setUser(foundUser);
    localStorage.setItem("user", JSON.stringify(foundUser));

    return { success: true, role: foundUser.role };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const verifyPhone = (phone) => {
    const foundUser = users.find((u) => u.phone === phone);
    if (!foundUser) {
      return { success: false, message: "Phone number not registered" };
    }
    return { success: true };
  };

  const updatePassword = (phone, newPassword) => {
    const updatedUsers = users.map((u) => {
      if (u.phone === phone) {
        return { ...u, password: newPassword };
      }
      return u;
    });

    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    // Update local storage if the user is currently logged in
    if (user && user.phone === phone) {
      const updatedUser = { ...user, password: newPassword };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }

    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ user, authLoading, login, logout, verifyPhone, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
