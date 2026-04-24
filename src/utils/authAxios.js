import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const TOKEN_KEY = 'agri_token';
const USER_KEY = 'agri_user';

const authAxios = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

authAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

authAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      return Promise.reject(error);
    }

    const status = error.response.status;

    if (status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      
      const currentPath = window.location.pathname;
      if (currentPath !== '/') {
        window.location.href = '/?session_expired=1';
      } else {
        window.location.reload();
      }
    }

    return Promise.reject(error);
  }
);

export default authAxios;