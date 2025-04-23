import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/dark-mode/theme-provider";
import "@fontsource-variable/inter";
import "@fontsource-variable/open-sans";
import "@app/styles/global.css";

export const metadata: Metadata = {
    title: "Kanban Board Clone",
    description: "A simple kanban board clone.",
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
                <body className="font-sans h-dvh px-4 flex flex-col mx-auto selection:bg-primary-accent selection:text-white">
                    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                        {children}
                    </ThemeProvider>
                </body>
            </html>
        </>
    );
}
