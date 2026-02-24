import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";

export const useGetAvailableStudents = () => {
  return useQuery({
    queryKey : ["manager-available-students"],
    queryFn : async () => {

      const response = await api.get("/manager/available-students");
     
      return response.data;
  }});
}


