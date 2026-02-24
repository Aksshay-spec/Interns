import api from "./api";

export const loginApi = async (data) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

export const logoutApi = async () => {
  await api.post("/auth/logout");
};
