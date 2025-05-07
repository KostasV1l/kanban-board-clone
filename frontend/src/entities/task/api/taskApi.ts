import axiosInstance from "@shared/api/axios-instance";
import { ITask } from "../model";

export const TaskAPI = {
    getTasksByList: async (boardId: string, listId: string): Promise<ITask[]> => {
        const { data } = await axiosInstance.get<ITask[]>(`/boards/${boardId}/lists/${listId}/tasks`);
        return data;
    },

    createTask: async (boardId: string, listId: string, task: ITask): Promise<ITask> => {
        const { data } = await axiosInstance.post<ITask>(`/boards/${boardId}/lists/${listId}/tasks`, task);
        return data;
    },

    updateTask: async (boardId: string, listId: string, taskId: string, task: Partial<ITask>): Promise<ITask> => {
        const { data } = await axiosInstance.put<ITask>(`/boards/${boardId}/lists/${listId}/tasks/${taskId}`, task);
        return data;
    },

    deleteTask: async (boardId: string, listId: string, taskId: string): Promise<ITask> => {
        const { data } = await axiosInstance.delete<ITask>(`/boards/${boardId}/lists/${listId}/tasks/${taskId}`);
        return data;
    },
};
