import api from "./api";

// Admin dashboard
export const adminDashboard = async () => {
  const res = await api.get("/admin/dashboard");
  return res.data;
};

// Register manager / student
export const registerManagerApi = async (data) => {
  const res = await api.post("/admin/addmanager", data);
  return res.data;
};
export const registerStudentApi = async (data) => {
  const res = await api.post("/admin/addstudent", data);
  return res.data;
};