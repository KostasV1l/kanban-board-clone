"use client";

import { useBoard } from "@/features/board/hooks/useBoard";
import { useBoardRealtime } from "@/features/realtime/hooks";
import { ConnectionStatus } from "@/features/realtime/ui";
import { BoardMembersPanel } from "@/widgets/BoardMembersPanel/ui/BoardMembersPanel";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { useParams } from "next/navigation";
import { useGetLists, useReorderLists } from "@entities/list/hooks";
import { ListColumn } from "@widgets/DashboardPage/list-column";
import { NewListColumn } from "@widgets/DashboardPage/new-column";

export const dynamic = "force-dynamic";

const BoardPage = () => {
    const { id } = useParams() as { id: string };
    const { data: board, isLoading: isLoadingBoard } = useBoard(id);
    const { data: dataLists = [], isLoading: isLoadingLists, error, refetch } = useGetLists(id);
    const reorderLists = useReorderLists();

    // Use the enhanced board realtime hook to handle real-time events
    const { isConnected } = useBoardRealtime(id, {
        onListChange: refetch,
        onTaskChange: refetch,
    });

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

    const lists = dataLists.map(list => list.id);

    if (isLoadingBoard || isLoadingLists) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error loading data: {error.message}</p>;
    }

    if (!board) {
        return <p>Board not found</p>;
    }

    return (
        <div className="container mx-auto py-6">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold">{board.name}</h1>
                    <ConnectionStatus />
                </div>
                <BoardMembersPanel boardId={id} />
            </div>

            <main id="main-content">
                <DndContext onDragEnd={handleDragEnd}>
                    <div className="flex space-x-4 overflow-x-auto pb-4">
                        <SortableContext items={lists} strategy={horizontalListSortingStrategy}>
                            {dataLists.map(list => (
                                <ListColumn key={list.id} list={list} />
                            ))}
                        </SortableContext>
                        <NewListColumn currentLength={dataLists.length} boardId={id} />
                    </div>
                </DndContext>
            </main>
        </div>
    );
};

export default BoardPage;
