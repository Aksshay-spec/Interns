import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bulkDeleteCompletedTasksApi } from "@/services/manager.api";
import toast from "react-hot-toast";

export const useBulkDeleteCompletedTasks = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkDeleteCompletedTasksApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["manager-completed-tasks"]);
      toast.success(data.message || "Tasks deleted successfully");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to delete tasks");
    },
  });
};
