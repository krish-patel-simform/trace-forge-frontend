import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("tf_access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-refresh token logic can be added here in response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("tf_refresh_token");
        if (refreshToken) {
          const res = await axios.post(
            `${apiClient.defaults.baseURL}/auth/refresh`,
            { refreshToken },
          );
          const newAccessToken = res.data.accessToken;
          localStorage.setItem("tf_access_token", newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        }
      } catch (e) {
        localStorage.removeItem("tf_access_token");
        localStorage.removeItem("tf_refresh_token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);
