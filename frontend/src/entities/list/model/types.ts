export interface List {
    id: string;
    name: string;
    board: string;
    order: number; // For list ordering within a board
    color?: string; // Optional color for the list header
    tasksCount?: number; // Optional count of tasks in this list
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateListDto {
    name: string;
    board: string;
    order: number;
    color?: string;
}

export interface UpdateListDto {
    name?: string;
    position?: number;
    color?: string;
}
