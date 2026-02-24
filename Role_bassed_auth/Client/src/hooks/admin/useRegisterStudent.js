import { useMutation , useQueryClient } from "@tanstack/react-query";
import { registerStudentApi } from "@/services/admin.api";

export const useRegisterStudent = () => {

  const qc = useQueryClient();
  return useMutation({
    mutationFn: registerStudentApi,
    onSuccess : () =>{
      qc.invalidateQueries(['admin-students'])
    }
  });
};
