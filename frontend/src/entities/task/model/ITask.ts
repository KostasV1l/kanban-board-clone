import { BaseEntity } from "@shared/model/BaseEntity";

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";
export type TaskStatus = "TODO" | "IN_PROGRESS" | "COMPLETED";

export interface ITask extends BaseEntity {
    title: string;
    description?: string;
    boardId: string;
    listId: string;
    order?: number;
    status?: TaskStatus;
    priority: TaskPriority;
    dueDate?: string;
    assignedTo?: string | null;
    createdBy?: {
        id: string;
        name: string;
    };
}
