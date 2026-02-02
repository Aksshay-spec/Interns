
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../apis/axios";

const logoutUser = () =>
 api.get("/logout");


export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.removeQueries(["me"]);
    },
  });
};
