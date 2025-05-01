import { useCurrentUser } from "@features/auth";
import { useMutation } from "@tanstack/react-query";
import { ListAPI, listKeys } from "../model";
import { queryClient } from "@shared/api/query-client";

// Reorder lists
export const useReorderLists = () => {
    const { data: currentUser } = useCurrentUser();
    const userId = currentUser?.id || "";

    return useMutation({
        mutationFn: ({ boardId, listIds }: { boardId: number; listIds: number[] }) =>
            ListAPI.reorderLists(boardId, listIds, userId),
        onSuccess: (_, { boardId }) => {
            queryClient.invalidateQueries({ queryKey: listKeys.boardLists(boardId) });
        },
    });
};