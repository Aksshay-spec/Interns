import { useMutation ,useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { registerManagerApi } from "@/services/admin.api";


export const useRegisterManager = () => {
  const qc = useQueryClient();
  
  return useMutation({
    mutationFn: registerManagerApi,
    onSuccess: (data) => {
      qc.invalidateQueries(["managers"]);
      toast.success(data?.message || "Manager added successfully");
      },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to add manager");
    },
  });
};
