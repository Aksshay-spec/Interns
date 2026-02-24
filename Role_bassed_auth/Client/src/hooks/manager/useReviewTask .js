import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewTaskApi } from "../../services/manager.api";

export const useReviewTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reviewTaskApi,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manager-teams-tasks"] });
      queryClient.invalidateQueries({ queryKey: ["student-tasks"] });
      queryClient.invalidateQueries({ queryKey: ["completed-tasks"] });
    },
  });
};
