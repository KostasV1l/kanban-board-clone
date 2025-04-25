import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TaskAPI } from "./api";
import { taskKeys } from "./keys";
import { Task } from "./types";

/**
 * React Query hooks for task operations
 * These hooks handle server state management for tasks
 */

// Get all tasks for a board
export const useBoardTasks = (boardId: number) => {
    return useQuery({
        queryKey: taskKeys.list({ boardId }),
        queryFn: () => TaskAPI.getTasks(boardId),
        enabled: !!boardId, // Only run query if boardId exists
    });
};

// Get a single task by ID
export const useTask = (id: number) => {
    return useQuery({
        queryKey: taskKeys.detail(id),
        queryFn: () => TaskAPI.getTask(id),
        enabled: !!id, // Only run query if id exists
    });
};

// Create a new task
export const useCreateTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => TaskAPI.createTask(task),
        onSuccess: newTask => {
            // Update the tasks list for this board
            queryClient.setQueryData(taskKeys.list({ boardId: newTask.boardId }), (old: Task[] | undefined) =>
                old ? [...old, newTask] : [newTask],
            );
        },
    });
};

// Update a task
export const useUpdateTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (taskData: Partial<Task> & { id: number }) => TaskAPI.updateTask(taskData),
        onSuccess: updatedTask => {
            // Update the task in the cache
            queryClient.setQueryData(taskKeys.detail(updatedTask.id), updatedTask);

            // Update the task in any lists that might contain it
            queryClient.setQueryData(taskKeys.list({ boardId: updatedTask.boardId }), (old: Task[] | undefined) =>
                old ? old.map(t => (t.id === updatedTask.id ? updatedTask : t)) : [updatedTask],
            );
        },
    });
};

// TODO: Adjust with Drag and Drop functionality
// Move a task to a different column
export const useMoveTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ taskId, columnId }: { taskId: number; columnId: number }) => TaskAPI.moveTask(taskId, columnId),
        onSuccess: updatedTask => {
            // Update the task in the cache
            queryClient.setQueryData(taskKeys.detail(updatedTask.id), updatedTask);

            // Update the task in any lists that might contain it
            queryClient.setQueryData(taskKeys.list({ boardId: updatedTask.boardId }), (old: Task[] | undefined) =>
                old ? old.map(t => (t.id === updatedTask.id ? updatedTask : t)) : [updatedTask],
            );
        },
    });
};

// Delete a task
export const useDeleteTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, boardId }: { id: number; boardId: number }) => TaskAPI.deleteTask(id),
        onSuccess: (_, { id, boardId }) => {
            // Update the tasks list by removing the deleted task
            queryClient.setQueryData(taskKeys.list({ boardId }), (old: Task[] | undefined) =>
                old ? old.filter(t => t.id !== id) : [],
            );

            // Remove the task from the cache
            queryClient.removeQueries({ queryKey: taskKeys.detail(id) });
        },
    });
};
