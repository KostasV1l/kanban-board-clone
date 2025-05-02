import axiosInstance from "@shared/api/axios-instance";
import { ITask } from "../model";

export const TaskAPI = {
    getTasksByList: async (listId: string | number): Promise<ITask[]> => {
        const { data } = await axiosInstance.get<ITask[]>(`/tasks/list/${listId}`);
        return data;
    },

    createTask: async (task: ITask): Promise<ITask> => {
        const { data } = await axiosInstance.post<ITask>("/tasks", task);
        return data;
    },
};
