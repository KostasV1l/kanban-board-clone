import { Board } from "@/entities/board/model";
import axiosInstance from "@shared/api/axios-instance";

export const BoardAPI = {
    // Get all boards
    getBoards: async (userId: string): Promise<Board[]> => {
        const { data } = await axiosInstance.get<Board[]>("/boards", {
            params: { userId },
        });
        return data;
    },

    // Get a single board by ID
    getBoard: async (boardId: string): Promise<Board> => {
        const { data } = await axiosInstance.get<Board>(`/boards/${boardId}`);
        return data;
    },

    // Create a new board — expect userId passed explicitly
    createBoard: async (board: Omit<Board, "id">, userId: string): Promise<Board> => {
        const { data } = await axiosInstance.post<Board>("/boards", board, {
            params: { id: userId }, // Assuming the backend expects userId as 'id' param
        });
        return data;
    },

    // Update an existing board
    updateBoard: async (board: Board): Promise<Board> => {
        const { data } = await axiosInstance.put<Board>(`/boards/${board.id}`, board);
        return data;
    },

    // Delete a board
    deleteBoard: async (id: string): Promise<boolean> => {
        await axiosInstance.delete(`/boards/${id}`);
        return true;
    },
};
