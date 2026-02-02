import { useQuery } from "@tanstack/react-query";
import api from "../../apis/axios"

export const getProfile = () =>{return api.get("/me");}



export const useProfile = () =>
  useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,

  });

