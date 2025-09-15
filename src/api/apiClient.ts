// src/api/apiClient.ts
import axios from "axios";

const baseURL = (import.meta.env.VITE_API_BASE_URL as string) || "http://localhost:8000";

const apiClient = axios.create({
  baseURL,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach authorization header (reads token from localStorage)
apiClient.interceptors.request.use((config: any) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = {
      ...(config.headers || {}),
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

export default apiClient;
