import { createContext, useContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useLogOut } from "@/hooks/auth/useAuthMutations";
import toast from "react-hot-toast";
import { socket } from "@/utils/socket";

const AuthContext = createContext(null);

export const AuthProvider = () => {
  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [roleData, setRoleData] =useState(() => {
    const storedRoledata = sessionStorage.getItem("roleData");
    return storedRoledata ? JSON.parse(storedRoledata) : null;
  });

  const { mutate } = useLogOut();
  useEffect(() => {
  if (user && socket.connected) {
    socket.emit("userOnline", user._id);
  }
}, [user]);

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

  if (!socket.connected) {
    socket.connect();
  }

  if (socket.connected) {
    socket.emit("userOnline", userData._id);
  } else {
    socket.once("connect", () => {
      socket.emit("userOnline", userData._id);
    });
  }

  setUser(userData);
};

  const logout = () => {
    mutate(
      {},
      {
        onSuccess: () => {
          sessionStorage.clear();
          setUser(null);

          // disconnect socket cleanly
          socket.disconnect();
          socket.removeAllListeners();

          toast.success("Logged Out Successfully");
        },

        onError: (err) => {
          toast.error(err?.response?.data?.message || "Logout Fail");
        },
      }
    );
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      <Outlet />
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);