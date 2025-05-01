import { useQuery } from "@tanstack/react-query";
import { ListAPI, listKeys } from "../model";

// Get all lists for a board
export const useGetLists = (boardId: string) => {

    return useQuery({
        queryKey: listKeys.boardLists(boardId),
        queryFn: () => ListAPI.getLists(boardId),
        enabled: !!boardId,
    });
};