import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { reviewTaskApi } from "../../services/manager.api";

export const useReviewTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reviewTaskApi,

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["manager-teams-tasks"] });
      queryClient.invalidateQueries({ queryKey: ["student-tasks"] });
      queryClient.invalidateQueries({ queryKey: ["manager-completed-tasks"] });
      toast.success(data?.message || "Task reviewed successfully");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to review task");
    },
  });
};
