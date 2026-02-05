import api from "./api";

// Manager dashboard data
export const managerDashboard = async () => {
  const res = await api.get("/manager/dashboard");
  return res.data;
};
