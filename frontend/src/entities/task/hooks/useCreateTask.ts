import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@shared/api/query-client";
import { TaskAPI } from "../api";
import { ITask, taskKeys } from "../model";
import { boardKeys } from "@entities/board/model";
import { handleApiError } from "@/shared/utils/error";
import { toast } from "sonner";

export const useCreateTask = () => {
    return useMutation({
        mutationFn: (data: { boardId: string; listId: string; task: ITask }) =>
            TaskAPI.createTask(data.boardId, data.listId, data.task),
        onSuccess: data => {
            toast.success("Task created successfully");
            queryClient.invalidateQueries({ queryKey: taskKeys.list(data.listId) });
            queryClient.invalidateQueries({ queryKey: boardKeys.lists() });
        },
        onError: error => {
            handleApiError(error, "Create task");
        },
    });
};
