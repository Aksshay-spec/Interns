import API from "./api"

// Get all pending tenant requests
export const getPendingTenantsApi = () => {
  return API.get("/admin/tenants/pending");
};

// Get all tenants
export const getAllTenantsApi = () => {
  return API.get("/admin/tenants");
};

// Approve tenant
export const approveTenantApi = (tenantId) => {
  return API.patch(`/admin/tenants/${tenantId}/approve`);
};

// Reject tenant
export const rejectTenantApi = (tenantId) => {
  return API.patch(`/admin/tenants/${tenantId}/reject`);
};

// Block tenant
export const blockTenantApi = (tenantId) => {
  return API.patch(`/admin/tenants/${tenantId}/block`);
};

export default API;