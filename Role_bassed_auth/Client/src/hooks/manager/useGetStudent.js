import {getStudentApi} from "@/services/manager.api";
import { useQuery } from "@tanstack/react-query";

export const useGetStudent = (sId) => {
     console.log("Hook received ID:", sId);
  return useQuery({
    queryKey: ["student", sId],
    queryFn: () => getStudentApi(sId ),
    // enabled: !!sId, // important
  });
};


