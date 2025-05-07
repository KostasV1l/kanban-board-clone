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

// Local helper function to refresh token
const refreshToken = async (): Promise<boolean> => {
    try {
        const { data } = await axiosInstance.post("/auth/refresh");
        
        if (data?.csrfToken) {
            Cookies.set("csrf-token", data.csrfToken);
        }
        
        return true;
    } catch (error) {
        console.error("Token refresh failed in interceptor helper:", error);
        return false;
    }
};

axiosInstance.interceptors.request.use(
    config => {
        const csrfToken = Cookies.get("csrf-token");

        if (csrfToken) {
            config.headers["x-csrf-token"] = csrfToken;
        }
        return config; // proceed with the request
    },
    error => Promise.reject(error), // reject the request if there is an error
);

axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        const isAuthEndpoint = 
            originalRequest.url.includes("/auth/login") ||
            originalRequest.url.includes("/auth/register");

        // If error is 401 and we haven't tried to refresh token yet
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes("/auth/refresh") &&
            !isAuthEndpoint
        ) {
            originalRequest._retry = true;

            try {
                // Try to refresh the token
                const success = await refreshToken();
                
                if (success) {
                    // Retry the original request
                    return axiosInstance(originalRequest);
                } else {
                    // Refresh failed, redirect to login
                    console.warn("Token refresh failed in interceptor");
                    window.location.href = "/";
                    return Promise.reject(new Error("Session expired"));
                }
            } catch (refreshError) {
                // Refresh token failed, redirect to login
                console.error("Token refresh error in interceptor:", refreshError);
                window.location.href = "/";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    },
);

export default axiosInstance;
