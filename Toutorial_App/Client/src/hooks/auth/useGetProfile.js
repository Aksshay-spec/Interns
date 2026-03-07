import { useQuery } from "@tanstack/react-query";

import { getProfileApi } from "@/services/auth.api";


export const useGetProfile = () => {
  return useQuery({
    queryKey: ["my-profile"],
    queryFn: getProfileApi,
  });
};