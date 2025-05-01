import { useCurrentUser } from "@features/auth";
import { useQuery } from "@tanstack/react-query";
import { ListAPI, listKeys } from "../model";

// Get a single list by ID
export const useGetList = (id: number) => {
    const { data: currentUser } = useCurrentUser();
    const userId = currentUser?.id || "";

    return useQuery({
        queryKey: listKeys.list(id),
        queryFn: () => ListAPI.getList(id, userId),
        enabled: !!id && !!userId,
    });
};