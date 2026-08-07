import axios from 'axios';

const defaultBase =
  process.env.REACT_APP_API_URL || "http://localhost:8086/api";

const api = axios.create({
  baseURL: defaultBase,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("vinylr_jwt");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("vinylr_jwt");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;