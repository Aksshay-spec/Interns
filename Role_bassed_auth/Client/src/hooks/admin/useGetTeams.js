import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";

export const useGetTeams = () => {
  return useQuery({
    queryKey : ["admin-teams"],
    queryFn : async () => {
      const response = await api.get("/admin/teams");
      // console.log("Fetched students:", response.data);
      return response.data?.teams;
  }});
}


