"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { ThemeProvider } from "@/components/dark-mode/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { queryClient } from "@/shared/api/query-client";
import { Toaster } from "sonner";

export function Providers({ children }: { children: ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <Toaster richColors />
            <TooltipProvider>
                <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
                    {children}
                </ThemeProvider>
            </TooltipProvider>
            {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </QueryClientProvider>
    );
}
