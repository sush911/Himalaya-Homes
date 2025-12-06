import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/auth",
  headers: { "Content-Type": "application/json" }
});

export const registerUser = (payload) => API.post("/register", payload);
export const loginUser = (payload) => API.post("/login", payload);
export const getMe = (token) => axios.get("http://localhost:5000/api/auth/me", { headers: { Authorization: `Bearer ${token}` } });
export const updateProfile = (payload, token) => axios.put("http://localhost:5000/api/auth/update", payload, { headers: { Authorization: `Bearer ${token}` } });

export default API;
