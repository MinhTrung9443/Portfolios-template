import axios from "axios";

/** Dev: "/api" → Vite proxy. Prod on Vercel: set VITE_API_BASE_URL=https://your-service.onrender.com/api (Dashboard → Env). */
function resolveApiBaseUrl() {
  const raw = import.meta.env.VITE_API_BASE_URL;
  if (typeof raw === "string" && raw.trim() !== "") {
    return raw.trim().replace(/\/+$/, "");
  }
  return "/api";
}

const API_URL = resolveApiBaseUrl();

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await api.post("/auth/refresh");
        const { accessToken } = response.data.data;
        localStorage.setItem("accessToken", accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

// Auth API
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  verifyOtp: (data) => api.post("/auth/verify", data),
  login: (data) => api.post("/auth/login", data),
  refreshToken: (refreshToken) => api.post("/auth/refresh", refreshToken ? { refreshToken } : {}),
  resendOtp: (email) => api.post("/auth/resend-otp", { email }),
  logout: () => api.post("/auth/logout"),
};

// User API
export const userAPI = {
  getProfile: () => api.get("/user/profile"),
  updateProfile: (data) => api.put("/user/profile", data),
  uploadAvatar: (formData) => api.post("/user/upload-avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }),
};

// Portfolio API
export const portfolioAPI = {
  getPortfolios: () => api.get("/portfolio/list"),
  getPortfolio: (id) => api.get(`/portfolio/${id}`),
  createPortfolio: (data) => api.post("/portfolio/create", data),
  updatePortfolio: (id, data) => api.put(`/portfolio/${id}`, data),
  deletePortfolio: (id) => api.delete(`/portfolio/${id}`),
  getSharedPortfolio: (sharedId) => api.get(`/portfolio/shared/${sharedId}`),
};

// Template API
export const templateAPI = {
  getAllTemplates: () => api.get("/templates"),
  getTemplatesByCategory: (category) => api.get(`/templates/category/${category}`),
  getTemplatesByType: (type) => api.get(`/templates/type/${type}`),
};

export default api;
