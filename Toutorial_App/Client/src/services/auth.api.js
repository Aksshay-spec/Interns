import API from "./api";

export const loginApi = (data) => {
  return API.post("/auth/login", data);
};

export const registerApi = (data) => {
  return API.post("/auth/register", data);
};