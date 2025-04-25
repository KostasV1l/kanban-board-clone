export type TaskPriority = "low" | "medium" | "high";

export interface Task {
    id: number;
    title: string;
    description: string;
    boardId: number;
    columnId: number; // For different status columns (backlog, todo, in progress, done)
    priority: TaskPriority;
    dueDate?: string;
    createdAt: string;
    updatedAt: string;
    assignedTo?: {
        id: number;
        name: string;
        avatar?: string;
    };
}
