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
            queryClient.setQueryData(authKeys.currentUser(), data.user);
            router.push("/dashboard");
        },
        // onError: error => {
        //     show toast or smth
        // },
    });
};
