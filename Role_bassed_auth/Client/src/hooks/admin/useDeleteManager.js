import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteManagerApi } from"@/services/admin.api";



export const useDeleteManager = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteManagerApi,
   

    onSuccess: () => {
      // Refetch managers list
      queryClient.invalidateQueries(["managers"]);
      
    },
  });
};