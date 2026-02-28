import { useMutation } from "@tanstack/react-query";
import { loginApi, registerApi } from "@/services/auth.api";

export const useLogin = () => {
  return useMutation({
    mutationFn: loginApi,
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: registerApi,
  });
};