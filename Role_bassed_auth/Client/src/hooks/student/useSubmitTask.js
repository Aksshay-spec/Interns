import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitTask } from "../../services/student.api";

export const useSubmitTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitTask,

    onSuccess: (data, variables) => {
      // refresh list
      queryClient.invalidateQueries({ queryKey: ["student-tasks"] });

      // refresh specific task page
      queryClient.invalidateQueries({
        queryKey: ["student-task", variables.taskId],
      });

      // manager table refresh
      queryClient.invalidateQueries({ queryKey: ["manager-teams-tasks"] });
    },
  });
};
