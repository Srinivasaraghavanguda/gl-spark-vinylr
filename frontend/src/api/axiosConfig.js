import axios from 'axios';

// Base URL can be overridden with environment variable REACT_APP_API_URL
// Default to relative /api so the frontend can proxy requests in development
// and work behind a gateway in production.
const defaultBase = process.env.REACT_APP_API_URL || '/api';
const api = axios.create({
  baseURL: defaultBase,
  headers: {
    'Content-Type': 'application/json',
  },
});

// INTERCEPTOR: Automatically attach the JWT token if the user is logged in
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('vinylr_jwt');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// INTERCEPTOR: Handle expired tokens globally (Logs user out if token is dead)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('vinylr_jwt');
      window.location.href = '/login'; // Redirect to login
    }
    return Promise.reject(error);
  }
);

export default api;