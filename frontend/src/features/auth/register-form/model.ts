import { useState } from "react";
import { useForm } from "react-hook-form";
import { registerUser } from "@/shared/api/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";

export const registerSchema = z
    .object({
        email: z.string().min(1, "Email is required").email("Please enter a valid email"),
        password: z.string().min(1, "Password is required").min(8, "Password must be at least 8 characters"),
        passwordConfirmation: z.string().min(1, "Please confirm your password"),
    })
    .refine(data => data.password === data.passwordConfirmation, {
        message: "Passwords don't match",
        path: ["passwordConfirmation"],
    });

export type RegisterFormData = z.infer<typeof registerSchema>;

export const useRegisterForm = () => {
    const router = useRouter();
    const [serverError, setServerError] = useState<string | null>(null);

    const form = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        mode: "onChange",
        defaultValues: {
            email: "",
            password: "",
            passwordConfirmation: "",
        },
    });

    const handleRegister = async (data: RegisterFormData) => {
        try {
            setServerError(null);
            // We exclude passwordConfirmation as it's only needed for validation
            const { passwordConfirmation, ...registrationData } = data;
            const response = await registerUser({
                username: data.email.split("@")[0], // Simple username generation
                email: data.email,
                password: data.password,
            });

            if (response.ok) {
                router.push("/dashboard");
            } else {
                const errorData = await response.json().catch(() => ({}));
                setServerError(errorData.message || "Registration failed");
            }
        } catch (error) {
            if (error instanceof Error) {
                setServerError(error.message);
            } else {
                setServerError("An unexpected error occurred");
            }
        }
    };

    return {
        form,
        handleRegister,
        serverError,
    };
};
