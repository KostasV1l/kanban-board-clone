"use client";

import { Plus, Trash } from "lucide-react";
import { useState } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { List } from "@/entities/list/model";
import { ITask } from "@/entities/task/model";
import { TaskDetailDialog } from "@/widgets/TaskDetailDialog";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDeleteList, useUpdateList } from "@entities/list/hooks";
import { useGetTasksByList } from "@entities/task";
import { TaskCreateForm } from "@features/task";
import { TaskList } from "./task-list";

interface ListColumnProps {
    list: List;
}

export const ListColumn = ({ list }: ListColumnProps) => {
    const { mutate: deleteList, isPending: isDeleting } = useDeleteList();
    const { mutate: updateList } = useUpdateList();

    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: list.id });
    const style = { transform: CSS.Transform.toString(transform), transition };

    const [isEditing, setIsEditing] = useState(false);
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [name, setName] = useState(list.name);
    const { data: tasks = [], isLoading } = useGetTasksByList(list.boardId, list.id);

    // State for the task detail dialog
    const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
    const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);

    const handleTaskClick = (task: ITask) => {
        setSelectedTask(task);
        setIsTaskDetailOpen(true);
    };

    const handleCloseTaskDetail = () => {
        setIsTaskDetailOpen(false);
    };

    const handleDelete = () => {
        deleteList({ boardId: list.boardId, listId: list.id });
    };

    const handleNameUpdate = () => {
        if (name.trim() && name !== list.name) {
            updateList({ boardId: list.boardId, listId: list.id, data: { name } });
        }
        setIsEditing(false);
    };

    return (
        <div style={style} ref={setNodeRef} className="flex h-full min-w-[250px] flex-col rounded-lg border bg-card">
            <div className="flex items-center justify-between border-b p-3 gap-2">
                <div
                    className="flex-1 cursor-grab active:cursor-grabbing"
                    {...listeners}
                    {...attributes}
                    title="Drag to reorder"
                >
                    {isEditing ? (
                        <Input
                            value={name}
                            onChange={e => setName(e.target.value)}
                            onBlur={handleNameUpdate}
                            onKeyDown={e => e.key === "Enter" && handleNameUpdate()}
                            className="text-sm"
                            autoFocus
                            onClick={e => e.stopPropagation()}
                        />
                    ) : (
                        <h3
                            className="font-medium text-sm cursor-pointer"
                            onClick={() => setIsEditing(true)}
                            title="Click to edit name"
                            onMouseDown={e => e.stopPropagation()}
                        >
                            {list.name}
                        </h3>
                    )}
                </div>
                <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium">{list.tasksCount}</span>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            disabled={isDeleting}
                        >
                            <Trash className="h-4 w-4" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will permanently delete the list and its tasks. This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction asChild>
                                <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                                    {isDeleting ? "Deleting..." : "Delete"}
                                </Button>
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>

            <div className="flex-1 overflow-auto p-3">
                {isLoading ? (
                    <div className="flex justify-center items-center py-4">
                        <span className="text-sm text-muted-foreground">Loading tasks...</span>
                    </div>
                ) : (
                    <TaskList tasks={tasks} onTaskClick={handleTaskClick} />
                )}
            </div>

            <div className="border-t p-3">
                {isAddingTask ? (
                    <TaskCreateForm listId={list.id} boardId={list.boardId} onCancel={() => setIsAddingTask(false)} />
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

            {/* Task Detail Dialog */}
            <TaskDetailDialog task={selectedTask} isOpen={isTaskDetailOpen} onClose={handleCloseTaskDetail} />
        </div>
    );
};
