import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "../../services/api"

export const updateProfile = (data) =>
  api.put("/student/profile", data);

export const useUpdateStudentProfile = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      qc.invalidateQueries(["student-dashboard"]);
      toast.success(data?.message || "Profile updated successfully");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    },
  });
};
