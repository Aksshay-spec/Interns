
import { createContext, useContext, useState } from "react";

import { Outlet } from "react-router-dom";
 const AuthContext = createContext(null);

export const AuthProvider = () => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (token , userData) => {
    
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, login, logout }}
    >
      <Outlet />
    </AuthContext.Provider>
  );
};


export const useAuth = () => useContext(AuthContext);
