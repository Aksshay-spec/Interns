import { useMutation , useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { registerStudentApi } from "@/services/admin.api";

export const useRegisterStudent = () => {

  const qc = useQueryClient();
  return useMutation({
    mutationFn: registerStudentApi,
    onSuccess : (data) =>{
      qc.invalidateQueries(['admin-students'])
      toast.success(data?.message || "Student added successfully");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to add student");
    },
  });
};
