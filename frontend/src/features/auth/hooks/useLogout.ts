import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authKeys } from "@entities/auth/model";
import { queryClient } from "@shared/api/query-client";
import { AuthAPI } from "../api";
import { handleApiError } from "@/shared/utils/error";
import { toast } from "sonner";

export const useLogout = () => {
    const router = useRouter();
    return useMutation({
        mutationFn: () => AuthAPI.logout(),
        onSuccess: () => {
            toast.success("Logged out successfully");
            localStorage.removeItem("auth_token_timestamp");
            queryClient.invalidateQueries({ queryKey: authKeys.currentUser() });
            router.push("/");
        },
        onError: error => {
            handleApiError(error, "Logout");
            localStorage.removeItem("auth_token_timestamp");
            window.location.href = "/";
        },
    });
};
