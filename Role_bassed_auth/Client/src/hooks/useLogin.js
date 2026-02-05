import { useMutation } from "@tanstack/react-query";
import api from "@/services/api";

export const useLogin = () => {
  return useMutation({
    mutationFn: async (credentials) => {
      const res = await api.post("/auth/login", credentials);
      return res.data; // { token, user }
    },
  });
};
