import axios from "axios";
import { BASE_URL } from "./Apipaths";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// REQUEST INTERCEPTOR
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;

    // Only set JSON for normal requests
    if (!config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;

    // Auto logout for unauthorized except login/register
    if (
      status === 401 &&
      !url.includes("/api/auth/login") &&
      !url.includes("/api/auth/register")
    ) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
