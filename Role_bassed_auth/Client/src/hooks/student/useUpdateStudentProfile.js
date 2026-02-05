import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../services/api"

export const updateProfile = (data) =>
  api.put("/student/profile", data);

export const useUpdateStudentProfile = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      qc.invalidateQueries(["student-dashboard"]);
    },
  });
};
