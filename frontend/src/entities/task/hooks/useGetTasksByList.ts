import { useQuery } from "@tanstack/react-query";
import { TaskAPI } from "../api";
import { ITask, taskKeys } from "../model";

export const useGetTasksByList = (boardId: string, listId: string) => {
    return useQuery<ITask[]>({
        queryKey: taskKeys.list(listId),
        queryFn: () => TaskAPI.getTasksByList(boardId, listId),
        staleTime: 0,
    });
};
