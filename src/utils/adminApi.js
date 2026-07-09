import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://gkk1.onrender.com';

const adminApi = axios.create({
  baseURL: `${API_BASE_URL}/api/admin`,
  withCredentials: true,
});

adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default adminApi;
