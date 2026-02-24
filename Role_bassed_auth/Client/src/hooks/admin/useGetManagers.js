import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";

export const useGetManagers = () => {
  return useQuery({
    queryKey : ["managers"],
    queryFn : async () => {
      const response = await api.get("/admin/managers");
    //   console.log("Fetched managers:", response.data);
      return response.data;
  }});
}


