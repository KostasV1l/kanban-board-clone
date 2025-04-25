import { Task } from "./types";

// Mock columns for tasks
export enum TaskColumn {
    BACKLOG = 1,
    TODO = 2,
    IN_PROGRESS = 3,
    DONE = 4,
}

// Mock data for tasks
const MOCK_TASKS: Task[] = [
    {
        id: 1,
        title: "Research design patterns",
        description: "Look into MVC, MVVM and other architecture patterns",
        boardId: 1,
        columnId: TaskColumn.TODO,
        priority: "medium",
        createdAt: "2025-04-20T10:00:00Z",
        updatedAt: "2025-04-20T10:00:00Z",
    },
    {
        id: 2,
        title: "Set up CI/CD pipeline",
        description: "Configure GitHub Actions for automated testing and deployment",
        boardId: 2,
        columnId: TaskColumn.IN_PROGRESS,
        priority: "high",
        dueDate: "2025-04-30T00:00:00Z",
        createdAt: "2025-04-19T14:30:00Z",
        updatedAt: "2025-04-23T09:15:00Z",
    },
    {
        id: 3,
        title: "Write documentation",
        description: "Create comprehensive documentation for the API",
        boardId: 2,
        columnId: TaskColumn.BACKLOG,
        priority: "low",
        createdAt: "2025-04-22T11:45:00Z",
        updatedAt: "2025-04-22T11:45:00Z",
    },
    {
        id: 4,
        title: "Fix login bug",
        description: "Address issue with login form validation",
        boardId: 1,
        columnId: TaskColumn.DONE,
        priority: "high",
        createdAt: "2025-04-18T08:20:00Z",
        updatedAt: "2025-04-24T16:10:00Z",
        assignedTo: {
            id: 1,
            name: "John Doe",
            avatar: "https://i.pravatar.cc/150?u=1",
        },
    },
];

// API client for task-related operations
export const TaskAPI = {
    // Get all tasks for a board
    getTasks: async (boardId: number): Promise<Task[]> => {
        return new Promise(resolve => {
            setTimeout(() => {
                const tasks = MOCK_TASKS.filter(task => task.boardId === boardId);
                resolve(tasks);
            }, 500);
        });
    },

    // Get a single task by ID
    getTask: async (id: number): Promise<Task | undefined> => {
        return new Promise(resolve => {
            setTimeout(() => {
                const task = MOCK_TASKS.find(task => task.id === id);
                resolve(task);
            }, 300);
        });
    },

    // Create a new task
    createTask: async (task: Omit<Task, "id" | "createdAt" | "updatedAt">): Promise<Task> => {
        return new Promise(resolve => {
            setTimeout(() => {
                const now = new Date().toISOString();
                const newTask: Task = {
                    ...task,
                    id: Math.max(...MOCK_TASKS.map(t => t.id)) + 1,
                    createdAt: now,
                    updatedAt: now,
                };
                // In a real implementation, we would update the server
                resolve(newTask);
            }, 300);
        });
    },

    // Update an existing task
    updateTask: async (taskData: Partial<Task> & { id: number }): Promise<Task> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const existingTask = MOCK_TASKS.find(t => t.id === taskData.id);
                if (!existingTask) {
                    reject(new Error(`Task with ID ${taskData.id} not found`));
                    return;
                }

                const updatedTask: Task = {
                    ...existingTask,
                    ...taskData,
                    updatedAt: new Date().toISOString(),
                };

                // In a real implementation, we would update the server
                resolve(updatedTask);
            }, 300);
        });
    },

    // Move a task to a different column
    moveTask: async (taskId: number, columnId: number): Promise<Task> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const existingTask = MOCK_TASKS.find(t => t.id === taskId);
                if (!existingTask) {
                    reject(new Error(`Task with ID ${taskId} not found`));
                    return;
                }

                const updatedTask: Task = {
                    ...existingTask,
                    columnId,
                    updatedAt: new Date().toISOString(),
                };

                // In a real implementation, we would update the server
                resolve(updatedTask);
            }, 300);
        });
    },

    // Delete a task
    deleteTask: async (id: number): Promise<boolean> => {
        return new Promise(resolve => {
            setTimeout(() => {
                // In a real implementation, we would delete from the server
                resolve(true);
            }, 300);
        });
    },
};