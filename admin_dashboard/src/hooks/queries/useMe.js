import { useQuery } from "@tanstack/react-query";
import api  from "../../apis/axios";


const getMe = () =>
  api.get("/me");

export const useMe = () =>
  useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    retry: false,
  });
