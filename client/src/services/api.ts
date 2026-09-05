import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

// Add auth token to admin requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token && config.url?.includes('/admin')) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 for admin routes
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname.startsWith('/admin')) {
      localStorage.removeItem('admin_token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default api;
