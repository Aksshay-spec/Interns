import { createContext, useContext, useState } from "react";
import API from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const userInfo = localStorage.getItem("userInfo");
    return userInfo ? JSON.parse(userInfo) : null;
  });

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("userInfo", JSON.stringify(userData));
    localStorage.setItem(`${userData.role} Token`, userData.token);
    localStorage.setItem(`${userData.role} Name`, userData.name);
  };

  const logout = async () => {
    try {
      await API.post("/api/auth/logout", {}, { withCredentials: true }); // ⬅️ Important!
    } catch (err) {
      console.error("Logout error", err);
    }
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);