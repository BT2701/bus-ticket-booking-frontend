import axios from 'axios';
import { getRefreshToken, getSessionToken, removeSessionAndLogoutUser, setSessionAccessAndRefreshToken } from './authentication';
import notificationWithIcon from './notification';


// Lấy URL của API từ biến môi trường trong React
const ApiService = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true
});

/**
 * Interceptor for all requests
 */
ApiService.interceptors.request.use(
  (config) => {
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    } else {
      // Nếu là FormData, để trống để trình duyệt tự động thiết lập
      config.headers['Content-Type'] = "multipart/form-data";
    }

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

    // Kiểm tra lỗi 403 Forbidden
    if (error.response.status === 403) {
      // notificationWithIcon('error', 'Lỗi', 'Bạn không có quyền truy cập vào địa chỉ này!');
      return Promise.reject(error.response?.data || 'Bạn không có quyền thực hiện hành động này!'); 
    }
    
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Đảm bảo không lặp lại request
      try {
          const refreshToken = getRefreshToken();
          if(refreshToken === null) {
            // Nếu không có refresh token vì không nhớ mật khẩu
            removeSessionAndLogoutUser();
            notificationWithIcon('error', 'Lỗi', 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
            
            setTimeout(() => {
              window.location.href = '/login';
            }, 1000) 
  

            return Promise.reject('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'); 
          }
          const response = await axios.post('http://localhost:8080/api/customers/refreshToken', { refreshToken });
          const { access_token: accessToken, refresh_token: newRefreshToken } = response.data.data;
          setSessionAccessAndRefreshToken(accessToken, newRefreshToken);
          ApiService.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          return ApiService(originalRequest); // Gửi lại request với access token mới
      } catch (refreshError) {
          // Nếu refresh token hết hạn hoặc không hợp lệ
          removeSessionAndLogoutUser();
          notificationWithIcon('error', 'Lỗi', 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
          
          setTimeout(() => {
            window.location.href = '/login';
          }, 1000) 

          return Promise.reject('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'); 
      }
    }


    return Promise.reject(error);
  }
);

export default ApiService;
