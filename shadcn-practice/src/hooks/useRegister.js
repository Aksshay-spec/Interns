import { useMutation , useQueryClient } from "@tanstack/react-query";
import api from "../../apis/axios"



 const  registerUser =  (data) => {
  return  api.post("/register", data);
};

export const useRegister = () => {
    const queryClient = useQueryClient();
  return useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
    },
  });
};