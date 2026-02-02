import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../apis/axios"

export const updateProfile = (data) =>
  api.post("/update-profile", data);

export const useUpdateProfile = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      qc.invalidateQueries(["me"]);
    },
  });
};
