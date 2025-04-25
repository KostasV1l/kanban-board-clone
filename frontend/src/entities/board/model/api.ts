import { Board } from "./types";

// Mock data that will be replaced with real API calls later
const MOCK_BOARDS: Board[] = [
    {
        id: 1,
        name: "Personal",
        description: "Personal board",
        color: "bg-blue-500",
    },
    {
        id: 2,
        name: "Work",
        description: "Work board",
        color: "bg-green-500",
    },
    {
        id: 3,
        name: "School",
        description: "School board",
        color: "bg-red-500",
    },
    {
        id: 4,
        name: "Hobby",
        description: "Hobby board",
        color: "bg-yellow-500",
    },
    {
        id: 5,
        name: "Fitness",
        description: "Fitness board",
        color: "bg-purple-500",
    },
];

// API client for board-related operations
export const BoardAPI = {
    // Get all boards
    getBoards: async (): Promise<Board[]> => {
        // Simulate API delay
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(MOCK_BOARDS);
            }, 1500);
        });
    },

    // Get a single board by ID
    getBoard: async (id: number): Promise<Board | undefined> => {
        return new Promise(resolve => {
            setTimeout(() => {
                const board = MOCK_BOARDS.find(board => board.id === id);
                resolve(board);
            }, 1300);
        });
    },

    // Create a new board
    createBoard: async (board: Omit<Board, "id">): Promise<Board> => {
        return new Promise(resolve => {
            setTimeout(() => {
                const newBoard = {
                    ...board,
                    id: Math.max(...MOCK_BOARDS.map(b => b.id)) + 1,
                };
                // In a real implementation, we would update the server
                resolve(newBoard);
            }, 300);
        });
    },

    // Update an existing board
    updateBoard: async (boardData: Board): Promise<Board> => {
        return new Promise(resolve => {
            setTimeout(() => {
                // In a real implementation, we would update the server
                resolve(boardData);
            }, 300);
        });
    },

    // Delete a board
    deleteBoard: async (id: number): Promise<boolean> => {
        return new Promise(resolve => {
            setTimeout(() => {
                // In a real implementation, we would delete from the server
                resolve(true);
            }, 300);
        });
    },
};