import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "../../services/api"

export const updateProfile = (data) =>
  api.put("/manager/profile", data);

export const useUpdateManagerProfile = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      qc.invalidateQueries(["manager-dashboard"]);
      toast.success(data?.message || "Profile updated successfully");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    },
  });
};
