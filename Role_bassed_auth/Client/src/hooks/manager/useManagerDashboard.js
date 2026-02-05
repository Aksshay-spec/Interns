import { useQuery } from "@tanstack/react-query";
import { managerDashboard } from "../../services/manager.api";

export const useManagerDashboard = () => {
  return useQuery({
    queryKey: ["manager-dashboard"],
    queryFn: managerDashboard,
  });
};
