import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteStudentApi } from "@/services/manager.api";
export const useDeleteStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn:deleteStudentApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manager-students"] });
    },
  });
};