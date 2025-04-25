"use client";

import { useState } from "react";
import { List } from "./types";

/**
 * Custom React hooks for list-related local state management
 */

// Hook to manage reordering lists within a board via drag and drop
export const useListReordering = (initialLists: List[]) => {
    const [lists, setLists] = useState<List[]>(initialLists);
    const [isDragging, setIsDragging] = useState(false);

    const startDrag = () => {
        setIsDragging(true);
    };

    const endDrag = () => {
        setIsDragging(false);
    };

    const reorderList = (sourceIndex: number, destinationIndex: number) => {
        const result = [...lists];
        const [removed] = result.splice(sourceIndex, 1);
        result.splice(destinationIndex, 0, removed);

        // Update position values
        const updatedLists = result.map((list, index) => ({
            ...list,
            position: index,
        }));

        setLists(updatedLists);
        return updatedLists.map(list => list.id);
    };

    const addList = (newList: List) => {
        setLists(prevLists => [...prevLists, newList]);
    };

    const updateList = (updatedList: List) => {
        setLists(prevLists => prevLists.map(list => (list.id === updatedList.id ? updatedList : list)));
    };

    const removeList = (listId: number) => {
        setLists(prevLists => prevLists.filter(list => list.id !== listId));
    };

    return {
        lists,
        setLists,
        isDragging,
        startDrag,
        endDrag,
        reorderList,
        addList,
        updateList,
        removeList,
    };
};
