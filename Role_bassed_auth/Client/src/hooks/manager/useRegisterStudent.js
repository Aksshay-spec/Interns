import { useMutation , useQueryClient } from "@tanstack/react-query";
import { registerStudentApi } from "@/services/manager.api";



export const useRegisterStudent = () => {

  const qc = useQueryClient();
  return useMutation({
    mutationFn: registerStudentApi,
    onSuccess : () =>{
      qc.invalidateQueries(['manager-students'])
      qc.invalidateQueries(['manager-available-students'])
    }
  });
};
