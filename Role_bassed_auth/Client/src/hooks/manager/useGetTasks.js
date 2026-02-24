import {getTasksApi} from "@/services/manager.api";
import { useQuery } from "@tanstack/react-query";


export const useGetTasks = () => {
  return useQuery({
    queryKey: ["manager-teams-tasks"],
    queryFn: getTasksApi,
  });
};



