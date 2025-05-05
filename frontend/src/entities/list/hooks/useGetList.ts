import { useQuery } from "@tanstack/react-query";
import { ListAPI, listKeys } from "../model";

// Get a single list by ID
export const useGetList = (boardId: string, listId: string) => {

    return useQuery({
        queryKey: listKeys.list(listId),
        queryFn: () => ListAPI.getList(boardId, listId),
        enabled: !!boardId && !!listId,
    });
};