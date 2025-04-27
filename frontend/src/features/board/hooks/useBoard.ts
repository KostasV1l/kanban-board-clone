import { useQuery } from "@tanstack/react-query";
import { boardKeys } from "@/entities/board/model"; // Updated import
import { BoardAPI } from "@features/board/api"; // Updated import

// Get a single board by ID
export const useBoard = (id: string) => {
    return useQuery({
        queryKey: boardKeys.detail(id),
        queryFn: () => BoardAPI.getBoard(id),
        enabled: !!id, // Only run query if id exists
    });
};
