import { QueryClient } from "@tanstack/react-query";

// Create a client
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false, // default: true
            retry: 1,
            staleTime: 0, // No stale time to ensure real-time updates work immediately
        },
    },
});
