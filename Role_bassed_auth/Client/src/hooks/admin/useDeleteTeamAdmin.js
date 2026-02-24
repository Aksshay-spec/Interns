import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteTeamAdminApi } from "@/services/admin.api";

export const useDeleteTeamAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTeamAdminApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["admin-teams"]);
      queryClient.invalidateQueries(["admin-dashboard"]);
      toast.success(data?.message || "Team deleted successfully");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to delete team");
    },
  });
};
