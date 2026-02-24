import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeTeamApi } from "@/services/manager.api";


export const useDeleteTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeTeamApi, 

  
    onSuccess: () => {
      queryClient.invalidateQueries( ["manager-teams"] );
    },

    onError: (error) => { 
      console.error(
        error?.response?.data?.message || "Failed to delete team"
      );
    },
  });
};