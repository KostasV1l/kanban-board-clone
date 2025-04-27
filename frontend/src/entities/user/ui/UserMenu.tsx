"use client";

import { ArrowRight, KanbanSquare, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStatus, useLogout } from "@/features/auth/hooks";
import { useBoards } from "@/features/board/hooks";
import Link from "next/link";

export function UserMenu() {
    const { user } = useAuthStatus();
    const { mutate: logout } = useLogout();
    const { data: boards, isLoading: isLoadingBoards } = useBoards();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");

    if (!user) return null;

    const initials = user.username
        .split(" ")
        .map(part => part[0])
        .join("")
        .toUpperCase();

    useEffect(() => {
        if (user) {
            setUsername(user.username);
            setEmail(user.email);
        }
    }, [user]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center">
                <Avatar className="cursor-pointer rounded-full border border-primary">
                    {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
                    <AvatarFallback className="bg-accent">{initials}</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel className="text-muted-foreground">Account</DropdownMenuLabel>
                <DropdownMenuLabel>
                    <div className="mb-2 flex items-center gap-x-4">
                        <Avatar className="size-10">
                            {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
                            <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold">{username}</span>
                            <span className="text-xs text-muted-foreground">{email}</span>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-muted-foreground">My Boards</DropdownMenuLabel>

                {isLoadingBoards ? (
                    <DropdownMenuItem disabled>Loading boards...</DropdownMenuItem>
                ) : boards && boards.length > 0 ? (
                    boards.slice(0, 5).map(board => (
                        <DropdownMenuItem key={board.id} className="mb-2 cursor-pointer" asChild>
                            <Link href={`/board/${board.id}`} className="flex items-center">
                                <KanbanSquare className="mr-2 size-4" />
                                {board.name}
                            </Link>
                        </DropdownMenuItem>
                    ))
                ) : (
                    <DropdownMenuItem disabled>No boards yet</DropdownMenuItem>
                )}

                {boards && boards.length > 5 && (
                    <DropdownMenuItem asChild>
                        <Link href="/dashboard" className="text-xs text-center w-full py-2 cursor-pointer">
                            <ArrowRight className="mr-1 size-3" />
                            View all boards ({boards.length})
                        </Link>
                    </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()} className="mt-2 mb-0.5 cursor-pointer">
                    <LogOut className="mr-2 size-4" />
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
