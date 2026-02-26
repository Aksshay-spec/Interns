import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";
import { clearAuthData } from "@/apis/authApi";

export function useAuth() {
  const context = useContext(AuthContext);
  const navigate = useNavigate();

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const logout = () => {
    clearAuthData();
    context.logout();
    navigate("/login");
  };

  return {
    ...context,
    logout,
  };
}
