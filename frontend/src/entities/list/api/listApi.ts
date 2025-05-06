import axiosInstance from "@shared/api/axios-instance";
import { CreateListDto, List, UpdateListDto } from "../model/types";

// Base API functions for list operations -> Used in Tanstack Query hooks
export const ListAPI = {
    // Get all lists for a board
    getLists: async (boardId: string): Promise<List[]> => {
        const { data } = await axiosInstance.get<List[]>(`/boards/${boardId}/lists`);
        return data;
    },

    // Get a single list by ID
    getList: async (boardId: string, listId: string): Promise<List> => {
        // TODO: Change to actual API endpoint
        const { data } = await axiosInstance.get<List>(`/boards/${boardId}/lists/${listId}`);
        return data;
    },

    // Create a new list
    createList: async (boardId: string, data: CreateListDto): Promise<List> => {
        const res = await axiosInstance.post<List>(`/boards/${boardId}/lists`, data);
        return res.data;
    },

    // Update a list
    updateList: async (boardId: string, listId: string, data: UpdateListDto): Promise<List> => {
        const res = await axiosInstance.put<List>(`/boards/${boardId}/lists/${listId}`, data);
        return res.data;
    },

    // Delete a list
    deleteList: async (boardId: string, listId: string): Promise<List> => {
        const res = await axiosInstance.delete<List>(`/boards/${boardId}/lists/${listId}`);
        return res.data;
    },

    // Reorder lists within a board
    reorderLists: async (boardId: string, listUpdates: { id: string; order: number }[]): Promise<List[]> => {
        const { data } = await axiosInstance.post<List[]>(`/boards/${boardId}/lists/reorder`, listUpdates);
        return data;
    },
};
