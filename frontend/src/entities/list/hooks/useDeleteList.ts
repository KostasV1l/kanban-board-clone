import { useCurrentUser } from "@features/auth";
import { useMutation } from "@tanstack/react-query";
import { ListAPI, listKeys } from "../model";
import { queryClient } from "@shared/api/query-client";

// Delete a list
export const useDeleteList = () => {
    const { data: currentUser } = useCurrentUser();
    const userId = currentUser?.id || "";

    return useMutation({
        mutationFn: (id: number) => ListAPI.deleteList(id, userId),
        onSuccess: (_, id) => {
            // We don't know the boardId here, so we invalidate all lists
            queryClient.invalidateQueries({ queryKey: listKeys.lists() });
        },
    });
};