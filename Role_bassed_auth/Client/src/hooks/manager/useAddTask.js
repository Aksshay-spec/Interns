import { useMutation , useQueryClient } from "@tanstack/react-query";
import {addTaskApi} from "@/services/manager.api"

export const useAddTask = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: addTaskApi,
    onSuccess : ()=>{
      qc.invalidateQueries(['manager-teams-tasks'])
    }
  });
};
