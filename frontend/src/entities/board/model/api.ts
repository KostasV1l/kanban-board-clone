import axiosInstance from "@shared/api/axios-instance";
import { Board } from "./types";

export const BoardAPI = {
    // Get all boards
    getBoards: async (userId: string): Promise<Board[]> => {
        try {
            const { data } = await axiosInstance.get<Board[]>("/boards", {
                params: { userId },
            });
            return data;
        } catch (error: any) {
            console.error("Failed to fetch boards:", error.response?.data?.message || error.message);
            throw error;
        }
    },

    // Get a single board by ID
    getBoard: async (boardId: string): Promise<Board> => {
        try {
            const { data } = await axiosInstance.get<Board>(`/boards/${boardId}`);
            return data;
        } catch (error: any) {
            console.error("Failed to fetch board create board:", error.response?.data?.message || error.message);
            throw error;
        }
    },

    // Create a new board — expect userId passed explicitly
    createBoard: async (board: Omit<Board, "id">, userId: string): Promise<Board> => {
        try {
            const { data } = await axiosInstance.post<Board>("/boards", board, {
                params: { id: userId },
            });
            return data;
        } catch (error: any) {
            console.error("Failed to create board:", error.response?.data?.message || error.message);
            throw error;
        }
    },

    // Update an existing board
    updateBoard: async (board: Board): Promise<Board> => {
        try {
            const { data } = await axiosInstance.put<Board>(`/boards/${board.id}`, board);
            return data;
        } catch (error: any) {
            console.error(`Failed to update board ${board.id}:`, error.response?.data?.message || error.message);
            throw error;
        }
    },

    // Delete a board
    deleteBoard: async (id: string): Promise<boolean> => {
        try {
            await axiosInstance.delete(`/boards/${id}`);
            return true;
        } catch (error: any) {
            console.error(`Failed to delete board ${id}:`, error.response?.data?.message || error.message);
            throw error;
        }
    },
};
