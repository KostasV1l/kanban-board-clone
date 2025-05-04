import axiosInstance from "@shared/api/axios-instance";
import { CreateListDto, List, UpdateListDto } from "../model/types";

// Base API functions for list operations -> Used in Tanstack Query hooks
export const ListAPI = {
    // Get all lists for a board
    getLists: async (boardId: string): Promise<List[]> => {
        try {
            const { data } = await axiosInstance.get<List[]>("/lists", {
                params: { boardId },
            });
            return data;
        } catch (error) {
            console.error("Failed to fetch lists:", error);
            throw error;
        }
    },

    // Get a single list by ID
    getList: async (id: number): Promise<List> => {
        try {
            // TODO: Change to actual API endpoint
            const { data } = await axiosInstance.get<List>(`lists/${id}`);
            return data;
        } catch (error) {
            console.error("Failed to fetch list:", error);
            throw error;
        }
    },

    // Create a new list
    createList: async (data: CreateListDto): Promise<List> => {
        try {
            const res = await axiosInstance.post<List>(`/lists`, data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                },
            });
            return res.data;
        } catch (error) {
            console.error("Failed to create list:", error);
            throw error;
        }
    },

    // Update a list
    updateList: async (id: string, data: UpdateListDto): Promise<List> => {
        try {
            const res = await axiosInstance.put<List>(`/lists/${id}`, data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                },
            });
            return res.data;
        } catch (error) {
            console.error("Failed to update list:", error);
            throw error;
        }
    },

    // Delete a list
    deleteList: async (id: string): Promise<void> => {
        try {
            await axiosInstance.delete(`/lists/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                },
            });
        } catch (error) {
            console.error("Failed to delete list:", error);
            throw error;
        }
    },

    // Reorder lists within a board
    reorderLists: async (boardId: string, listUpdates: { id: string; order: number }[]): Promise<void> => {
        try {
            await axiosInstance.post(`/lists/boards/${boardId}/reorder`, { listUpdates });
        } catch (error) {
            console.error("Failed to reorder lists:", error);
            throw error;
        }
    },
};
