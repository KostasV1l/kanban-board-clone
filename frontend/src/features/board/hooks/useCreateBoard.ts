import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Board, boardKeys } from "@/entities/board/model";
import { useCurrentUser } from "@features/auth/hooks";
import { BoardAPI } from "@features/board/api";

// Create a new board
export const useCreateBoard = () => {
    const queryClient = useQueryClient();
    const { data: currentUser } = useCurrentUser();
    const userId = currentUser?.id || "";

    return useMutation({
        mutationFn: (board: Omit<Board, "id">) => BoardAPI.createBoard(board, userId),
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
