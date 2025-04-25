import { LoginFormData } from "@/features/auth/login-form/model";
import { AuthResponse, RegisterFormData } from "./types";

// Base API functions for auth operations -> Used in Tanstack Query hooks
export const AuthAPI = {
    // User login
    login: async (data: LoginFormData): Promise<AuthResponse> => {
        try {
            // TODO: Change to actual API endpoint
            const res = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Login failed");
            }

            const authData = await res.json();

            // Store the token
            if (authData.token) {
                localStorage.setItem("jwt", authData.token);
            }

            return authData;
        } catch (error) {
            console.error("Login request failed:", error);
            throw error;
        }
    },

    // User registration
    register: async (data: RegisterFormData): Promise<AuthResponse> => {
        try {
            // TODO: Change to actual API endpoint
            const res = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Registration failed");
            }

            const authData = await res.json();

            // Store the token
            if (authData.token) {
                localStorage.setItem("jwt", authData.token);
            }

            return authData;
        } catch (error) {
            console.error("Registration request failed:", error);
            throw error;
        }
    },

    // Get current user session
    getCurrentUser: async (): Promise<AuthResponse["user"] | null> => {
        try {
            const token = localStorage.getItem("jwt");

            if (!token) {
                return null;
            }

            // TODO: Check actual API endpoint
            const res = await fetch("/api/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error("Failed to get user info");
            }

            return res.json();
        } catch (error) {
            console.error("Get current user failed:", error);
            // On error, clear the token
            localStorage.removeItem("jwt");
            return null;
        }
    },

    // Log out
    logout: async (): Promise<void> => {
        localStorage.removeItem("jwt");
    },

    //===========================
    // Auth token helpers
    //===========================
    getToken: (): string | null => {
        return localStorage.getItem("jwt");
    },

    isAuthenticated: (): boolean => {
        return !!localStorage.getItem("jwt");
    },
};
