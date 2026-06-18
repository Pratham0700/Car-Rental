import axios from "axios";
import {store} from '../store/store'
import { logout } from "../store/user/userSlice";
import { BASE_URL } from "../config/AppConfig";
const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

let isRefreshing = false;
let failedQueue: { resolve: (token: string) => void; reject: (error: unknown) => void }[] = [];
const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token){
      prom.resolve(token);
    }
  });
  failedQueue = [];
};
const handleAuthFailure = (error: unknown) => {
  processQueue(error, null);
  store.dispatch(logout());
  return Promise.reject(error);
};
// Request interceptor — attach access token to every request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accesstoken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle 401 and refresh token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue requests that come in while refreshing
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
      }

      originalRequest._retry = true;
      isRefreshing = true;
      try {
        const refreshToken = localStorage.getItem("refreshtoken");
          
        if (!refreshToken) {
          return handleAuthFailure(error)
        }

        const res = await axios.post(`${BASE_URL}/refresh-token`, {}, {
          headers: {
            Authorization: `Bearer ${refreshToken}`
          }
        });
        const newAccessToken = res.data.data.accessToken;
        localStorage.setItem("accesstoken", newAccessToken);

        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        handleAuthFailure(refreshError)
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;