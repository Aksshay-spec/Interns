import { createContext, useContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = () => {
  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (!user?.role) {
      document.title = "Tutorial App";
      return;
    }

    const roleLabels = {
      superadmin: "Super Admin",
      tenant: "Tenant",
      tutor: "Tutor",
      student: "Student",
    };

    const roleTitle = roleLabels[user.role] || user.role;
    document.title = `${roleTitle} - Dashboard`;
  }, [user]);

  const login = (token, userData) => {
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    sessionStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      <Outlet />
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);