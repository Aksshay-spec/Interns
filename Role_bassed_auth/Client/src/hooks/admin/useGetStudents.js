import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";

export const useGetStudents = () => {
  return useQuery({
    queryKey : ["admin-students"],
    queryFn : async () => {
      const response = await api.get("/admin/students");
    //   console.log("Fetched students:", response.data);
      return response.data;
  }});
}


