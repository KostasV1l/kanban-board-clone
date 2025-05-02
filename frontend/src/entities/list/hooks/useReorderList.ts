import { useMutation } from "@tanstack/react-query";
import { ListAPI, listKeys } from "../model";
import { queryClient } from "@shared/api/query-client";

// Reorder lists
export const useReorderLists = () => {
    return useMutation({
        mutationFn: ({ boardId, listIds }: { boardId: string; listIds: number[] }) =>
            ListAPI.reorderLists(boardId, listIds),
        onSuccess: (_, { boardId }) => {
            queryClient.invalidateQueries({ queryKey: listKeys.boardLists(boardId) });
        },
    });
};
