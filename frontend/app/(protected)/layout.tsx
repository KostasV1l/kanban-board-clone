"use client";

import { useEffect } from "react";
import { Header } from "@/components/ui/header";
import { AuthProvider } from "@/features/auth/providers/AuthProvider";
import { RealtimeProvider } from "@/features/realtime/providers";
import { useRouter } from "next/navigation";
import { useAuthStatus } from "@features/auth/hooks/useAuthStatus";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuthStatus();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/");
        }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthProvider>
            <RealtimeProvider>
                <div className="w-full flex-grow flex flex-col">
                    <Header />
                    <main className="w-11/12 my-4 mx-auto flex-grow">{children}</main>
                </div>
            </RealtimeProvider>
        </AuthProvider>
    );
}
