import API from "./api";

// Get all pending tenant requests
export const getPendingTenantsApi = () => {
  return API.get("/admin/tenants/pending");
};

// Get all tenants
export const getAllTenantsApi = (page = 1, limit = 10) => {
  return API.get(`/admin/tenants?page=${page}&limit=${limit}`);
};

// Approve tenant
export const approveTenantApi = (tenantId) => {
  return API.patch(`/admin/tenants/${tenantId}/approve`);
};
// inactive tenant
export const makeTenantInactiveApi = (tenantId) => {
  return API.patch(`/admin/tenants/${tenantId}/inactive`);
};



// Block tenant
export const blockTenantApi = (tenantId) => {
  return API.patch(`/admin/tenants/${tenantId}/block`);
};

//get Online Users
export const getOnlineUsersApi = ()=>{
  return API.get("/admin/online-users");
}

//update profile
export const updateProfileApi = (formData)=>{
  return API.put("/admin/profile", formData)
}
export default API;