import { BaseEntity } from "@shared/model/BaseEntity";

export type TaskPriority = "low" | "medium" | "high";
export type TaskStatus = "todo" | "in-progress" | "completed";

export interface ITask extends BaseEntity {
    title: string;
    description?: string;
    boardId: string;
    listId: string;
    order?: number;
    status?: TaskStatus;
    priority: TaskPriority;
    dueDate?: string;
    assignedTo?: {
        id: string;
        name: string;
        avatar?: string;
    };
    createdBy?: {
        id: string;
        name: string;
    };
}
