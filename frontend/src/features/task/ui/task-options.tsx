import { Archive, Copy, Monitor, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteTask } from "@/entities/task/hooks/useDeleteTask";
import { cn } from "@/lib/utils";

interface CardOptionsButtonProps {
    taskId: string | number;
    listId: string;
    boardId: string;
    onOpenCard?: () => void;
}

export const CardOptionsButton = ({ taskId, listId, boardId, onOpenCard }: CardOptionsButtonProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const deleteTask = useDeleteTask();

    const handleMenuItemClick = (action: string) => {
        if (action === "delete") {
            deleteTask.mutate({ boardId: boardId, listId: listId, taskId: taskId.toString() });
        } else if (action === "open" && onOpenCard) {
            onOpenCard();
        }

        setIsOpen(false);
    };

    return (
        <div
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={e => e.stopPropagation()}
        >
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn("h-6 w-6 rounded-md hover:bg-accent/80", isOpen && "opacity-100 bg-accent/80")}
                    >
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-60" align="end">
                    <DropdownMenuLabel>Options</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={() => handleMenuItemClick("open")}>
                        <Monitor className="mr-2 h-4 w-4" />
                        Open card
                    </DropdownMenuItem>
                    <DropdownMenuItem variant="destructive" onClick={() => handleMenuItemClick("delete")}>
                        <Archive className="mr-2 h-4 w-4" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};
