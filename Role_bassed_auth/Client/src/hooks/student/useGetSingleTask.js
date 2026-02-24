
import { useQuery } from "@tanstack/react-query";
import { getSingleTask } from "../../services/student.api";

export const useGetSingleTask = (taskId) => {
  return useQuery({
    queryKey: ["student-task", taskId],
    queryFn: () => getSingleTask(taskId),
    enabled: !!taskId,
  });
};

