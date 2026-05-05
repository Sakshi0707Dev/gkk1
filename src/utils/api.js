import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
});

const setStoredToken = (token) => {
  if (!token) return;
  localStorage.setItem('token', token);
  localStorage.setItem('agri_token', token);
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || localStorage.getItem('agri_token');
    if (import.meta.env.DEV) {
      console.log('[AUTH DEBUG] token present:', Boolean(token));
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (import.meta.env.DEV) {
      console.log('[AUTH DEBUG] request headers:', config.headers);
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
        const refreshResponse = await api.post('/api/auth/refresh-token');
        const newToken =
          refreshResponse.data?.token ||
          refreshResponse.data?.data?.token ||
          refreshResponse.data?.data?.accessToken;

        setStoredToken(newToken);
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        if (import.meta.env.DEV) {
          console.log('[AUTH DEBUG] access token refreshed');
        }

        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('token');
        localStorage.removeItem('agri_token');
        localStorage.removeItem('agri_user');
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
