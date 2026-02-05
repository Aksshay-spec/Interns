import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../services/api"

export const updateProfile = (data) =>
  api.put("/admin/profile", data);

export const useUpdateProfile = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      qc.invalidateQueries(["admin-dashboard"]);
    },
  });
};
