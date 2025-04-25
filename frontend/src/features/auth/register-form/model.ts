import { useState } from "react";
import { useForm } from "react-hook-form";
import { AuthAPI } from "@/entities/auth/model/api";
import { RegisterFormData as EntityRegisterData } from "@/entities/auth/model/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";

// Extended schema for the form with password confirmation
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

// Local form type with password confirmation
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

            // Extract fields needed for the API to register the user
            const entityData: EntityRegisterData = {
                email: data.email,
                password: data.password,
            };

            try {
                // Use the entity API function (instead of direct fetch)
                await AuthAPI.register(entityData);
                router.push("/dashboard");
            } catch (error) {
                if (error instanceof Error) {
                    setServerError(error.message);
                } else {
                    setServerError("An unexpected error occurred");
                }
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
