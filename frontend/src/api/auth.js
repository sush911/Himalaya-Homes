import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/auth",
});

// REGISTER
export const registerUser = (formData) => API.post("/register", formData);

// LOGIN
export const loginUser = (formData) => API.post("/login", formData);
