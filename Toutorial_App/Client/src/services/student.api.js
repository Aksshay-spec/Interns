import API from "./api";

// Get student dashboard data
export const getStudentDashboardApi = () => {
  return API.get("/student/dashboard");
};

//update profile
export const updateProfileApi = (formData)=>{
  return API.put("/student/profile", formData)
}