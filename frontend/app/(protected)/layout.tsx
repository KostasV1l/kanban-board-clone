import Header from "@/components/ui/header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-full flex-grow flex flex-col">
            <Header />
            <main className="w-11/12 my-4 mx-auto flex-grow">
                {children}
            </main>
        </div>
    );
}
