import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const api = axios.create({ baseURL: `${API_URL}/api/agents` });

export const getAgents = (token) =>
  api.get("/", { headers: { Authorization: `Bearer ${token}` } });

export const getAgentById = (id, token) =>
  api.get(`/${id}`, { headers: { Authorization: `Bearer ${token}` } });

export const createAgent = (payload, token) =>
  api.post("/", payload, { headers: { Authorization: `Bearer ${token}` } });

export const updateAgent = (id, payload, token) =>
  api.put(`/${id}`, payload, { headers: { Authorization: `Bearer ${token}` } });

export const deleteAgent = (id, token) =>
  api.delete(`/${id}`, { headers: { Authorization: `Bearer ${token}` } });

export default api;
