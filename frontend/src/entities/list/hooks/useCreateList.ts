import { useMutation } from "@tanstack/react-query";
import { CreateListDto, ListAPI, listKeys } from "../model";
import { queryClient } from "@shared/api/query-client";

// Create a new list
export const useCreateList = () => {

    return useMutation({
        mutationFn: ({ boardId, data }: { boardId: string, data: CreateListDto }) => ListAPI.createList(boardId, data),
        onSuccess: data => {
            queryClient.invalidateQueries({ queryKey: listKeys.boardLists(data.boardId) });
        },
    });
};