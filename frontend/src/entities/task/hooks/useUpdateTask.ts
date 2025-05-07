import { useMutation } from "@tanstack/react-query";
import { boardKeys } from "@entities/board/model";
import { queryClient } from "@shared/api/query-client";
import { TaskAPI } from "../api";
import { ITask, taskKeys } from "../model";
import { handleApiError } from "@/shared/utils/error";
import { toast } from "sonner";

interface UpdateTaskParams {
    boardId: string;
    listId: string;
    taskId: string;
    data: Partial<ITask>;
}

export const useUpdateTask = () => {
    return useMutation({
        mutationFn: ({ boardId, listId, taskId, data }: UpdateTaskParams) =>
            TaskAPI.updateTask(boardId, listId, taskId, data),
        onSuccess: () => {
            toast.success("Task updated successfully");
        },
        onMutate: async (variables) => {
            // Cancel any outgoing refetches to avoid overwriting our optimistic update
            await queryClient.cancelQueries({ queryKey: taskKeys.list(variables.listId) });
            
            // Get the current data from the cache
            const previousTasks = queryClient.getQueryData<ITask[]>(taskKeys.list(variables.listId));
            
            // If we have data in the cache, update it optimistically
            if (previousTasks) {
                // Create an optimistic update
                const optimisticTasks = previousTasks.map(task => {
                    if (task.id.toString() === variables.taskId.toString()) {
                        // Create an updated task with the new data while preserving other properties
                        return { ...task, ...variables.data };
                    }
                    return task;
                });
                
                // Update the cache immediately with our optimistic data
                queryClient.setQueryData(taskKeys.list(variables.listId), optimisticTasks);
            }
            
            // Return the previous tasks so we can revert if there's an error
            return { previousTasks };
        },
        onError: (error, variables, context) => {
            handleApiError(error, "Update task");
            
            // If there was an error, revert to the previous state
            if (context?.previousTasks) {
                queryClient.setQueryData(taskKeys.list(variables.listId), context.previousTasks);
            }
        },
        onSettled: (data, error, variables) => {
            // Always refetch after error or success to ensure cache is in sync with server
            queryClient.invalidateQueries({ queryKey: taskKeys.list(variables.listId) });
            queryClient.invalidateQueries({ queryKey: boardKeys.lists() });
        },
    });
};
