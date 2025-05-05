import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@shared/api/query-client";
import { ListAPI, listKeys } from "../model";

// Delete a list
export const useDeleteList = () => {
    return useMutation({
        mutationFn: ({ boardId, listId }: { boardId: string, listId: string }) => ListAPI.deleteList(boardId, listId),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: listKeys.boardLists(data.boardId) });
        },
    });
};
