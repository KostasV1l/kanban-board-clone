"use client";

import { useBoard } from "@/features/board/hooks/useBoard";
import { BoardMembersPanel } from "@/widgets/BoardMembersPanel/ui/BoardMembersPanel";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { useParams } from "next/navigation";
import { useGetLists, useReorderLists } from "@entities/list/hooks";
import { List } from "@entities/list/model";
import { ListColumn } from "@widgets/DashboardPage/list-column";
import { NewListColumn } from "@widgets/DashboardPage/new-column";

export const dynamic = "force-dynamic";

const BoardPage = () => {
    const { id } = useParams() as { id: string };

    const { data: board, isLoading: isLoadingBoard } = useBoard(id);
    const { data: dataLists = [], isLoading: isLoadingLists, error } = useGetLists(id);

    const reorderLists = useReorderLists();

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || active.id === over.id) return;

        const oldIndex = dataLists.findIndex(list => list.id === active.id);
        const newIndex = dataLists.findIndex(list => list.id === over.id);

        const reordered = arrayMove(dataLists, oldIndex, newIndex).map((list, index) => ({
            id: list.id,
            order: index,
        }));

        reorderLists.mutate({
            boardId: id,
            listUpdates: reordered,
        });
    };

    if (isLoadingBoard || isLoadingLists) {
        return <div>Loading....</div>;
    }

    if (error) {
        return <div>Error.....</div>;
    }

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <div className="flex justify-between items-center p-4 border-b mb-4">
                <h1 className="text-2xl font-bold">{board?.name || "Board"}</h1>
                <div className="flex items-center gap-2">{board && <BoardMembersPanel boardId={board.id} />}</div>
            </div>
            <SortableContext items={dataLists.map(list => list.id)} strategy={horizontalListSortingStrategy}>
                <div style={{ display: "flex", gap: "16px", overflowX: "auto" }}>
                    {dataLists.map((list: List) => (
                        <ListColumn key={list.id} list={list} />
                    ))}
                    <NewListColumn currentLength={dataLists.length} boardId={id} />
                </div>
            </SortableContext>
        </DndContext>
    );
};

export default BoardPage;
