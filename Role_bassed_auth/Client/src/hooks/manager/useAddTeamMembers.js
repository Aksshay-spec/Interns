import { useMutation , useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {addTeamMemberApi} from "@/services/manager.api"

export const useAddTeamMembers = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: addTeamMemberApi,
    onSuccess : (data) =>{
      qc.invalidateQueries(['manager-available-students'])
      qc.invalidateQueries(['manager-teams'])
      toast.success(data?.message || "Team members added successfully");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to add team members");
    },
  });
};
