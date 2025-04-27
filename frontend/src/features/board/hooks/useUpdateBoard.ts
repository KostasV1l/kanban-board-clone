import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Board, boardKeys } from "@/entities/board/model";
import { BoardAPI } from "@features/board/api";

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
