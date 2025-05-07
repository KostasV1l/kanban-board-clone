import { AlertCircle, Calendar, Check, Clock, MessageSquare, UserCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useGetList } from "@/entities/list/hooks";
import { useGetMembers } from "@/entities/member/hooks";
import { IMember } from "@/entities/member/model";
import { useDeleteTask } from "@/entities/task/hooks/useDeleteTask";
import { useUpdateTask } from "@/entities/task/hooks/useUpdateTask";
import { ITask, TaskPriority } from "@/entities/task/model";
import { useTaskRealtime } from "@/features/realtime/hooks";
import { cn } from "@/lib/utils";

interface TaskDetailDialogProps {
    task: ITask | null;
    isOpen: boolean;
    onClose: () => void;
}

export const TaskDetailDialog = ({ task, isOpen, onClose }: TaskDetailDialogProps) => {
    const [title, setTitle] = useState(task?.title || "");
    const [description, setDescription] = useState(task?.description || "");
    const [priority, setPriority] = useState<TaskPriority>(task?.priority || "MEDIUM");
    const [assignedMemberId, setAssignedMemberId] = useState<string | undefined>(task?.assignedTo ?? undefined);
    const [isEditing, setIsEditing] = useState(false);

    // Fetch board members
    const {
        data: members = [],
        isLoading: membersLoading,
        refetch: refetchMembers,
    } = useGetMembers(task?.boardId || "");

    // Fetch list details to get the list name
    const { data: listData, refetch: refetchList } = useGetList(task?.boardId || "", task?.listId || "");

    const updateTask = useUpdateTask();
    const deleteTask = useDeleteTask();

    // Use our task realtime hook to handle real-time task updates
    useTaskRealtime(
        task?.id || "",
        () => {
            // When task is updated, refetch list to get updated task
            refetchList();
        },
        () => {
            // When comments change, refetch members (which would typically include comment data)
            refetchMembers();
        },
    );

    // Reset form state when task changes
    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description || "");
            setPriority(task.priority);
            setAssignedMemberId(task.assignedTo ?? undefined);
        }
    }, [task]);

    // Reset edit mode when dialog closes
    useEffect(() => {
        if (!isOpen) {
            setIsEditing(false);
        }
    }, [isOpen]);

    const handleUpdateTask = () => {
        if (!task || !title.trim()) return;

        // Handle the unassigned case by explicitly setting to null
        // In MongoDB, undefined fields in updates are ignored, but null will remove the assigned user
        const assignedToValue = assignedMemberId === "unassigned" ? null : assignedMemberId;

        updateTask.mutate(
            {
                boardId: task.boardId,
                listId: task.listId,
                taskId: task.id.toString(),
                data: {
                    title: title.trim(),
                    description: description.trim() || undefined,
                    priority,
                    assignedTo: assignedToValue, // Send null to explicitly unassign
                },
            },
            {
                onSuccess: updatedTask => {
                    setIsEditing(false);
                },
            },
        );
    };

    const handleDeleteTask = () => {
        if (!task) return;

        deleteTask.mutate(
            {
                boardId: task.boardId,
                listId: task.listId,
                taskId: task.id.toString(),
            },
            {
                onSuccess: () => {
                    onClose();
                },
            },
        );
    };

    // Get the assigned member object
    const getAssignedMember = (): IMember | undefined => {
        if (!assignedMemberId || assignedMemberId === "unassigned") return undefined;
        return members.find(member => member.user?.id === assignedMemberId);
    };

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

    // Get color based on priority
    const getPriorityColor = (p: TaskPriority) => {
        switch (p) {
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

    if (!task) return null;

    const assignedMember = getAssignedMember();

    return (
        <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
            <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
                <DialogHeader className="pb-4 border-b">
                    <DialogTitle className="flex justify-between items-center">
                        {isEditing ? (
                            <Input
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                className="text-lg font-bold"
                                placeholder="Task title"
                                autoFocus
                                aria-label="Task title"
                            />
                        ) : (
                            <span className="text-lg font-bold">{task.title}</span>
                        )}
                        <Badge variant="secondary" className={cn("ml-2 py-1 px-2", getPriorityColor(priority))}>
                            {priority}
                        </Badge>
                    </DialogTitle>
                    <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <span>in list</span>
                        <span className="font-medium text-foreground">{listData?.name || "Loading..."}</span>
                    </div>
                </DialogHeader>

                <Tabs defaultValue="details" className="mt-4">
                    <TabsList className="w-full grid grid-cols-2">
                        <TabsTrigger value="details" className="rounded-md">
                            Details
                        </TabsTrigger>
                        <TabsTrigger value="activity" className="rounded-md">
                            Activity
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="details" className="space-y-6 mt-6 px-1">
                        {isEditing ? (
                            <>
                                <div className="space-y-3">
                                    <Label htmlFor="description" className="text-sm font-medium">
                                        Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                        placeholder="Add a more detailed description..."
                                        className="min-h-[120px] resize-y"
                                        aria-label="Task description"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="assignee" className="text-sm font-medium">
                                        Assignee
                                    </Label>
                                    <Select
                                        value={assignedMemberId || "unassigned"}
                                        onValueChange={setAssignedMemberId}
                                    >
                                        <SelectTrigger id="assignee" className="w-full">
                                            <SelectValue placeholder="Unassigned" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="unassigned">
                                                <div className="flex items-center gap-2">
                                                    <UserCircle2 className="h-4 w-4 text-muted-foreground" />
                                                    <span>Unassigned</span>
                                                </div>
                                            </SelectItem>
                                            {members.map(member => (
                                                <SelectItem key={member.user?.id} value={member.user?.id || ""}>
                                                    <div className="flex items-center gap-2">
                                                        <Avatar className="h-5 w-5">
                                                            <AvatarImage
                                                                src={
                                                                    member.user?.username
                                                                        ? `https://avatar.vercel.sh/${member.user.username}`
                                                                        : undefined
                                                                }
                                                                alt={member.user?.username || "Member"}
                                                            />
                                                            <AvatarFallback className="text-xs">
                                                                {getInitials(member.user?.username)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <span>{member.user?.username}</span>
                                                        <span className="text-xs text-muted-foreground ml-1">
                                                            ({member.role})
                                                        </span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="priority" className="text-sm font-medium">
                                        Priority
                                    </Label>
                                    <Select
                                        value={priority}
                                        onValueChange={value => setPriority(value as TaskPriority)}
                                    >
                                        <SelectTrigger id="priority" className="w-full">
                                            <SelectValue placeholder="Select priority" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="HIGH" className="text-red-600 dark:text-red-400">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-red-600 dark:bg-red-400"></div>
                                                    High
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="MEDIUM" className="text-yellow-600 dark:text-yellow-400">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-yellow-600 dark:bg-yellow-400"></div>
                                                    Medium
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="LOW" className="text-green-600 dark:text-green-400">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-green-600 dark:bg-green-400"></div>
                                                    Low
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <h3 className="text-sm font-medium">Description</h3>
                                        {!description && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="ml-2 h-7 text-xs text-muted-foreground hover:text-foreground"
                                                onClick={() => setIsEditing(true)}
                                            >
                                                Add
                                            </Button>
                                        )}
                                    </div>
                                    {description ? (
                                        <div className="text-sm text-muted-foreground whitespace-pre-line p-4 bg-muted/40 rounded-md border">
                                            {description}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground italic">No description provided</p>
                                    )}
                                </div>

                                <div className="p-4 border rounded-md space-y-4 bg-card/50">
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-medium flex items-center gap-2">
                                            <UserCircle2 className="h-4 w-4 text-primary" />
                                            Assigned To
                                        </h3>
                                        {assignedMember ? (
                                            <div className="flex items-center gap-3 mt-2 p-2 bg-background rounded-md border">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage
                                                        src={
                                                            assignedMember.user?.username
                                                                ? `https://avatar.vercel.sh/${assignedMember.user.username}`
                                                                : undefined
                                                        }
                                                        alt={assignedMember.user?.username || "Member"}
                                                    />
                                                    <AvatarFallback className="text-xs">
                                                        {getInitials(assignedMember.user?.username)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="text-sm font-medium">
                                                        {assignedMember.user?.username}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {assignedMember.role}
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center text-sm text-muted-foreground mt-1 p-2 bg-background rounded-md border">
                                                <UserCircle2 className="mr-2 h-4 w-4" />
                                                <span>Unassigned</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                                        <div>
                                            <h3 className="text-xs font-medium uppercase text-muted-foreground mb-1">
                                                Created
                                            </h3>
                                            <div className="flex items-center text-sm">
                                                <Calendar className="mr-2 h-4 w-4 text-primary" />
                                                {new Date(task.createdAt).toLocaleDateString(undefined, {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </div>
                                        </div>

                                        {task.updatedAt && (
                                            <div>
                                                <h3 className="text-xs font-medium uppercase text-muted-foreground mb-1">
                                                    Last Updated
                                                </h3>
                                                <div className="flex items-center text-sm">
                                                    <Clock className="mr-2 h-4 w-4 text-primary" />
                                                    {new Date(task.updatedAt).toLocaleDateString(undefined, {
                                                        year: "numeric",
                                                        month: "short",
                                                        day: "numeric",
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </TabsContent>

                    <TabsContent value="activity" className="space-y-4 mt-6">
                        <div className="rounded-md border p-6 bg-muted/30 flex flex-col items-center justify-center text-center space-y-2">
                            <MessageSquare className="h-10 w-10 text-muted-foreground/60" />
                            <h3 className="font-medium text-sm">Activity Log</h3>
                            <p className="text-sm text-muted-foreground">
                                Updates and comments for this task will appear here
                            </p>
                        </div>
                    </TabsContent>
                </Tabs>

                {updateTask.isError && (
                    <Alert variant="destructive" className="my-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>Failed to update task. Please try again.</AlertDescription>
                    </Alert>
                )}

                <DialogFooter className="gap-2 flex-wrap sm:flex-nowrap mt-6 pt-4 border-t">
                    {isEditing ? (
                        <>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setIsEditing(false);
                                    setTitle(task.title);
                                    setDescription(task.description || "");
                                    setPriority(task.priority);
                                    setAssignedMemberId(task.assignedTo ?? undefined);
                                }}
                                className="w-full sm:w-auto"
                                aria-label="Cancel editing"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleUpdateTask}
                                disabled={updateTask.isPending || !title.trim()}
                                className="w-full sm:w-auto"
                                aria-label="Save changes"
                            >
                                {updateTask.isPending ? (
                                    <span className="flex items-center gap-1">
                                        <span className="size-4 border-2 border-foreground/10 border-t-foreground/80 rounded-full animate-spin"></span>
                                        Saving...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1">
                                        <Check className="h-4 w-4" />
                                        Save Changes
                                    </span>
                                )}
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                variant="outline"
                                onClick={() => setIsEditing(true)}
                                className="w-full sm:w-auto"
                                aria-label="Edit task"
                            >
                                Edit
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDeleteTask}
                                disabled={deleteTask.isPending}
                                className="w-full sm:w-auto"
                                aria-label="Delete task"
                            >
                                {deleteTask.isPending ? (
                                    <span className="flex items-center gap-1">
                                        <span className="size-4 border-2 border-destructive-foreground/10 border-t-destructive-foreground/80 rounded-full animate-spin"></span>
                                        Deleting...
                                    </span>
                                ) : (
                                    "Delete Task"
                                )}
                            </Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
