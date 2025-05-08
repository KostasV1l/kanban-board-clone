import { ArrowRight, Crown, KanbanSquare, Trash2, UserSquare2 } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Board } from "@/entities/board/model/types";
import { useDeleteBoard } from "@/features/board/hooks";
import Link from "next/link";

interface BoardCardProps extends Board {
    onDelete?: (id: string) => void;
}

export const BoardCard = ({ id, name, description, color, tasksCount = 0, userRole, onDelete }: BoardCardProps) => {
    const deleteBoardMutation = useDeleteBoard();
    const isOwner = userRole === "OWNER";

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        deleteBoardMutation.mutate(id);
        if (onDelete) {
            onDelete(id);
        }
    };

    return (
        <div>
            <div className={`h-2 rounded-t-xl ${color}`}></div>
            <div className="flex flex-col justify-between min-h-32 bg-muted rounded-b-lg p-4 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-x-2">
                        <KanbanSquare className="inline size-5" />
                        <h3 className="text-xl font-bold font-primary">{name}</h3>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                {isOwner ? (
                                    <Badge
                                        variant="outline"
                                        className="ml-2 px-1.5 border-amber-500/50 bg-amber-500/10"
                                    >
                                        <Crown className="h-3 w-3 text-amber-500 mr-1" />
                                        <span className="text-xs text-amber-500">Owner</span>
                                    </Badge>
                                ) : (
                                    <Badge variant="outline" className="ml-2 px-1.5 border-blue-500/50 bg-blue-500/10">
                                        <UserSquare2 className="h-3 w-3 text-blue-500 mr-1" />
                                        <span className="text-xs text-blue-500">Member</span>
                                    </Badge>
                                )}
                            </TooltipTrigger>
                            <TooltipContent>
                                {isOwner ? "You own this board" : "You are a member of this board"}
                            </TooltipContent>
                        </Tooltip>
                    </div>

                    {isOwner && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-muted-foreground cursor-pointer hover:text-destructive hover:bg-destructive/10"
                                    disabled={deleteBoardMutation.isPending}
                                >
                                    <Trash2 className="size-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the board and remove
                                        all tasks associated with it from our database.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction className="bg-destructive hover:bg-destructive/80" asChild>
                                        <Button
                                            variant="destructive"
                                            onClick={handleDelete}
                                            disabled={deleteBoardMutation.isPending}
                                        >
                                            {deleteBoardMutation.isPending ? "Deleting..." : "Delete"}
                                        </Button>
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{description}</p>
                <p className="text-sm text-muted-foreground mt-1 mb-6">{tasksCount} tasks</p>
                <Link
                    href={`/board/${id}`}
                    title={`View board "${name}"`}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-xs font-semibold transition-colors hover:bg-accent/80   "
                >
                    <ArrowRight className="size-4" />
                    View Board
                </Link>
            </div>
        </div>
    );
};
    