import { Logo } from "@/components/ui/logo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "@features/auth/login-form/ui/login-form";
import { RegisterForm } from "@features/auth/register-form/ui/register-form";

export const LoginPage = () => {
    return (
        <div className="flex-1 flex items-center justify-center p-4 relative">
            <section className="w-full max-w-md space-y-8 bg-card rounded-lg p-8 drop-shadow-lg">
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
                </div>
            </section>
        </div>
    );
};
