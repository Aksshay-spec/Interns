import { useMutation , useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {addTaskApi} from "@/services/manager.api"

export const useAddTask = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: addTaskApi,
    onSuccess : (data) =>{
      qc.invalidateQueries(['manager-teams-tasks'])
      toast.success(data?.message || "Task assigned successfully");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to assign task");
    },
  });
};
