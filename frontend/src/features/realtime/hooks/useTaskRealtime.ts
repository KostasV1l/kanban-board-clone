import { useQueryClient } from "@tanstack/react-query";
import { taskKeys } from "@/entities/task/model";
import { CommentSocketData, RealtimeEvent, TaskSocketData } from "../model";
import { useRealtimeEvent } from "./useRealtimeEvent";

/**
 * Hook for task-related real-time events
 * @param taskId The ID of the task to subscribe to
 * @param onTaskChange Callback to execute when the task changes
 * @param onCommentChange Callback to execute when comments change
 * @returns Object with connection status
 */
export function useTaskRealtime(taskId: string | number, onTaskChange?: () => void, onCommentChange?: () => void) {
    // Convert taskId to string for consistent comparison
    const taskIdStr = taskId?.toString() || "";
    const queryClient = useQueryClient();

    // Task update event listener
    useRealtimeEvent<TaskSocketData>(RealtimeEvent.TASK_UPDATED, updatedTask => {
        if (updatedTask.id.toString() === taskIdStr && onTaskChange) {
            console.log("Task updated:", updatedTask);
            queryClient.invalidateQueries({
                queryKey: taskKeys.all,
                refetchType: "all",
            });
            onTaskChange();
        }
    });

    // Comment event listeners
    useRealtimeEvent<CommentSocketData>(RealtimeEvent.COMMENT_ADDED, newComment => {
        if (newComment.taskId.toString() === taskIdStr && onCommentChange) {
            console.log("Comment added to task:", taskIdStr);
            // Invalidate comments for this task
            queryClient.invalidateQueries({
                queryKey: ["taskComments", taskIdStr],
                refetchType: "all",
            });
            onCommentChange();
        }
    });

    useRealtimeEvent<CommentSocketData>(RealtimeEvent.COMMENT_UPDATED, updatedComment => {
        if (updatedComment.taskId.toString() === taskIdStr && onCommentChange) {
            console.log("Comment updated on task:", taskIdStr);
            // Invalidate comments for this task
            queryClient.invalidateQueries({
                queryKey: ["taskComments", taskIdStr],
                refetchType: "all",
            });
            onCommentChange();
        }
    });

    useRealtimeEvent<CommentSocketData>(RealtimeEvent.COMMENT_DELETED, deletedComment => {
        if (deletedComment.taskId.toString() === taskIdStr && onCommentChange) {
            console.log("Comment deleted from task:", taskIdStr);
            // Invalidate comments for this task
            queryClient.invalidateQueries({
                queryKey: ["taskComments", taskIdStr],
                refetchType: "all",
            });
            onCommentChange();
        }
    });

    // Activity event listener
    useRealtimeEvent(RealtimeEvent.ACTIVITY_CREATED, (activity: any) => {
        if (activity.taskId?.toString() === taskIdStr && onTaskChange) {
            console.log("New activity on task:", taskIdStr);
            // Invalidate activity for this task
            queryClient.invalidateQueries({
                queryKey: ["taskActivity", taskIdStr],
                refetchType: "all",
            });
            onTaskChange();
        }
    });

    return {};
}
