import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLogin } from "@/shared/api/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().min(1, "Email is required").email("Please enter a valid email"),
    password: z.string().min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const useLoginForm = () => {
    const router = useRouter();
    const [serverError, setServerError] = useState<string | null>(null);
    const loginMutation = useLogin();

    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        mode: "onChange",
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const handleLogin = async (data: LoginFormData) => {
        try {
            setServerError(null);
            await loginMutation.mutateAsync(data);
            router.push("/dashboard");
        } catch (error) {
            if (error instanceof Error) {
                setServerError(error.message || "Invalid credentials");
            } else {
                setServerError("An unexpected error occurred");
            }
        }
    };

    return {
        form,
        handleLogin,
        serverError,
        isLoading: loginMutation.isPending,
    };
};
