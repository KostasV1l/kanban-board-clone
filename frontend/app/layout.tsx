import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Providers } from "@/components/providers";
import "@fontsource-variable/montserrat";
import "@fontsource-variable/open-sans";
import "@app/styles/global.css";
import { Footer } from "@/components/ui/footer";

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
            <html lang="en-GB" suppressHydrationWarning>
                <head />
                <body className="font-sans min-h-screen selection:bg-blue-950 selection:text-white dark:selection:bg-white dark:selection:text-blue-950  flex flex-col">
                    {/* Skip to content link - visible only when focused */}
                    <a 
                        href="#main-content" 
                        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-2 focus:bg-primary focus:text-primary-foreground"
                    >
                        Skip to main content
                    </a>
                    <Providers>
                        <div className="flex flex-col min-h-screen flex-grow">
                            {children}
                            <Footer />
                        </div>
                    </Providers>
                </body>
            </html>
        </>
    );
}
