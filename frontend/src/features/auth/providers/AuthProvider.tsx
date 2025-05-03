"use client";

import { ReactNode, useCallback, useEffect, useRef } from "react";
import { AuthAPI } from "../api";
import { useLogout } from "../hooks";

export function AuthProvider({ children }: { children: ReactNode }) {
    const { mutate: performLogout } = useLogout();
    const isRefreshing = useRef(false);

    // Check if token is fresh (less than 2 minutes old)
    const isTokenFresh = useCallback(() => {
        const timestamp = localStorage.getItem("auth_token_timestamp");
        if (!timestamp) return false;
        const tokenAge = Date.now() - parseInt(timestamp, 10);
        return tokenAge < 2 * 60 * 1000; // 2 minutes
    }, []);

    const refreshTokens = useCallback(async () => {
        // Prevent concurrent refreshes
        if (isRefreshing.current) return;

        // Skip refresh if token is very fresh (e.g., just logged in)
        if (isTokenFresh()) {
            console.log("Token is fresh, skipping refresh");
            return;
        }

        try {
            isRefreshing.current = true;
            console.log("Refreshing tokens...");

            const success = await AuthAPI.refreshToken();

            if (success) {
                // Update token timestamp after successful refresh
                localStorage.setItem("auth_token_timestamp", Date.now().toString());
            } else {
                console.warn("Token refresh failed");
                performLogout();
            }
        } catch (error) {
            console.error("Token refresh error:", error);
            performLogout();
        } finally {
            isRefreshing.current = false;
        }
    }, [isTokenFresh, performLogout]);

    useEffect(() => {
        // Initial token refresh (important if access token expired)
        refreshTokens();
        // Set up interval (12 min for 15-min token)
        const intervalId = setInterval(refreshTokens, 12 * 60 * 1000);
        return () => clearInterval(intervalId);
    }, [refreshTokens]);

    return <>{children}</>;
}
