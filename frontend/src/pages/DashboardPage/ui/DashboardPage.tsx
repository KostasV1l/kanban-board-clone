"use client";

import React, { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useBoards } from "@/features/board/hooks";
import { Metadata } from "next";
import { AuthAPI } from "@features/auth";
import { BoardList } from "@features/dashboard/ui/board-list";
import { BoardHeader } from "@widgets/DashboardPage/board-header";
import Greeting from "@widgets/DashboardPage/greeting";

export const metadata: Metadata = {
    title: "Dashboard | TASKFLOW",
    description: "Your personal dashboard",
};

export const DashboardPage = () => {
    const [username, setUsername] = React.useState("");
    const { data: boards, isLoading, error } = useBoards();
    const boardCount = boards ? boards.length : 0;

    useEffect(() => {
        const fetchUsername = async () => {
            try {
                const user = await AuthAPI.getCurrentUser();
                if (user?.username) {
                    setUsername(user.username);
                }
            } catch (error) {
                console.error("Failed to fetch user:", error);
                setUsername("Guest");
            }
        };
        fetchUsername();
    }, []);

    return (
        <>
            <Greeting username={username!} boardCount={boardCount} />
            <BoardHeader />
            {isLoading ? (
                // Show skeleton UI while loading
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 my-4">
                    {[1, 2, 3, 4].map(i => (
                        <Skeleton key={i} className="h-[200px] w-full rounded-xl" />
                    ))}
                </div>
            ) : error ? (
                // Show error message
                <div className="rounded-md bg-red-50 p-4 my-4">
                    <div className="flex">
                        <div className="text-sm text-red-700">
                            <p>Error loading boards. Please try again later.</p>
                        </div>
                    </div>
                </div>
            ) : (
                // Show board list
                <BoardList boardsList={boards || []} />
            )}
        </>
    );
};
