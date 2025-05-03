import { useMutation } from "@tanstack/react-query";
import { ListAPI, listKeys, UpdateListDto } from "../model";
import { queryClient } from "@shared/api/query-client";

// Update a list
export const useUpdateList = () => {

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateListDto }) => ListAPI.updateList(id, data),
        onSuccess: data => {
            queryClient.invalidateQueries({ queryKey: listKeys.list(data.id) });
            queryClient.invalidateQueries({ queryKey: listKeys.boardLists(data.board) });
        },
    });
};