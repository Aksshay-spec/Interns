import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteStudentApi } from"@/services/admin.api";


export const useDeleteStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteStudentApi ,

    onSuccess: () => {
      // Refetch students list
      queryClient.invalidateQueries(["admin-students"]);
    
    },
  });
};