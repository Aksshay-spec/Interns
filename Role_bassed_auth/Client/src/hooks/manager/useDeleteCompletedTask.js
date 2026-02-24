import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCompletedTaskApi } from "@/services/manager.api";
import toast from "react-hot-toast";

export const useDeleteCompletedTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCompletedTaskApi,
    onSuccess: () => {
      queryClient.invalidateQueries(["manager-completed-tasks"]);
      toast.success("Task deleted successfully");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to delete task");
    },
  });
};
