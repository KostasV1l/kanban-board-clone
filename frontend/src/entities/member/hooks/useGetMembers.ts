import { useQuery } from "@tanstack/react-query";
import { MemberAPI } from "../api";
import { IMember } from "../model";
import { memberKeys } from "../model/query-keys";

export const useGetMembers = (boardId: string) => {
    return useQuery<IMember[]>({
        queryFn: () => MemberAPI.getMembers(boardId),
        queryKey: memberKeys.board(boardId),
        enabled: !!boardId && boardId.trim() !== '',
    });
};
