import { useCurrentUser } from "@features/auth";
import { useMutation } from "@tanstack/react-query";
import { CreateListDto, ListAPI, listKeys } from "../model";
import { queryClient } from "@shared/api/query-client";

// Create a new list
export const useCreateList = () => {
    const { data: currentUser } = useCurrentUser();
    const userId = currentUser?.id || "";

    return useMutation({
        mutationFn: (data: CreateListDto) => ListAPI.createList(data, userId),
        onSuccess: data => {
            queryClient.invalidateQueries({ queryKey: listKeys.boardLists(data.boardId) });
        },
    });
};