import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authKeys } from "@entities/auth/model";
import { queryClient } from "@shared/api/query-client";
import { AuthAPI } from "../api";

export const useLogout = () => {
    const router = useRouter();
    return useMutation({
        mutationFn: () => AuthAPI.logout(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: authKeys.currentUser() });
            console.log("Logged out");
            router.push("/");

        },
    });
};
