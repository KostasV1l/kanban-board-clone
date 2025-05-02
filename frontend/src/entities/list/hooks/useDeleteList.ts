import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@shared/api/query-client";
import { List, ListAPI, listKeys } from "../model";

// Delete a list
export const useDeleteList = (boardId: string) => {
    return useMutation({
        mutationFn: (id: string) => ListAPI.deleteList(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: listKeys.boardLists(boardId) });
        },
    });
};
