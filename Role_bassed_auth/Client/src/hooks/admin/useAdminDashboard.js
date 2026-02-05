import { useQuery } from "@tanstack/react-query";
import { adminDashboard } from "../../services/admin.api";

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: adminDashboard,
  });
};
