import { useCurrentUser } from "./useCurrentUser";

export const useAuthStatus = () => {
    const { data: user, isLoading } = useCurrentUser();

    return {
        user,
        isAuthenticated: !!user,
        isLoading,
    };
};
