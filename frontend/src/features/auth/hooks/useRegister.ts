import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authKeys } from "@entities/auth/model";
import { queryClient } from "@shared/api/query-client";
import { AuthAPI } from "../api";
import { RegisterFormData } from "../register-form/model";

export const useRegister = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: (data: RegisterFormData) => AuthAPI.register(data),
        onSuccess: (data) => {
            queryClient.setQueryData(authKeys.currentUser(), data.user);
            
            // Add a slight delay before redirecting to ensure alert is shown
            setTimeout(() => {
                router.push("/dashboard");
            }, 1500);
        },
        // onError: (error) => {
        //   show toast or smth
        // }
    });
};
