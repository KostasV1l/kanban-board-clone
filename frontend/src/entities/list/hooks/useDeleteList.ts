import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@shared/api/query-client";
import { ListAPI, listKeys } from "../model";
import { handleApiError } from "@/shared/utils/error";
import { toast } from "sonner";

// Delete a list
export const useDeleteList = () => {
    return useMutation({
        mutationFn: ({ boardId, listId }: { boardId: string, listId: string }) => ListAPI.deleteList(boardId, listId),
        onSuccess: (data) => {
            toast.success("List deleted successfully");
            queryClient.invalidateQueries({ queryKey: listKeys.boardLists(data.boardId) });
        },
        onError: error => {
            handleApiError(error, "Delete list");
        },
    });
};
