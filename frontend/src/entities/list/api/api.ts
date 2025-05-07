import axiosInstance from "@shared/api/axios-instance";
import { CreateListDto, List, UpdateListDto } from "../model/types";

// Base API functions for list operations -> Used in Tanstack Query hooks
export const ListAPI = {
    // Get all lists for a board
    getLists: async (boardId: string): Promise<List[]> => {
        try {
            const { data } = await axiosInstance.get<List[]>(`/boards/${boardId}/lists`);
            return data;
        } catch (error) {
            console.error("Failed to fetch lists:", error);
            throw error;
        }
    },

    // Get a single list by ID
    getList: async (boardId: string, listId: string): Promise<List> => {
        try {
            // TODO: Change to actual API endpoint
            const { data } = await axiosInstance.get<List>(`/boards/${boardId}/lists/${listId}`);
            return data;
        } catch (error) {
            console.error("Failed to fetch list:", error);
            throw error;
        }
    },

    // Create a new list
    createList: async (boardId: string, data: CreateListDto): Promise<List> => {
        try {
            const res = await axiosInstance.post<List>(`/boards/${boardId}/lists`, data);
            return res.data;
        } catch (error) {
            console.error("Failed to create list:", error);
            throw error;
        }
    },

    // Update a list
    updateList: async (boardId: string, listId: string, data: UpdateListDto): Promise<List> => {
        try {
            const res = await axiosInstance.put<List>(`/boards/${boardId}/lists/${listId}`, data);
            return res.data;
        } catch (error) {
            console.error("Failed to update list:", error);
            throw error;
        }
    },

    // Delete a list
    deleteList: async (boardId: string, listId: string): Promise<List> => {
        try {
            const res = await axiosInstance.delete<List>(`/boards/${boardId}/lists/${listId}`);
            return res.data;
        } catch (error) {
            console.error("Failed to delete list:", error);
            throw error;
        }
    },

    // Reorder lists within a board
    reorderLists: async (boardId: string, listUpdates: { id: string; order: number }[]): Promise<List[]> => {
        try {
            const { data } = await axiosInstance.post<List[]>(`/boards/${boardId}/lists/reorder`, { listUpdates });
            return data;
        } catch (error) {
            console.error("Failed to reorder lists:", error);
            throw error;
        }
    },
};
