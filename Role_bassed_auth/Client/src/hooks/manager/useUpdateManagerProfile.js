import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../services/api"

export const updateProfile = (data) =>
  api.put("/manager/profile", data);

export const useUpdateManagerProfile = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      qc.invalidateQueries(["manager-dashboard"]);
    },
  });
};
