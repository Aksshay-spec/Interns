import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteManagerAdminApi } from "@/services/admin.api";

export const useDeleteManagerAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteManagerAdminApi,
    onSuccess: () => {
      queryClient.invalidateQueries(["managers"]);
      queryClient.invalidateQueries(["admin-teams"]);
      queryClient.invalidateQueries(["admin-dashboard"]);
      toast.success("Manager deleted successfully");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to delete manager");
    },
  });
};
