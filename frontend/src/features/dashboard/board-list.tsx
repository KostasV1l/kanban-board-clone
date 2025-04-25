"use client";

import { BoardCard } from "@/components/DashboardPage/ui/board-card";
import { Board } from "@/entities/board/model/types";

export const BoardList = ({ boardsList }: { boardsList: Board[] }) => {
    return (
        <section className="flex flex-col grow gap-y-4 mt-4 py-4 md:grid md:grid-cols-2 md:gap-x-4 lg:grid-cols-3 lg:gap-x-6">
            {boardsList.map(board => (
                <BoardCard key={board.id} {...board} />
            ))}
        </section>
    );
};
