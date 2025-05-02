import { ITask } from "../model";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CardOptionsButton } from "@features/task/ui/task-options";

interface TaskCardProps {
  task: ITask;
  onClick?: (task: ITask) => void;
}

export const TaskCard = ({ task, onClick }: TaskCardProps) => {
  // Get color based on priority
  const getPriorityColor = () => {
    switch (task.priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div 
      className="rounded-md border bg-card p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer relative group"
      onClick={() => onClick?.(task)}
    >
      <CardOptionsButton taskId={task.id} listId={task.listId} />
      
      <h3 className="font-medium text-sm">{task.title}</h3>
      
      {task.description && (
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
          {task.description}
        </p>
      )}
      
      <div className="flex items-center justify-between mt-2">
        <Badge
          variant="secondary"
          className={cn("text-xs", getPriorityColor())}
        >
          {task.priority}
        </Badge>
      </div>
    </div>
  );
}; 