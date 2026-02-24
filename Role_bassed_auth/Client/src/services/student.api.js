import api from "./api";

// Student dashboard data
export const studentDashboard = async () => {
  const res = await api.get("/student/dashboard");
  return res.data;
};
export const studentTasks = async () => {
  const res = await api.get("/student/tasks");
  return res.data;
};
export const getSingleTask = async (taskId) => {
  const res = await api.get(`/student/task/${taskId}`);
  return res.data;
};
export const submitTask = async ({ taskId, status, message }) => {
  const res = await api.patch(`/student/task/${taskId}`, {
    status,
    message,
  });
  return res.data;
};


