import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const api = axios.create({
  baseURL: `${API_URL}/api/properties`,
});

export const submitPropertyRequest = (payload, token) =>
  api.post("/requests", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getMyRequests = (token) =>
  api.get("/requests/mine", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const fetchPropertyRequests = (status = "pending", token) =>
  api.get(`/requests/all?status=${status}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const approveRequest = (id, token) =>
  api.patch(`/requests/${id}/approve`, null, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const rejectRequest = (id, token) =>
  api.patch(`/requests/${id}/reject`, null, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const listProperties = (params = {}) => api.get("/", { params });
export const getPropertyById = (id) => api.get(`/${id}`);

export const toggleFavorite = (id, token) =>
  api.post(`/${id}/favorite`, null, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getFavorites = (token) =>
  api.get(`/user/favorites/list`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getMyProperties = (token) =>
  api.get(`/user/mine`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const reportProperty = (id, reason, token) =>
  api.post(`/${id}/report`, { reason }, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getContactInfo = (id, token) =>
  api.get(`/${id}/contact`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const uploadFiles = (files, folder, token) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  formData.append("folder", folder);
  return api.post("/upload", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const fetchNearby = (lat, lng) =>
  api.post("/nearby/overpass", { lat, lng });

export const deleteProperty = (id, token) =>
  api.delete(`/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getAllProperties = (token) =>
  api.get("/all", {
    headers: { Authorization: `Bearer ${token}` },
  });

export default api;

