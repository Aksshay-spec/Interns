import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeTeamMembersApi } from "@/services/manager.api";

export const useRemoveTeamMembers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeTeamMembersApi,
  
    onSuccess: () => {
      queryClient.invalidateQueries(["manager-available-students"]);
      queryClient.invalidateQueries(["manager-teams"]);
    },
  });
};