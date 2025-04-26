import axios from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use(
    config => {
        const csrfToken = Cookies.get("csrfToken");

        if (csrfToken) {
            config.headers["X-CSRF-TOKEN"] = csrfToken;
        }
        return config; // proceed with the request
    },
    error => Promise.reject(error), // reject the request if there is an error
);

axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        // If error is 401 and we haven't tried to refresh token yet
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes("/auth/refresh")
        ) {
            originalRequest._retry = true;

            try {
                // Try to refresh the token
                await axiosInstance.post("/auth/refresh");

                // Retry the original request
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // Refresh token failed, redirect to login
                window.location.href = "/";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    },
);

export default axiosInstance;
