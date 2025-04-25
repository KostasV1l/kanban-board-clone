import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/dark-mode/theme-provider";
import "@fontsource-variable/inter";
import "@fontsource-variable/open-sans";
import "@app/styles/global.css";

export const metadata: Metadata = {
    title: "Login | TASKFLOW",
    description: "A simple kanban board application.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    return (
        <>
            <html lang="en" suppressHydrationWarning>
                <head />
                <body className="font-sans h-dvh flex flex-col mx-auto selection:bg-blue-950 selection:text-white">
                    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
                        {children}
                    </ThemeProvider>
                </body>
            </html>
        </>
    );
}
