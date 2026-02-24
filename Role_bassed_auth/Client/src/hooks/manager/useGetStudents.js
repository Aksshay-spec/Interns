import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";

export const useGetStudents = () => {
  return useQuery({
    queryKey : ["manager-students"],
    queryFn : async () => {

      const response = await api.get("/manager/students");
     
      return response.data;
  }});
}


