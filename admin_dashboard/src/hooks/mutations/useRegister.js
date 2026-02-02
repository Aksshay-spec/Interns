import { useMutation } from "@tanstack/react-query";
import api  from "../../apis/axios";

 const registerUser = (data) =>
  api.post("/register", data);

export const useRegister = () =>
  useMutation({ mutationFn: registerUser });
