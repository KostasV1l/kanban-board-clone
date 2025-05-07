import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Board, boardKeys } from "@/entities/board/model";
import { useCurrentUser } from "@features/auth/hooks";
import { BoardAPI } from "@features/board/api";
import { handleApiError } from "@/shared/utils/error";
import { toast } from "sonner";

export const useCreateBoard = () => {
    const queryClient = useQueryClient();
    const { data: currentUser } = useCurrentUser();
    const userId = currentUser?.id || "";

    return useMutation({
        mutationFn: (board: Omit<Board, "id">) => BoardAPI.createBoard(board, userId),
        onSuccess: newBoard => {
            toast.success("Board created successfully");
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: boardKeys.lists() });

            // Or alternatively, manually update the cache
            queryClient.setQueryData(boardKeys.lists(), (old: Board[] | undefined) =>
                old ? [...old, newBoard] : [newBoard],
            );
        },
        onError: error => {
            handleApiError(error, "Create board");
        },
    });
};
