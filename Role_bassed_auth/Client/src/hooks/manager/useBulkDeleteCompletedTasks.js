import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bulkDeleteCompletedTaskApi } from "@/services/manager.api";


export const useBulkDeleteCompletedTasks = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkDeleteCompletedTaskApi,

    onSuccess: () => {
      // Refetch completed tasks list
      queryClient.invalidateQueries(["manager-completed-tasks"]);
    },
  });
};