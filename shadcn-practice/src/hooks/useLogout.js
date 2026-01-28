import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../apis/axios";

export const logoutUser = () => {
  return api.get("/logout");
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
     
      queryClient.removeQueries(["me"]);
      queryClient.removeQueries(["profile"]);
    },
  });
};
