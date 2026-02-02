import { useMutation, useQueryClient } from "@tanstack/react-query";

import  api  from "../../apis/axios";

const loginUser = (data) =>
  api.post("/login", data);

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["me"]);
    },
  });
};