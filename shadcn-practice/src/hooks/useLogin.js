import { useMutation } from "@tanstack/react-query";
import api from "../../apis/axios"

const loginUser = (data) => {
  return api.post("/login", data);
};

export const useLogin = () => {
  return useMutation({
    mutationFn: loginUser,
    onSuccess: (res) => {
      console.log("Login Successful", res);
    },
  });
};
