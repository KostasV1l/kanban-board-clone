import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Board, boardKeys } from "@/entities/board/model";
import { BoardAPI } from "@features/board/api";
import { handleApiError } from "@/shared/utils/error";
import { toast } from "sonner";

// Delete a board
export const useDeleteBoard = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => BoardAPI.deleteBoard(id),
        onSuccess: (_, id) => {
            toast.success("Board deleted successfully");
            // Update the boards list
            queryClient.setQueryData(boardKeys.lists(), (old: Board[] | undefined) =>
                old ? old.filter(b => b.id !== id) : [],
            );

            // Remove the board from the cache
            queryClient.removeQueries({ queryKey: boardKeys.detail(id) });
        },
        onError: error => {
            handleApiError(error, "Delete board");
        },
    });
};
