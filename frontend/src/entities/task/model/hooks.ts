import { useState, useEffect } from "react";
import { TaskAPI } from "./api";
import { Task } from "./types";

// Hook to fetch all tasks for a board with loading and error states
export const useBoardTasksList = (boardId: number) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!boardId) {
            setTasks([]);
            setLoading(false);
            return;
        }

        const fetchTasks = async () => {
            try {
                setLoading(true);
                const data = await TaskAPI.getTasks(boardId);
                setTasks(data);
                setError(null);
            } catch (err) {
                setError("Failed to fetch tasks");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [boardId]);

    // Function to add a new task
    const addTask = async (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
        try {
            setLoading(true);
            const newTask = await TaskAPI.createTask(task);
            setTasks(prev => [...prev, newTask]);
            return newTask;
        } catch (err) {
            setError("Failed to create task");
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Function to update a task
    const updateTask = async (taskData: Partial<Task> & { id: number }) => {
        try {
            setLoading(true);
            const updatedTask = await TaskAPI.updateTask(taskData);
            setTasks(prev => prev.map(t => (t.id === taskData.id ? updatedTask : t)));
            return updatedTask;
        } catch (err) {
            setError("Failed to update task");
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Function to move a task to a different column
    const moveTask = async (taskId: number, columnId: number) => {
        try {
            setLoading(true);
            const updatedTask = await TaskAPI.moveTask(taskId, columnId);
            setTasks(prev => prev.map(t => (t.id === taskId ? updatedTask : t)));
            return updatedTask;
        } catch (err) {
            setError("Failed to move task");
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Function to delete a task
    const deleteTask = async (id: number) => {
        try {
            setLoading(true);
            await TaskAPI.deleteTask(id);
            setTasks(prev => prev.filter(t => t.id !== id));
            return true;
        } catch (err) {
            setError("Failed to delete task");
            console.error(err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        tasks,
        loading,
        error,
        addTask,
        updateTask,
        moveTask,
        deleteTask,
    };
};

// Hook to fetch a single task by ID
export const useTaskDetails = (id: number) => {
    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) {
            setTask(null);
            setLoading(false);
            return;
        }

        const fetchTask = async () => {
            try {
                setLoading(true);
                const data = await TaskAPI.getTask(id);
                setTask(data || null);
                setError(null);
            } catch (err) {
                setError("Failed to fetch task");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTask();
    }, [id]);

    return { task, loading, error };
};
