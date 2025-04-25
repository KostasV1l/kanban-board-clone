export interface List {
    id: number;
    name: string;
    boardId: number;
    position: number; // For list ordering within a board
    color?: string; // Optional color for the list header
    tasksCount?: number; // Optional count of tasks in this list
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateListDto {
    name: string;
    boardId: number;
    position?: number;
    color?: string;
}

export interface UpdateListDto {
    name?: string;
    position?: number;
    color?: string;
}
