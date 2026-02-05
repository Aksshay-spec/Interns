import api from "./api";

// Student dashboard data
export const studentDashboard = async () => {
  const res = await api.get("/student/dashboard");
  return res.data;
};
