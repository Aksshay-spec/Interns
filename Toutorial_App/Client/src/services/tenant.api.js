import API from "./api";

// Register Tutor
export const registerTutorApi = (data) => {
  return API.post("/tenant/register/tutor", data);
};

// Get all tutors of logged-in tenant
export const getTenantTutorsApi = () => {
  return API.get("/tenant/tutors");
};

// Delete tutor
export const deleteTutorApi = (tutorId) => {
  return API.delete(`/tenant/${tutorId}`);
};