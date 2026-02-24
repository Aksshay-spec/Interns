import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "../../services/api"

export const updateProfile = (data) =>
  api.put("/admin/profile", data);

export const useUpdateProfile = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      qc.invalidateQueries(["admin-dashboard"]);
      toast.success(data?.message || "Profile updated successfully");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    },
  });
};
