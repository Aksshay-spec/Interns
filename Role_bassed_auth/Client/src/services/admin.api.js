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

export const deleteManagerApi = async (managerId) => {
      const { data } = await api.delete(
        `/admin/manager/${managerId}`
      );
      return data;
    }
export const deleteStudentApi = async (studentId) => {
      const { data } = await api.delete(
        `/admin/student/${studentId}`
      );
      return data;
    }
export const deleteTeamApi = async (teamId) => {
      const { data } = await api.delete(
        `/admin/teams/${teamId}`
      );
      return data;
    }