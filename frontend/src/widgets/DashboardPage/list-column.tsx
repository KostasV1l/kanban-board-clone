"use client";

import { useState } from "react";
import { Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { List } from "@/entities/list/model";
import { useDeleteList } from "@entities/list/hooks";
import { TaskList } from "./task-list";
import { useGetTasksByList } from "@/entities/task/hooks/useGetTasksByList";
import { TaskCreateForm } from "@features/task/ui/task-create"; 

interface ListColumnProps {
    list: List;
}

export const ListColumn = ({ list }: ListColumnProps) => {
    const deleteList = useDeleteList();
    const { data: tasks = [], isLoading } = useGetTasksByList(list.id);
    const [isAddingTask, setIsAddingTask] = useState(false);

    const handleDelete = () => {
        const confirmed = confirm(`Are you sure you want to delete "${list.name}"?`);
        if (confirmed) {
            deleteList.mutate(list.id);
        }
    };

    return (
        <div className="flex h-full min-w-[250px] flex-col rounded-lg border bg-card">
            <div className="flex items-center justify-between border-b p-3">
                <h3 className="font-medium">{list.name}</h3>
                <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium">{list.tasksCount}</span>
                <button className="cursor-pointer" onClick={handleDelete}>
                    <Trash className="h-4 w-4 text-muted-foreground hover:text-red-500 transition" />
                </button>
            </div>

            <div className="flex-1 overflow-auto p-3">
                {isLoading ? (
                    <div className="flex justify-center items-center py-4">
                        <span className="text-sm text-muted-foreground">Loading tasks...</span>
                    </div>
                ) : (
                    <TaskList tasks={tasks} />
                )}
            </div>

            <div className="border-t p-3">
                {isAddingTask ? (
                    <TaskCreateForm 
                        listId={list.id}
                        boardId={list.board}
                        onCancel={() => setIsAddingTask(false)}
                    />
                ) : (
                    <Button 
                        variant="ghost" 
                        className="w-full justify-start" 
                        size="sm"
                        onClick={() => setIsAddingTask(true)}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Task
                    </Button>
                )}
            </div>
        </div>
    );
};
