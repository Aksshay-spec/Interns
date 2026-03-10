import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClassApi } from "@/services/class.api";

export const useCreateClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createClassApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenant-classes"] });
    },
  });
};
