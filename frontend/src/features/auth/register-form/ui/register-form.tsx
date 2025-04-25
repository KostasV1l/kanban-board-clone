"use client";

import { LucideX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRegisterForm } from "../model";

export function RegisterForm() {
    const { form, handleRegister, serverError } = useRegisterForm();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = form;

    return (
        <form onSubmit={handleSubmit(handleRegister)} className="space-y-4">
            {serverError && (
                <div className="flex items-center font-sans p-3 gap-x-4 rounded-md bg-red-50 text-red-500 text-sm">
                    <LucideX className="inline size-5" /> {serverError}
                </div>
            )}
            <div className="space-y-2">
                <Label htmlFor="register-username">Username</Label>
                <Input
                    id="register-username"
                    type="text"
                    placeholder="username"
                    {...register("username")}
                    aria-invalid={errors.username ? "true" : "false"}
                />
                {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <Input
                    id="register-email"
                    type="email"
                    placeholder="name@example.com"
                    {...register("email")}
                    aria-invalid={errors.email ? "true" : "false"}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="register-password">Password</Label>
                <Input
                    id="register-password"
                    type="password"
                    placeholder="********"
                    {...register("password")}
                    aria-invalid={errors.password ? "true" : "false"}
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                    id="confirm-password"
                    type="password"
                    placeholder="********"
                    {...register("passwordConfirmation")}
                    aria-invalid={errors.passwordConfirmation ? "true" : "false"}
                />
                {errors.passwordConfirmation && (
                    <p className="text-red-500 text-xs mt-1">{errors.passwordConfirmation.message}</p>
                )}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Creating account..." : "Create account"}
            </Button>
        </form>
    );
}
