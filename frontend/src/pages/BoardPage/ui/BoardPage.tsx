"use client";

import { DndContext } from "@dnd-kit/core";
import { useParams } from "next/navigation";
import { useGetLists } from "@entities/list/hooks";
import { List } from "@entities/list/model";
import { useBoard } from "@/features/board/hooks/useBoard";
import { ListColumn } from "@widgets/DashboardPage/list-column";
import { NewListColumn } from "@widgets/DashboardPage/new-column";
import { BoardMembersPanel } from "@/widgets/BoardMembersPanel/ui/BoardMembersPanel";

export const dynamic = "force-dynamic";

const BoardPage = () => {
    const { id } = useParams() as { id: string };

    const { data: board, isLoading: isLoadingBoard } = useBoard(id);
    const { data: dataLists = [], isLoading: isLoadingLists, error } = useGetLists(id);

    // Show loading state if either board or lists are loading
    if (isLoadingBoard || isLoadingLists) {
        return <div>Loading....</div>;
    }

    if (error) {
        return <div>Error.....</div>;
    }

    return (
        <DndContext>
            <div>
                <div className="flex justify-between items-center p-4 border-b mb-4">
                    <h1 className="text-2xl font-bold">{board?.name || "Board"}</h1>
                    <div className="flex items-center gap-2">
                        <BoardMembersPanel boardId={id} />
                    </div>
                </div>
                <div
                    style={{ display: "flex", gap: "16px", overflowX: "auto" }}
                >
                    {dataLists.map((list: List) => (
                        <ListColumn key={list.id} list={list} />
                    ))}
                    <NewListColumn currentLength={dataLists.length} boardId={id} />
                </div>
            </div>
        </DndContext>
    );
};

export default BoardPage;
