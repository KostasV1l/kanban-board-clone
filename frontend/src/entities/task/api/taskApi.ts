import axiosInstance from "@shared/api/axios-instance";
import { ITask } from "../model";

export const TaskAPI = {
    getTasksByList: async (listId: string | number): Promise<ITask[]> => {
        try {
            const { data } = await axiosInstance.get<ITask[]>(`/tasks/list/${listId}`);
            return data;
        } catch (error: unknown) {
            const err = error as Error;
            console.error("Failed to get tasks by list:", err.message);
            throw error;
        }
    },
};
