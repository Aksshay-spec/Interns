import { useMutation } from "@tanstack/react-query";
import { registerManagerApi } from "@/services/admin.api";

export const useRegisterManager = () => {
  return useMutation({
    mutationFn: registerManagerApi,
  });
};
