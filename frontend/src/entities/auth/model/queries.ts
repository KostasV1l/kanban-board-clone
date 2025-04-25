import { useMutation, useQuery } from "@tanstack/react-query";
import { LoginFormData } from "@/features/auth/login-form/model";
import { queryClient } from "@/shared/api/query-client";
import { AuthAPI } from "./api";
import { authKeys } from "./keys";
import { RegisterFormData } from "./types";

/**
 * TanStack Query hooks for auth operations
 * These hooks handle server state management for authentication
 */

// User login mutation
export const useLogin = () => {
    return useMutation({
        mutationFn: (data: LoginFormData) => AuthAPI.login(data),
        onSuccess: data => {
            queryClient.invalidateQueries({ queryKey: authKeys.user() });
        },
    });
};

// User registration mutation
export const useRegister = () => {
    return useMutation({
        mutationFn: (data: RegisterFormData) => AuthAPI.register(data),
        onSuccess: data => {
            queryClient.invalidateQueries({ queryKey: authKeys.user() });
        },
    });
};

// Current user query
export const useCurrentUser = () => {
    return useQuery({
        queryKey: authKeys.currentUser(),
        queryFn: () => AuthAPI.getCurrentUser(),
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: false,
    });
};

// User logout mutation
export const useLogout = () => {
    return useMutation({
        mutationFn: () => AuthAPI.logout(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: authKeys.all });
            queryClient.removeQueries({ queryKey: authKeys.currentUser() });
        },
    });
};
