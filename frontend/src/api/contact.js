import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const api = axios.create({
  baseURL: `${API_URL}/api/contact`,
});

export const submitContact = (data, token) =>
  api.post("/", data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getContactMessages = (status = "", token) =>
  api.get(`/?status=${status}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateContactStatus = (id, status, token) =>
  api.patch(`/${id}/status`, { status }, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteContactMessage = (id, token) =>
  api.delete(`/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export default api;

