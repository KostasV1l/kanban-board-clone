"use client";

import { useState } from "react";
import { AuthAPI } from "./api";

/**
 * This file contains traditional React hooks (useState, useEffect) for auth operations
 * Currently placeholder as we're using Tanstack Query hooks from queries.ts
 *
 * Traditional hooks can be added here as needed for local state management
 * that doesn't require Tanstack Query's caching capabilities
 */

// Example of how an auth-related hook might look if needed
export const useAuthStatus = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Check authentication status based on token
    const checkAuthStatus = async () => {
        try {
            setLoading(true);
            const isAuth = AuthAPI.isAuthenticated();
            setIsAuthenticated(isAuth);
            setError(null);
            return isAuth;
        } catch (err) {
            setError("Failed to check authentication status");
            console.error(err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        isAuthenticated,
        loading,
        error,
        checkAuthStatus,
    };
};
