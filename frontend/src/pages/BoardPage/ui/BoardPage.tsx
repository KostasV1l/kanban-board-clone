"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { List } from "@entities/list/model";
import { ListAPI } from "@features/lists/api";
import { ListColumn } from "@features/lists/ui/ListColumn";

export const dynamic = "force-dynamic";

// Mock data for testing
export const mockLists: List[] = [
    {
        id: 1,
        name: "To Do",
        boardId: 1,
        position: 1,
        color: "#FF6B6B", // red
        tasksCount: 5,
        createdAt: "2024-04-26T10:00:00Z",
        updatedAt: "2024-04-26T10:00:00Z",
    },
    {
        id: 2,
        name: "In Progress",
        boardId: 1,
        position: 2,
        color: "#FFD93D", // yellow
        tasksCount: 3,
        createdAt: "2024-04-26T10:10:00Z",
        updatedAt: "2024-04-26T10:10:00Z",
    },
    {
        id: 3,
        name: "Done",
        boardId: 1,
        position: 3,
        color: "#6BCB77", // green
        tasksCount: 8,
        createdAt: "2024-04-26T10:20:00Z",
        updatedAt: "2024-04-26T10:20:00Z",
    },
];

const BoardPage = () => {
    const { id } = useParams() as { id: string };
    const [lists, setLists] = useState<List[]>(mockLists);

    useEffect(() => {
        const fetchLists = async () => {
            if (!id) return;

            try {
                const data = await ListAPI.getLists(id);
                setLists(data);
            } catch (error) {
                console.error("Failed to fetch lists", error);
            }
        };

        fetchLists();
    }, [id]);

    return (
        <div>
            <h1>Board Page</h1>
            <p>Board ID: {id}</p>

            <div style={{ display: "flex", gap: "16px", overflowX: "auto" }}>
                {lists.length === 0 ? <p>No lists yet</p> : lists.map(list => <ListColumn key={list.id} list={list} />)}
            </div>
        </div>
    );
};

export default BoardPage;
