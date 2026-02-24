import { getCompletedTasksApi } from "@/services/manager.api";
import { useQuery } from "@tanstack/react-query";

export const useGetCompletedTasks = () => {
  return useQuery({
    queryKey: ["manager-completed-tasks"],
    queryFn: getCompletedTasksApi,
  });
};
