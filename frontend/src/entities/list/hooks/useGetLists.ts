import { useCurrentUser } from "@features/auth";
import { useQuery } from "@tanstack/react-query";
import { ListAPI, listKeys } from "../model";

// Get all lists for a board
export const useGetLists = (boardId: string) => {
    const { data: currentUser } = useCurrentUser();
    const userId = currentUser?.id || "";

    return useQuery({
        queryKey: listKeys.boardLists(boardId),
        queryFn: () => ListAPI.getLists(boardId),
        enabled: !!userId && !!boardId,
    });
};