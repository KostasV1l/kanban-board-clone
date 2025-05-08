import { AlertCircle, AlertTriangle, Info } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useGetMembers } from "@/entities/member/hooks";
import { cn } from "@/lib/utils";
import { CardOptionsButton } from "@features/task/ui/task-options";
import { ITask } from "../model";

interface TaskCardProps {
    task: ITask;
    onClick?: (task: ITask) => void;
}

export const TaskCard = ({ task, onClick }: TaskCardProps) => {
    // Fetch board members to get assignee details
    const { data: members = [] } = useGetMembers(task.boardId);

    // Get color based on priority
    const getPriorityColor = () => {
        switch (task.priority) {
            case "HIGH":
                return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200";
            case "MEDIUM":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200";
            case "LOW":
                return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200";
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
        }
    };

    // Find assigned member from the members list
    const assignedMember = task.assignedTo ? members.find(member => member.user?.id === task.assignedTo) : null;

    // Generate initials from name
    const getInitials = (name?: string): string => {
        if (!name) return "?";
        return name
            .split(" ")
            .map(part => part[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);
    };

    return (
        <div
            className="rounded-md border bg-card p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer relative group"
            onClick={() => onClick?.(task)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    onClick?.(task);
                }
            }}
            tabIndex={0}
            role="button"
            aria-label={`Task: ${task.title}`}
        >
            <CardOptionsButton
                taskId={task.id}
                listId={task.listId}
                boardId={task.boardId}
                onOpenCard={() => onClick?.(task)}
            />

            <h3 className="font-medium text-sm pr-1">{task.title}</h3>

            {task.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{task.description}</p>}

            <div className="flex items-center justify-between mt-2">
                <Badge variant="secondary" className={cn("text-xs flex items-center gap-1", getPriorityColor())}>
                    {task.priority === "HIGH" && <AlertTriangle className="h-3 w-3" aria-hidden="true" />}
                    {task.priority === "MEDIUM" && <AlertCircle className="h-3 w-3" aria-hidden="true" />}
                    {task.priority === "LOW" && <Info className="h-3 w-3" aria-hidden="true" />}
                    {task.priority}
                    <span className="sr-only">priority</span>
                </Badge>
                {assignedMember && assignedMember.user && (
                    <Avatar className="h-6 w-6 ml-2" title={`Assigned to: ${assignedMember.user.username}`}>
                        <AvatarImage
                            src={
                                assignedMember.user.username
                                    ? `https://avatar.vercel.sh/${assignedMember.user.username}`
                                    : undefined
                            }
                            alt={assignedMember.user.username || "Assigned user"}
                        />
                        <AvatarFallback className="text-xs">{getInitials(assignedMember.user.username)}</AvatarFallback>
                    </Avatar>
                )}
            </div>
        </div>
    );
};
