import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteTeamApi } from "@/services/manager.api";

export const useDeleteTeam = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: deleteTeamApi,
    onSuccess: (data) => {
      qc.invalidateQueries(["manager-teams"]);
      qc.invalidateQueries(["manager-available-students"]);
      toast.success(data?.message || "Team deleted successfully");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to delete team");
    },
  });
};
