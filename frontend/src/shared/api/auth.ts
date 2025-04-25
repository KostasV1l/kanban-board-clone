import {
    AuthAPI,
    AuthResponse,
    RegisterFormData,
    useAuthStatus,
    useCurrentUser,
    useLogin,
    useLogout,
    useRegister,
} from "@/entities/auth/model";

// Re-export the types and hooks that should be publicly available
export type { AuthResponse, RegisterFormData };

// Provide a clean public API for auth operations
export const authApi = {
    // Authentication operations
    login: AuthAPI.login,
    register: AuthAPI.register,
    logout: AuthAPI.logout,
    getCurrentUser: AuthAPI.getCurrentUser,

    // Auth state helpers
    getToken: AuthAPI.getToken,
    isAuthenticated: AuthAPI.isAuthenticated,
};

// Re-export hooks for use in features and pages
export { useAuthStatus, useCurrentUser, useLogin, useLogout, useRegister };
