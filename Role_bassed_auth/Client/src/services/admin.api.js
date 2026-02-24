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

export const deleteStudentAdminApi = async (studentId) => {
  const res = await api.delete(`/admin/student/${studentId}`);
  return res.data;
};

export const deleteManagerAdminApi = async (managerId) => {
  const res = await api.delete(`/admin/manager/${managerId}`);
  return res.data;
};

export const deleteTeamAdminApi = async (teamId) => {
  const res = await api.delete(`/admin/team/${teamId}`);
  return res.data;
};