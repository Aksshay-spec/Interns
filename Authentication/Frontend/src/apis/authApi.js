const API_BASE_URL = "http://localhost:5000/api/auth";

// Get token from localStorage
const getAuthToken = () => localStorage.getItem("token");

// Login API
export const loginUser = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Login failed");
  }

  return result;
};

// Register API
export const registerUser = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    body: formData, // FormData for file upload
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Registration failed");
  }

  return result;
};

// Get User Profile API
export const getUserProfile = async () => {
  const token = getAuthToken();
  if (!token) throw new Error("No token found");

  const response = await fetch(`${API_BASE_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch profile");
  }

  const data = await response.json();
  return data.user;
};

// Update User Profile API
export const updateUserProfile = async (formData) => {
  const token = getAuthToken();
  if (!token) throw new Error("No token found");

  const response = await fetch(`${API_BASE_URL}/profile`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to update profile");
  }

  const data = await response.json();
  return data;
};

// Auth utilities
export const saveAuthData = (token, user) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

export const clearAuthData = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};
