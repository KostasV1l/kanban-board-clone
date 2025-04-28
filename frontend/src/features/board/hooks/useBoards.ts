import { useQuery } from "@tanstack/react-query";
import { boardKeys } from "@/entities/board/model";
import { useCurrentUser } from "@features/auth/hooks";
import { BoardAPI } from "@features/board/api";

// Get all boards
export const useBoards = () => {
    const { data: currentUser } = useCurrentUser();
    const userId = currentUser?.id || "";

    return useQuery({
        queryKey: boardKeys.lists(),
        queryFn: () => BoardAPI.getBoards(userId),
        enabled: !!userId, // Only run the query if we have a userId
    });
};
