"use client";

import { useEffect, useState } from "react";
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

    const { data: dataLists = [], isLoading, error } = useGetLists(id);

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

    if (isLoading) {
        return <div>Loading....</div>;
    }

    if (error) {
        return <div>Error.....</div>;
    }

    return (
        <DndContext onDragEnd={handleDragEnd}>
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
