import api from "./api";

// Manager dashboard data
export const managerDashboard = async () => {
  const res = await api.get("/manager/dashboard");
  return res.data;
};

// Adding student
export const registerStudentApi = async (data) => {
  const res = await api.post("/manager/addstudent",data);
  return res.data;
};
export const getTeamsApi = async () => {
  const res = await api.get("/manager/teams");
  return res.data;
};
export const deleteTeamApi = async (teamId) => {
  const res = await api.delete(`/manager/team/${teamId}`);
  return res.data;
};
export const getStudentApi = async (sId) => {
  const res = await api.get(`/manager/student/${sId}`);
  return res.data;
};
export const addTaskApi = async (data) => {
  const res = await api.post(`/manager/addtask`, data);
  return res.data;
};
export const getTasksApi = async () => {
  const res = await api.get(`/manager/task`);
  return res.data;
};

export const addTeamMemberApi = async ({ teamId, studentIds }) => {
      const res = await api.post(
        `/manager/${teamId}/addmembers`,
        { studentIds }
      );
      return res.data;
};

export const removeTeamMemberApi = async ({ teamId, studentId }) => {
  const res = await api.delete(`/manager/${teamId}/members/${studentId}`);
  return res.data;
};

export const reviewTaskApi = async ({ taskId, studentId, status, remark }) => {
  const res = await api.patch(`/manager/task/review/${taskId}`, {
    studentId,
    status,
    remark,
  });
  return res.data;
};

export const getCompletedTasksApi = async () => {
  const res = await api.get(`/manager/task/completed-tasks`);
  return res.data;
};

export const deleteCompletedTaskApi = async (taskId) => {
  const res = await api.delete(`/manager/task/completed-tasks/${taskId}`);
  return res.data;
};

export const bulkDeleteCompletedTasksApi = async (taskIds) => {
  const res = await api.post(`/manager/task/completed-tasks/bulk-delete`, { taskIds });
  return res.data;
};

export const deleteStudentApi = async (studentId) => {
  const res = await api.delete(`/manager/student/${studentId}`);
  return res.data;
};
