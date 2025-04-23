import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="h-screen flex p-1">
                <SidebarTrigger />
                <div className="flex-1 overflow-auto">{children}</div>
            </main>
        </SidebarProvider>
    );
}
