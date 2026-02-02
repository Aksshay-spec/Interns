import { createContext, useContext } from "react";
import { useMe } from "@/hooks/queries/useMe";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { data, isLoading } = useMe();

  const user = data?.data?.user;

  const value = {
        user,
        isAuthenticated: !!user,
        isLoading,
      }

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
