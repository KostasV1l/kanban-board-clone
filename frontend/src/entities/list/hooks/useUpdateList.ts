import { useMutation } from "@tanstack/react-query";
import { ListAPI, listKeys, UpdateListDto } from "../model";
import { queryClient } from "@shared/api/query-client";

// Update a list
export const useUpdateList = () => {

    return useMutation({
        mutationFn: ({ boardId, listId, data }: { boardId: string, listId: string, data: UpdateListDto }) => ListAPI.updateList(boardId, listId, data),
        onSuccess: data => {
            queryClient.invalidateQueries({ queryKey: listKeys.list(data.id) });
            queryClient.invalidateQueries({ queryKey: listKeys.boardLists(data.boardId) });
        },
    });
};