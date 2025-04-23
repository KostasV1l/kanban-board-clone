import { useState } from "react";
import { useForm } from "react-hook-form";
import { loginUser } from "@/shared/api/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email("Please enter a valid email"),
    password: z.string(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const useLoginForm = () => {
    const router = useRouter();
    const [serverError, setServerError] = useState<string | null>(null);

    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        mode: "onSubmit",
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const handleLogin = async (data: LoginFormData) => {
        try {
            setServerError(null);
            const response = await loginUser(data);
            if (response.ok) {
                router.push("/dashboard");
            } else {
                setServerError("Invalid credentials");
            }
        } catch (error) {
            setServerError("An unexpected error occurred");
        }
    };

    return {
        form,
        handleLogin,
        serverError,
    };
};
