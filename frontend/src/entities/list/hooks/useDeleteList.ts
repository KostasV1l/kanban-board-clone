import { useMutation } from "@tanstack/react-query";
import { ListAPI, listKeys } from "../model";
import { queryClient } from "@shared/api/query-client";

// Delete a list
export const useDeleteList = () => {
    return useMutation({
        mutationFn: (id: string) => ListAPI.deleteList(id),
        onSuccess: (_, id) => {
            // We don't know the boardId here, so we invalidate all lists
            queryClient.invalidateQueries({ queryKey: listKeys.lists() });
        },
    });
};