import { useMutation , useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { registerStudentApi } from "@/services/manager.api";



export const useRegisterStudent = () => {

  const qc = useQueryClient();
  return useMutation({
    mutationFn: registerStudentApi,
    onSuccess : (data) =>{
      qc.invalidateQueries(['manager-students'])
      qc.invalidateQueries(['manager-available-students'])
      toast.success(data?.message || "Student added successfully");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to add student");
    },
  });
};
