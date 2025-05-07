"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRegister } from "@/features/auth/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormData, registerSchema } from "../model";

export function RegisterForm() {
    const { mutate: register, isPending } = useRegister();

    const {
        register: registerField,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = (data: RegisterFormData) => {
        register(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="register-username">Username</Label>
                <Input
                    id="register-username"
                    type="text"
                    placeholder="username"
                    {...registerField("username")}
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
                    {...registerField("email")}
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
                    {...registerField("password")}
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
                    {...registerField("passwordConfirmation")}
                    aria-invalid={errors.passwordConfirmation ? "true" : "false"}
                />
                {errors.passwordConfirmation && (
                    <p className="text-red-500 text-xs mt-1">{errors.passwordConfirmation.message}</p>
                )}
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Creating account..." : "Create account"}
            </Button>
        </form>
    );
}
