"use client";

import { useEffect, useState } from "react";
import { DndContext, DragEndEvent, useDraggable } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useParams } from "next/navigation";
import { useGetLists } from "@entities/list/hooks";
import { List } from "@entities/list/model";
import { ListColumn } from "@widgets/DashboardPage/list-column";
import { NewListColumn } from "@widgets/DashboardPage/new-column";

export const dynamic = "force-dynamic";

const BoardPage = () => {
    const [lists, setLists] = useState<List[]>([]);
    const { id } = useParams() as { id: string };

    const { data: dataLists = [], isLoading, error } = useGetLists(id);

    if (isLoading) {
        return <div>Loading....</div>;
    }

    if (error) {
        return <div>Error.....</div>;
    }

    useEffect(() => {
        setLists(dataLists.sort((a, b) => a.order - b.order));
    }, [dataLists]);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || active.id === over.id) return;

        const oldIndex = lists.findIndex(list => list.id === active.id);
        const newIndex = lists.findIndex(list => list.id === over.id);

        const reordered = arrayMove(lists, oldIndex, newIndex).map((list, index) => ({
            ...list,
            order: index,
        }));

        setLists(reordered);
        // Optionally: send to backend with useReorderLists hook
    };

    return (
        <DndContext>
            <div>
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
