import { useQuery } from "@tanstack/react-query";
import { MemberAPI } from "../api";
import { IMember } from "../model";
import { memberKeys } from "../model/query-keys";

export const useGetMembers = (boardId: string) => {
    return useQuery<IMember[]>({
        queryKey: memberKeys.board(boardId),
        queryFn: () => MemberAPI.getMembers(boardId),
    });
};
