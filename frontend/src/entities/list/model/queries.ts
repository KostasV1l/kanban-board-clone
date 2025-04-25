import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/shared/api/query-client";
import { ListAPI } from "./api";
import { listKeys } from "./keys";
import { CreateListDto, UpdateListDto } from "./types";

/**
 * TanStack Query hooks for list operations
 * These hooks handle server state management for lists
 */

// Get all lists for a board
export const useGetLists = (boardId: number) => {
    return useQuery({
        queryKey: listKeys.boardLists(boardId),
        queryFn: () => ListAPI.getLists(boardId),
    });
};

// Get a single list by ID
export const useGetList = (id: number) => {
    return useQuery({
        queryKey: listKeys.list(id),
        queryFn: () => ListAPI.getList(id),
        enabled: !!id,
    });
};

// Create a new list
export const useCreateList = () => {
    return useMutation({
        mutationFn: (data: CreateListDto) => ListAPI.createList(data),
        onSuccess: data => {
            queryClient.invalidateQueries({ queryKey: listKeys.boardLists(data.boardId) });
        },
    });
};

// Update a list
export const useUpdateList = () => {
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateListDto }) => ListAPI.updateList(id, data),
        onSuccess: data => {
            queryClient.invalidateQueries({ queryKey: listKeys.list(data.id) });
            queryClient.invalidateQueries({ queryKey: listKeys.boardLists(data.boardId) });
        },
    });
};

// Delete a list
export const useDeleteList = () => {
    return useMutation({
        mutationFn: ListAPI.deleteList,
        onSuccess: (_, id) => {
            // We don't know the boardId here, so we invalidate all lists
            queryClient.invalidateQueries({ queryKey: listKeys.lists() });
        },
    });
};

// Reorder lists
export const useReorderLists = () => {
    return useMutation({
        mutationFn: ({ boardId, listIds }: { boardId: number; listIds: number[] }) =>
            ListAPI.reorderLists(boardId, listIds),
        onSuccess: (_, { boardId }) => {
            queryClient.invalidateQueries({ queryKey: listKeys.boardLists(boardId) });
        },
    });
};
