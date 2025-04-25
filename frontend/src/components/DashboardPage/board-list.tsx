"use client";

import { Board } from "@/entities/board/model/types";
import { BoardCard } from "./ui/board-card";

export const BoardList = ({ boardsList }: { boardsList: Board[] }) => {
    return (
        <section className="flex flex-col grow gap-y-4 mt-4 py-4 rounded-lg shadow-sm">
            {boardsList.map(board => (
                <BoardCard key={board.id} {...board} />
            ))}
        </section>
    );
};
