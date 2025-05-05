import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryClient } from "@shared/api/query-client";
import { MemberAPI } from "../api";
import { memberKeys } from "../model/query-keys";

export const useInviteUserByEmail = () => {
    return useMutation({
        mutationFn: (data: { boardId: string; email: string; role: string }) =>
            MemberAPI.inviteUserByEmail(data.boardId, { email: data.email, role: data.role }),
        onSuccess: (data, variables) => {
            console.log("Hook onSuccess triggered:", data); 
            toast.success(`User ${data.user.email} invited successfully`);
            queryClient.invalidateQueries({ queryKey: memberKeys.board(variables.boardId) });
        },
    });
};
