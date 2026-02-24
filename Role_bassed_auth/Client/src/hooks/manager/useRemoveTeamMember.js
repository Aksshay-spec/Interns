import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { removeTeamMemberApi } from "@/services/manager.api";

export const useRemoveTeamMember = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: removeTeamMemberApi,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["manager-teams"] });
      qc.invalidateQueries({ queryKey: ["manager-available-students"] });
      toast.success(data?.message || "Student removed from team");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to remove student from team");
    },
  });
};
