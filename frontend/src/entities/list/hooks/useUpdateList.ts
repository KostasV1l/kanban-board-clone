import { useCurrentUser } from "@features/auth";
import { useMutation } from "@tanstack/react-query";
import { ListAPI, listKeys, UpdateListDto } from "../model";
import { queryClient } from "@shared/api/query-client";

// Update a list
export const useUpdateList = () => {
    const { data: currentUser } = useCurrentUser();
    const userId = currentUser?.id || "";

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateListDto }) => ListAPI.updateList(id, data, userId),
        onSuccess: data => {
            queryClient.invalidateQueries({ queryKey: listKeys.list(data.id) });
            queryClient.invalidateQueries({ queryKey: listKeys.boardLists(data.boardId) });
        },
    });
};