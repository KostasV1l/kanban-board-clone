import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authKeys } from "@entities/auth/model";
import { queryClient } from "@shared/api/query-client";
import { AuthAPI } from "../api";
import { LoginFormData } from "../login-form/model";

export const useLogin = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: (data: LoginFormData) => AuthAPI.login(data),
        onSuccess: data => {
            // Record token timestamp for fresh token tracking
            localStorage.setItem('auth_token_timestamp', Date.now().toString());
            queryClient.setQueryData(authKeys.currentUser(), data.user);
            router.push("/dashboard");
        },
        // onError: error => {
        //     show toast or smth
        // },
    });
};
