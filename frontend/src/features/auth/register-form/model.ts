import { z } from "zod";

// Extended schema for the form with password confirmation
export const registerSchema = z
    .object({
        username: z.string().min(1, "Username is required"),
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
