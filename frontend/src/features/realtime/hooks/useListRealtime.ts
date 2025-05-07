import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { taskKeys } from "@/entities/task/model";
import { RealtimeEvent, TaskMovedSocketData, TaskSocketData } from "../model";
import { useRealtime } from "../providers";
import { useRealtimeEvent } from "./useRealtimeEvent";

/**
 * Hook for list-related real-time events
 * @param listId The ID of the list to subscribe to
 * @param boardId The ID of the board the list belongs to
 * @param onTaskChange Callback to execute when tasks change
 * @returns Object with connection status
 */
export function useListRealtime(listId: string, boardId: string, onTaskChange: () => void) {
    const { isConnected } = useRealtime();
    const queryClient = useQueryClient();

    // Task event listeners specific to this list
    useRealtimeEvent<TaskSocketData>(RealtimeEvent.TASK_CREATED, newTask => {
        if (newTask.listId === listId) {
            console.log("Task created in list:", listId);
            queryClient.invalidateQueries({
                queryKey: taskKeys.all,
                refetchType: "all",
            });
            onTaskChange();
        }
    });

    useRealtimeEvent<TaskSocketData>(RealtimeEvent.TASK_UPDATED, updatedTask => {
        if (updatedTask.listId === listId) {
            console.log("Task updated in list:", listId);
            queryClient.invalidateQueries({
                queryKey: taskKeys.all,
                refetchType: "all",
            });
            onTaskChange();
        }
    });

    useRealtimeEvent<TaskSocketData>(RealtimeEvent.TASK_DELETED, deletedTask => {
        if (deletedTask.listId === listId) {
            console.log("Task deleted from list:", listId);
            queryClient.invalidateQueries({
                queryKey: taskKeys.all,
                refetchType: "all",
            });
            onTaskChange();
        }
    });

    useRealtimeEvent<TaskMovedSocketData>(RealtimeEvent.TASK_MOVED, data => {
        // Refresh when tasks move from this list to another list or vice versa
        const { task, oldListId } = data;
        if (oldListId === listId || task.listId === listId) {
            console.log("Task moved affecting list:", listId);
            queryClient.invalidateQueries({
                queryKey: taskKeys.all,
                refetchType: "all",
            });
            onTaskChange();
        }
    });

    useRealtimeEvent(RealtimeEvent.TASKS_REORDERED, (data: any) => {
        // Check if the reordered tasks belong to this list
        if (data && data.listId === listId) {
            console.log("Tasks reordered in list:", listId);
            queryClient.invalidateQueries({
                queryKey: taskKeys.all,
                refetchType: "all",
            });
            onTaskChange();
        }
    });

    return {
        isConnected,
    };
}
