"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useBoards, useCreateBoard, useDeleteBoard } from "@/entities/board/model/queries";
import { BoardHeader } from "@/features/dashboard/board-header";
import { BoardList } from "@/features/dashboard/board-list";
import Greeting from "@/features/dashboard/greeting";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Dashboard | TASKFLOW",
    description: "Your personal dashboard",
};

export const DashboardPage = () => {
    // Using TanStack Query hooks instead of custom hooks
    const { data: boards, isLoading, error } = useBoards();
    const createBoard = useCreateBoard();
    const deleteBoard = useDeleteBoard();
    const boardCount = boards ? boards.length : 0;

    // Function to handle adding a new board
    const handleAddBoard = async (boardData: { name: string; description: string; color: string }) => {
        try {
            await createBoard.mutateAsync(boardData);
            // Add any success notification here if needed
        } catch (err) {
            // Handle error (could add toast notification)
            console.error("Failed to add board:", err);
        }
    };

    return (
        <>
            <Greeting boardCount={boardCount} />
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
