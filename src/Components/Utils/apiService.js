import axios from 'axios';
import { getSessionToken, removeSessionAndLogoutUser } from './authentication';

// Lấy URL của API từ biến môi trường trong React
const ApiService = axios.create({
  baseURL: "http://localhost:8080"
});

/**
 * Interceptor for all requests
 */
ApiService.interceptors.request.use(
  (config) => {
    config.headers['Content-Type'] = 'application/json';

    const token = getSessionToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Interceptor for all responses
 */
ApiService.interceptors.response.use(
  (response) => response?.data || {},

  async (error) => {
    const originalRequest = error.config;

    if (error?.response?.data?.result_code === 11) {
      removeSessionAndLogoutUser();
    }

    if (error?.response?.status === 401 && !originalRequest?._retry) {
      removeSessionAndLogoutUser();
    }

    return Promise.reject(error);
  }
);

export default ApiService;
