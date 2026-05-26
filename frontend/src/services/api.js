import axios from "axios";

const rawApiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";
const apiBaseUrl = rawApiUrl.replace(/\/api\/?$/, "");

const api = axios.create({
  baseURL: apiBaseUrl,
});

// Interceptor para adicionar o token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
