import { useMutation } from "@tanstack/react-query";
import { boardKeys } from "@entities/board/model";
import { queryClient } from "@shared/api/query-client";
import { TaskAPI } from "../api";
import { taskKeys } from "../model";

export const useDeleteTask = () => {
    return useMutation({
        mutationFn: (data: { boardId: string; listId: string; taskId: string }) =>
            TaskAPI.deleteTask(data.boardId, data.listId, data.taskId),
        onSuccess: deletedTask => {
            queryClient.invalidateQueries({ queryKey: taskKeys.list(deletedTask.listId) });
            queryClient.invalidateQueries({ queryKey: boardKeys.lists() });
        },
    });
};
