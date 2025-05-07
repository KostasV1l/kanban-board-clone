import { useMutation } from "@tanstack/react-query";
import { boardKeys } from "@entities/board/model";
import { queryClient } from "@shared/api/query-client";
import { TaskAPI } from "../api";
import { taskKeys } from "../model";
import { handleApiError } from "@/shared/utils/error";
import { toast } from "sonner";

export const useDeleteTask = () => {
    return useMutation({
        mutationFn: (data: { boardId: string; listId: string; taskId: string }) =>
            TaskAPI.deleteTask(data.boardId, data.listId, data.taskId),
        onSuccess: deletedTask => {
            toast.success("Task deleted successfully");
            queryClient.invalidateQueries({ queryKey: taskKeys.list(deletedTask.listId) });
            queryClient.invalidateQueries({ queryKey: boardKeys.lists() });
        },
        onError: error => {
            handleApiError(error, "Delete task");
        },
    });
};
