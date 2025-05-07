import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { listKeys } from "@/entities/list/model";
import { memberKeys } from "@/entities/member/model";
import { taskKeys } from "@/entities/task/model";
import { ListSocketData, MemberSocketData, RealtimeEvent, TaskMovedSocketData, TaskSocketData } from "../model";
import { useRealtime } from "../providers";
import { useRealtimeEvent } from "./useRealtimeEvent";

/**
 * Hook for board-related real-time events
 * @param boardId The ID of the board to subscribe to
 * @param options Configuration options for event handlers
 * @returns Object with connection status
 */
export function useBoardRealtime(
    boardId: string,
    options: {
        onListChange?: () => void;
        onTaskChange?: () => void;
        onMemberChange?: () => void;
    } = {},
) {
    const { isConnected, socket } = useRealtime();
    const { onListChange, onTaskChange, onMemberChange } = options;
    const queryClient = useQueryClient();

    // Join the board room when the socket connects
    useEffect(() => {
        if (!boardId || !isConnected || !socket) return;

        // Join the board room
        socket.emit(RealtimeEvent.JOIN_BOARD, boardId);

        // Cleanup - leave the board room
        return () => {
            socket.emit(RealtimeEvent.LEAVE_BOARD, boardId);
        };
    }, [boardId, isConnected, socket]);

    // List event listeners
    useRealtimeEvent<ListSocketData>(RealtimeEvent.LIST_CREATED, newList => {
        if (newList.boardId === boardId) {
            console.log("List created:", newList);
            // Force refetch all lists for this board
            queryClient.invalidateQueries({
                queryKey: listKeys.all,
                refetchType: "all",
            });
            if (onListChange) onListChange();
        }
    });

    useRealtimeEvent<ListSocketData>(RealtimeEvent.LIST_UPDATED, updatedList => {
        if (updatedList.boardId === boardId) {
            console.log("List updated:", updatedList);
            // Force refetch all lists
            queryClient.invalidateQueries({
                queryKey: listKeys.all,
                refetchType: "all",
            });
            if (onListChange) onListChange();
        }
    });

    useRealtimeEvent<ListSocketData>(RealtimeEvent.LIST_DELETED, deletedList => {
        if (deletedList.boardId === boardId) {
            console.log("List deleted:", deletedList);
            // Force refetch all lists
            queryClient.invalidateQueries({
                queryKey: listKeys.all,
                refetchType: "all",
            });
            if (onListChange) onListChange();
        }
    });

    useRealtimeEvent(RealtimeEvent.LISTS_REORDERED, () => {
        // Force refetch all lists
        queryClient.invalidateQueries({
            queryKey: listKeys.all,
            refetchType: "all",
        });
        if (onListChange) {
            console.log("Lists reordered");
            onListChange();
        }
    });

    // Task event listeners
    useRealtimeEvent<TaskSocketData>(RealtimeEvent.TASK_CREATED, newTask => {
        if (newTask.boardId === boardId) {
            console.log("Task created:", newTask);
            // Force refetch all tasks
            queryClient.invalidateQueries({
                queryKey: taskKeys.all,
                refetchType: "all",
            });
            if (onTaskChange) onTaskChange();
        }
    });

    useRealtimeEvent<TaskSocketData>(RealtimeEvent.TASK_UPDATED, updatedTask => {
        if (updatedTask.boardId === boardId) {
            console.log("Task updated:", updatedTask);
            // Force refetch all tasks
            queryClient.invalidateQueries({
                queryKey: taskKeys.all,
                refetchType: "all",
            });
            if (onTaskChange) onTaskChange();
        }
    });

    useRealtimeEvent<TaskSocketData>(RealtimeEvent.TASK_DELETED, deletedTask => {
        if (deletedTask.boardId === boardId) {
            console.log("Task deleted:", deletedTask);
            // Force refetch all tasks
            queryClient.invalidateQueries({
                queryKey: taskKeys.all,
                refetchType: "all",
            });
            if (onTaskChange) onTaskChange();
        }
    });

    useRealtimeEvent<TaskMovedSocketData>(RealtimeEvent.TASK_MOVED, data => {
        if (data.task.boardId === boardId) {
            console.log("Task moved:", data);
            // Force refetch all tasks
            queryClient.invalidateQueries({
                queryKey: taskKeys.all,
                refetchType: "all",
            });
            if (onTaskChange) onTaskChange();
        }
    });

    useRealtimeEvent(RealtimeEvent.TASKS_REORDERED, () => {
        if (onTaskChange) {
            console.log("Tasks reordered");
            // Force refetch all tasks
            queryClient.invalidateQueries({
                queryKey: taskKeys.all,
                refetchType: "all",
            });
            onTaskChange();
        }
    });

    // Member event listeners
    useRealtimeEvent<MemberSocketData>(RealtimeEvent.MEMBER_ADDED, newMember => {
        if (newMember.boardId === boardId) {
            console.log("Member added:", newMember);
            // Force refetch all members
            queryClient.invalidateQueries({
                queryKey: memberKeys.all,
                refetchType: "all",
            });
            if (onMemberChange) onMemberChange();
        }
    });

    useRealtimeEvent<MemberSocketData>(RealtimeEvent.MEMBER_UPDATED, updatedMember => {
        if (updatedMember.boardId === boardId) {
            console.log("Member updated:", updatedMember);
            // Force refetch all members
            queryClient.invalidateQueries({
                queryKey: memberKeys.all,
                refetchType: "all",
            });
            if (onMemberChange) onMemberChange();
        }
    });

    useRealtimeEvent<MemberSocketData>(RealtimeEvent.MEMBER_REMOVED, removedMember => {
        if (removedMember.boardId === boardId) {
            console.log("Member removed:", removedMember);
            // Force refetch all members
            queryClient.invalidateQueries({
                queryKey: memberKeys.all,
                refetchType: "all",
            });
            if (onMemberChange) onMemberChange();
        }
    });

    return {
        isConnected,
    };
}
