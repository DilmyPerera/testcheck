import axios from 'axios';
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  clearSession,
} from './tokenStore';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

const axiosClient = axios.create({ baseURL });

axiosClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise = null;

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;

    const isAuthEndpoint = config?.url?.includes('/auth/');
    if (response?.status !== 401 || isAuthEndpoint || config._retried) {
      return Promise.reject(error);
    }

    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      clearSession();
      return Promise.reject(error);
    }

    try {
      config._retried = true;
      refreshPromise =
        refreshPromise ||
        axios.post(`${baseURL}/auth/refresh`, { refreshToken });
      const { data } = await refreshPromise;
      refreshPromise = null;

      setAccessToken(data.accessToken);
      config.headers.Authorization = `Bearer ${data.accessToken}`;
      return axiosClient(config);
    } catch (refreshError) {
      refreshPromise = null;
      clearSession();
      window.location.href = '/';
      return Promise.reject(refreshError);
    }
  },
);

export default axiosClient;
