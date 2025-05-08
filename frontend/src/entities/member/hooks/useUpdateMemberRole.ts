import { useMutation } from "@tanstack/react-query";
import { handleApiError } from "@/shared/utils/error";
import { toast } from "sonner";
import { queryClient } from "@shared/api/query-client";
import { MemberAPI } from "../api";
import { memberKeys } from "../model/query-keys";
import { MEMBER_ROLES } from "../model/role";

export const useUpdateMemberRole = () => {
    return useMutation({
        mutationFn: (data: { boardId: string; memberId: string; role: string }) => {
            if (data.role === MEMBER_ROLES.OWNER) {
                throw new Error("Cannot set a member to Owner role");
            }
            return MemberAPI.updateMemberRole(data.boardId, data.memberId, data.role);
        },
        onSuccess: (data, variables) => {
            toast.success(`Member role updated to ${variables.role}`);
            queryClient.invalidateQueries({ queryKey: memberKeys.board(variables.boardId) });
        },
        onError: error => {
            handleApiError(error, "Update member role");
        },
    });
}; 