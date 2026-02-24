import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCompletedTaskApi } from "@/services/manager.api";


export const useDeleteCompletedTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCompletedTaskApi,

    onSuccess: () => {
      // Refetch completed tasks list
      queryClient.invalidateQueries(["manager-completed-tasks"]);
    },
  });
};