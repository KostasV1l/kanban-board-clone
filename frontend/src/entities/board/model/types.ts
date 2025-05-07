export interface Board {
    id: string;
    name: string;
    description: string;
    color: string;
    tasksCount?: number;
    userRole?: string; 
}
