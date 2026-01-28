import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api/user",
  withCredentials: true, 
});

export default api;