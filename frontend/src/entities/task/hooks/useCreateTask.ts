import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@shared/api/query-client";
import { TaskAPI } from "../api";
import { ITask, taskKeys } from "../model";
import { boardKeys } from "@entities/board/model";

export const useCreateTask = () => {
    return useMutation({
        mutationFn: (data: ITask) => TaskAPI.createTask(data),
        onSuccess: data => {
            console.log("data", data);
            queryClient.invalidateQueries({ queryKey: taskKeys.list(data.listId) });
            queryClient.invalidateQueries({ queryKey: boardKeys.lists() });
        },
    });
};
