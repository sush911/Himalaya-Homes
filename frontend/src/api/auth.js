import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/auth"
});

export const registerUser = (payload) => {
  // If payload is FormData, don't set Content-Type (let browser set it with boundary)
  if (payload instanceof FormData) {
    return axios.post("http://localhost:5000/api/auth/register", payload);
  }
  // Otherwise use JSON
  return API.post("/register", payload);
};

export const loginUser = (payload) =>
  API.post("/login", payload, {
    headers: { "Content-Type": "application/json" }
  });

export const getMe = (token) =>
  axios.get("http://localhost:5000/api/auth/me", {
    headers: { Authorization: `Bearer ${token}` }
  });

export const updateProfile = (payload, token) =>
  axios.put("http://localhost:5000/api/auth/update", payload, {
    headers: { Authorization: `Bearer ${token}` }
  });

//  ADDED AS YOU REQUESTED

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const requestPasswordReset = (email) => {
  return axios.post(`${API_URL}/api/auth/forgot-password`, { email });
};

export const resetPassword = (data) => {
  return axios.post(`${API_URL}/api/auth/reset-password`, data);
};

export default API;
