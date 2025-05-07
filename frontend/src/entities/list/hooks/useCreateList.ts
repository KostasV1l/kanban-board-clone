import { useMutation } from "@tanstack/react-query";
import { CreateListDto, ListAPI, listKeys } from "../model";
import { queryClient } from "@shared/api/query-client";
import { handleApiError } from "@/shared/utils/error";
import { toast } from "sonner";

// Create a new list
export const useCreateList = () => {
    return useMutation({
        mutationFn: ({ boardId, data }: { boardId: string, data: CreateListDto }) => ListAPI.createList(boardId, data),
        onSuccess: data => {
            toast.success("List created successfully");
            queryClient.invalidateQueries({ queryKey: listKeys.boardLists(data.boardId) });
        },
        onError: error => {
            handleApiError(error, "Create list");
        },
    });
};