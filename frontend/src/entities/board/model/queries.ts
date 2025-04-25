import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BoardAPI } from "./api";
import { boardKeys } from "./keys";
import { Board } from "./types";

/**
 * Tanstack Query hooks for board operations
 * These hooks handle server state management for boards
 */

// Get all boards
export const useBoards = () => {
    return useQuery({
        queryKey: boardKeys.lists(),
        queryFn: () => BoardAPI.getBoards(),
    });
};

// Get a single board by ID
export const useBoard = (id: number) => {
    return useQuery({
        queryKey: boardKeys.detail(id),
        queryFn: () => BoardAPI.getBoard(id),
        enabled: !!id, // Only run query if id exists
    });
};

// Create a new board
export const useCreateBoard = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (board: Omit<Board, "id">) => BoardAPI.createBoard(board),
        onSuccess: newBoard => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: boardKeys.lists() });

            // Or alternatively, manually update the cache
            queryClient.setQueryData(boardKeys.lists(), (old: Board[] | undefined) =>
                old ? [...old, newBoard] : [newBoard],
            );
        },
    });
};

// Update a board
export const useUpdateBoard = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (board: Board) => BoardAPI.updateBoard(board),
        onSuccess: updatedBoard => {
            // Update the boards list
            queryClient.setQueryData(boardKeys.lists(), (old: Board[] | undefined) =>
                old ? old.map(b => (b.id === updatedBoard.id ? updatedBoard : b)) : [updatedBoard],
            );

            // Update the individual board data
            queryClient.setQueryData(boardKeys.detail(updatedBoard.id), updatedBoard);
        },
    });
};

// Delete a board
export const useDeleteBoard = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => BoardAPI.deleteBoard(id),
        onSuccess: (_, id) => {
            // Update the boards list
            queryClient.setQueryData(boardKeys.lists(), (old: Board[] | undefined) =>
                old ? old.filter(b => b.id !== id) : [],
            );

            // Remove the board from the cache
            queryClient.removeQueries({ queryKey: boardKeys.detail(id) });
        },
    });
};
