import { useQuery } from "@tanstack/react-query";
import { TaskAPI } from "../api";
import { taskKeys } from "../model";

export const useGetTasksByList = (listId: string) => {
    return useQuery({
        queryKey: taskKeys.list(listId),
        queryFn: () => TaskAPI.getTasksByList(listId),
        staleTime: 5 * 60 * 1000,
    });
};
