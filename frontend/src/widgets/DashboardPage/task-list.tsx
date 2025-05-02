import { ITask } from "@/entities/task/model";
import { TaskCard } from "@/entities/task/ui";

interface TaskListProps {
  tasks: ITask[];
  onTaskClick?: (task: ITask) => void;
}

export const TaskList = ({ tasks, onTaskClick }: TaskListProps) => {
  if (!tasks.length) {
    return (
      <div className="flex justify-center items-center py-4 text-sm text-muted-foreground">
        No tasks yet
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskCard 
          key={task.id} 
          task={task} 
          onClick={onTaskClick}
        />
      ))}
    </div>
  );
};
