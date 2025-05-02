import { BaseEntity } from "@shared/model/BaseEntity";

export type TaskPriority = "low" | "medium" | "high";
export type TaskStatus = "todo" | "in-progress" | "completed";

export interface ITask extends BaseEntity {
    title: string;
    description?: string;
    boardId: number;
    listId: number;
    order: number;
    status?: TaskStatus;
    priority: TaskPriority;
    dueDate?: string;
    assignedTo?: {
        id: number;
        name: string;
        avatar?: string;
    };
    createdBy?: {
        id: number;
        name: string;
    };
}
