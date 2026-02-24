import { useMutation ,useQueryClient } from "@tanstack/react-query";
import { registerManagerApi } from "@/services/admin.api";


export const useRegisterManager = () => {
  const qc = useQueryClient();
  
  return useMutation({
    mutationFn: registerManagerApi,
    onSuccess: () => {
      qc.invalidateQueries(["managers"]);
      },
  });
};
