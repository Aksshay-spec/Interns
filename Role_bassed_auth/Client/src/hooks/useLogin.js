import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "@/services/api";

export const useLogin = () => {
  return useMutation({
    mutationFn: async (credentials) => {
      const res = await api.post("/auth/login", credentials);
      return res.data; // { token, user }
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Login successful");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Login failed");
    },
  });
};
