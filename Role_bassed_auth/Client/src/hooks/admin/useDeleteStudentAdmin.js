import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteStudentAdminApi } from "@/services/admin.api";

export const useDeleteStudentAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteStudentAdminApi,
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-students"]);
      queryClient.invalidateQueries(["admin-teams"]);
      queryClient.invalidateQueries(["admin-dashboard"]);
      toast.success("Student deleted successfully");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to delete student");
    },
  });
};
