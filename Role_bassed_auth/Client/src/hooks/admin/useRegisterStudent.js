import { useMutation } from "@tanstack/react-query";
import { registerStudentApi } from "@/services/admin.api";

export const useRegisterStudent = () => {
  return useMutation({
    mutationFn: registerStudentApi,
  });
};
