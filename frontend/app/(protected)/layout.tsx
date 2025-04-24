import Header from "@/components/ui/header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="w-full h-screen">
            <Header />
            <div className="flex-1 overflow-auto">{children}</div>
        </main>
    );
}
