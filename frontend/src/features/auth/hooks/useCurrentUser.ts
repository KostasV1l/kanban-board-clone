import { useQuery } from "@tanstack/react-query";
import { authKeys } from "@entities/auth/model";
import { AuthAPI } from "../api";

export const useCurrentUser = () => {
    return useQuery({
        queryKey: authKeys.currentUser(),
        queryFn: () => AuthAPI.getCurrentUser(),
        staleTime: 5 * 60 * 1000,
    });
};
