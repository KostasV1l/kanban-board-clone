"use client";

import { LucideX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginForm } from "../model";

export function LoginForm() {
    const { form, handleLogin, serverError } = useLoginForm();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = form;

    return (
        <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
            {serverError && (
                <div className="flex items-center font-sans p-3 gap-x-4 rounded-md bg-red-50 text-red-500 text-sm">
                    <LucideX className="inline size-5" /> {serverError}
                </div>
            )}
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    {...register("email")}
                    aria-invalid={errors.email ? "true" : "false"}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                    id="password"
                    type="password"
                    placeholder="********"
                    {...register("password")}
                    aria-invalid={errors.password ? "true" : "false"}
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <Button className="w-full mt-4 cursor-pointer" disabled={isSubmitting}>
                {isSubmitting ? "Logging in..." : "Login"}
            </Button>
        </form>
    );
}
