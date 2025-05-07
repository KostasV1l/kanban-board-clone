import { useMutation } from "@tanstack/react-query";
import { authKeys } from "@entities/auth/model";
import { queryClient } from "@shared/api/query-client";
import { AuthAPI } from "../api";
import { RegisterFormData } from "../register-form/model";
import { handleApiError } from "@/shared/utils/error";
import { toast } from "sonner";

export const useRegister = () => {

    return useMutation({
        mutationFn: (data: RegisterFormData) => AuthAPI.register(data),
        onSuccess: (data) => {
            toast.success("Registration successful");
            queryClient.setQueryData(authKeys.currentUser(), data.user);
            
        },
        onError: (error) => {
            handleApiError(error, "Register");
        }
    });
};
