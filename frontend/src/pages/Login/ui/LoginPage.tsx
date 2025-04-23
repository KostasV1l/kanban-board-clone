import { ModeToggle } from "@/components/dark-mode/mode-toggle";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { LoginForm } from "@features/auth/login-form/ui/login-form";
import { RegisterForm } from "@features/auth/login-form/ui/register-form";

export const LoginPage = () => {
    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8 bg-card rounded-lg p-8 shadow-md">
                <div className="flex justify-center">
                    <Logo />
                </div>
                <div>
                    <Tabs defaultValue="login" className="w-full font-primary">
                        <TabsList className="grid w-full grid-cols-2 mb-6">
                            <TabsTrigger className="cursor-pointer" value="login">
                                Login
                            </TabsTrigger>
                            <TabsTrigger className="cursor-pointer" value="register">
                                Register
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="login">
                            <LoginForm />
                        </TabsContent>
                        <TabsContent value="register">
                            <RegisterForm />
                        </TabsContent>
                    </Tabs>

                    <div className="mt-5 pt-4 border-t text-center">
                        <p className="text-sm text-muted-foreground mb-4">Want to try it out first?</p>
                        <Button variant="outline" className="w-full" asChild>
                            <Link href="/dashboard">Continue as Guest</Link>
                        </Button>
                    </div>
                </div>
            </div>
            <div className="absolute bottom-4 right-4">
                <ModeToggle />
            </div>
        </div>
    );
};
