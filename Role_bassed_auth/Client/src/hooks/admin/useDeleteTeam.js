import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTeamApi } from "@/services/admin.api";
import toast from "react-hot-toast";

export const useDeleteTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTeamApi, 

    onSuccess: (data) => {
      

     
      queryClient.invalidateQueries(["admin-teams"]);
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to delete team"
      );
    },
  });
};