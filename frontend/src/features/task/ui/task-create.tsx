import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateTask } from "@/entities/task/hooks/useCreateTask";
import { ITask, TaskPriority } from "@/entities/task/model";
import { Plus, X } from "lucide-react";

// Create a type for new task creation that omits the BaseEntity fields
type CreateTaskPayload = Omit<ITask, 'id' | 'createdAt' | 'updatedAt'>;

interface TaskCreateFormProps {
  listId: string;
  boardId: string;
  onCancel: () => void;
}

export const TaskCreateForm = ({ listId, boardId, onCancel }: TaskCreateFormProps) => {
  const [title, setTitle] = useState("");
  const createTask = useCreateTask();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    const newTask: CreateTaskPayload = {
      title: title.trim(),
      listId: listId,
      boardId: boardId,
      priority: "MEDIUM" as TaskPriority,
    };
    
    console.log("Submitting task:", newTask);
    
    createTask.mutate({ boardId: boardId, listId: listId, task: newTask as ITask });
    
    // Instead, reset form state here directly
    setTitle("");
    onCancel();
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Input
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        autoFocus
        className="w-full"
        required
      />
      <div className="flex justify-between gap-2">
        <Button 
          type="submit" 
          size="sm"
          disabled={createTask.isPending || !title.trim()}
        >
          {createTask.isPending ? (
            <span>Adding...</span>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-1" />
              Add
            </>
          )}
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm"
          onClick={onCancel}
        >
          <X className="h-4 w-4 mr-1" />
          Cancel
        </Button>
      </div>
    </form>
  );
};