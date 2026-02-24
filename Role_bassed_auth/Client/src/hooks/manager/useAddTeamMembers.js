import { useMutation , useQueryClient } from "@tanstack/react-query";
import {addTeamMemberApi} from "@/services/manager.api"

export const useAddTeamMembers = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: addTeamMemberApi,
    onSuccess : ()=>{
      qc.invalidateQueries(['manager-available-student'])
    }
  });
};
