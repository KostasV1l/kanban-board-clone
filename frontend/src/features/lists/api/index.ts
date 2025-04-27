import { List } from "@/entities/list/model";
import axiosInstance from "@shared/api/axios-instance";

export const ListAPI = {
    // Get all lists
    getLists: async (boardId: string) : Promise<List[]> => {
        try {
            const {data} = await axiosInstance.get<List[]>("/lists", {
                params: {boardId},
            });
            return data;
        } catch (error: any) {
            console.error("Failed to fetch lists:", error.response?.data?.message || error.message);
            throw error;
        }
    },

        // Create a new list
        createBoard: async (boardId: string): Promise<List> => {
            try {
                const { data } = await axiosInstance.post<List>("/lists", {
                    params: { id: boardId },
                });
                return data;
            } catch (error: any) {
                console.error("Failed to create list:", error.response?.data?.message || error.message);
                throw error;
            }
        },
}