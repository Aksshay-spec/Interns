import { useQuery } from "@tanstack/react-query";
import api from "../../apis/axios"

export const fetchUser = () => {
  return api.get("/me");
};

export const useUsers = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
  });
};
 