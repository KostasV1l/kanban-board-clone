import { LogOut, SquarePlus, UserRound } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserMenu } from "@/entities/user/ui/UserMenu";
import { useAuthStatus } from "@/features/auth/hooks";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Logo } from "./logo";


export const Header = () => {
    const { isAuthenticated } = useAuthStatus();

    return (
        <header className="w-full bg-accent flex justify-between items-center p-4">
            <Link href="/">
                <Logo />
            </Link>



            {isAuthenticated ? (
                <UserMenu />
            ) : (
                <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center">
                        <Avatar className="cursor-pointer rounded-full border border-primary">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback className="bg-accent">G</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64 me-2 py-3 px-2">
                        <DropdownMenuLabel className="text-muted-foreground">Account</DropdownMenuLabel>
                        <DropdownMenuLabel>
                            <div className="mb-2 flex items-center gap-x-4">
                                <Avatar className="size-10">
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback>G</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold">Guest user</span>
                                    <span className="text-xs text-muted-foreground">shad@vercel.com</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuItem>
                            <UserRound className="size-4" />
                            Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <SquarePlus className="size-4" />
                            New board
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="my-2" />
                        <DropdownMenuLabel className="text-muted-foreground">My Boards</DropdownMenuLabel>
                        {/* TODO: Dynamic */}
                        <DropdownMenuItem>Board 1</DropdownMenuItem>
                        <DropdownMenuItem>Board 2</DropdownMenuItem>
                        <DropdownMenuItem>Board 3</DropdownMenuItem>
                        <DropdownMenuItem>Board 4</DropdownMenuItem>
                        <DropdownMenuSeparator className="my-2" />
                        <DropdownMenuItem asChild>
                            <Link href="/">
                                <LogOut className="mr-2 size-4" />
                                Sign in
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </header>
    );
};

export default Header;