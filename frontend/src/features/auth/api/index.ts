import Cookies from "js-cookie";
import { AuthResponse, User } from "@entities/auth/model";
import axiosInstance from "@shared/api/axios-instance";
import { LoginFormData } from "../login-form/model";
import { RegisterFormData } from "../register-form/model";

export const AuthAPI = {
    login: async (data: LoginFormData): Promise<AuthResponse> => {
        try {
            const { data: response } = await axiosInstance.post<AuthResponse>("/auth/login", data);

            // Store CSRF token
            if (response.csrfToken) {
                Cookies.set("csrf-token", response.csrfToken);
            }

            return response;
        } catch (error: any) {
            console.error("Login failed:", error.response?.data?.message || error.message);
            throw error;
        }
    },
    register: async (data: RegisterFormData): Promise<AuthResponse> => {
        try {
            const { data: response } = await axiosInstance.post<AuthResponse>("/auth/register", data);

            // Store CSRF token
            if (response.csrfToken) {
                Cookies.set("csrf-token", response.csrfToken);
            }

            return response;
        } catch (error: any) {
            console.error("Registration failed:", error.response?.data?.message || error.message);
            throw error;
        }
    },
    getCurrentUser: async (): Promise<User | null> => {
        try {
            const { data } = await axiosInstance.get<AuthResponse>("/auth/me");
            return data.user || null;
        } catch (error: any) {
            // Ensure 401 errors propagate to axios interceptor
            if (error?.response?.status === 401) {
                throw error;
            }
            console.error("Failed to get current user:", error);
            return null;
        }
    },

    logout: async (): Promise<void> => {
        try {
            await axiosInstance.post("/auth/logout");
            Cookies.remove("csrf-token");
            Cookies.remove("refresh-token");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    },

    refreshToken: async (): Promise<boolean> => {
        try {
            const { data } = await axiosInstance.post<AuthResponse>("/auth/refresh");

            if (data.csrfToken) {
                Cookies.set("csrf-token", data.csrfToken);
            }

            return true;
        } catch (error) {
            console.error("Token refresh failed:", error);
            return false;
        }
    },
};
