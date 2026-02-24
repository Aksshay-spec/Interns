import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteStudentApi } from "@/services/manager.api";
import toast from "react-hot-toast";

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteStudentApi,
    onSuccess: () => {
      queryClient.invalidateQueries(["manager-students"]);
      queryClient.invalidateQueries(["manager-teams"]);
      queryClient.invalidateQueries(["manager-available-students"]);
      queryClient.invalidateQueries(["manager-teams-tasks"]);
      queryClient.invalidateQueries(["manager-completed-tasks"]);
      toast.success("Student deleted successfully");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to delete student");
    },
  });
};
