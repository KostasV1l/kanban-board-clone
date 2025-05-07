import { useMutation } from "@tanstack/react-query";
import { handleApiError } from "@/shared/utils/error";
import { toast } from "sonner";
import { queryClient } from "@shared/api/query-client";
import { MemberAPI } from "../api";
import { memberKeys } from "../model/query-keys";

export const useDeleteMember = () => {
    return useMutation({
        mutationFn: (data: { boardId: string; memberId: string }) => MemberAPI.deleteMember(data.boardId, data.memberId),
        onSuccess: (data, variables) => {
            toast.success("Member deleted successfully");
            queryClient.invalidateQueries({ queryKey: memberKeys.board(variables.boardId) });
        },
        onError: error => {
            handleApiError(error, "Delete member");
            toast.error("Failed to delete member");
        },
    });
};