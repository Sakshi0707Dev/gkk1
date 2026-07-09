import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://gkk1.onrender.com';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true,
});

const setStoredToken = (token) => {
  if (!token) return;
  localStorage.setItem('token', token);
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const message = error.response?.data?.message || '';

    const isExpiredTokenError =
      status === 401 && /access token expired/i.test(message);

    if (isExpiredTokenError && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await api.post('/auth/refresh-token');
        const newToken =
          refreshResponse.data?.token ||
          refreshResponse.data?.data?.token ||
          refreshResponse.data?.data?.accessToken;

        setStoredToken(newToken);
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('token');
        localStorage.removeItem('agri_user');
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
