import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteClassApi } from "@/services/class.api";

export const useDeleteClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteClassApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenant-classes"] });
    },
  });
};
