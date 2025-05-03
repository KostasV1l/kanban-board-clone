import { Archive, Copy, Monitor, MoreHorizontal, Move, Palette, Tag, Users } from "lucide-react";
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
    taskId: number;
    listId: string;
}

export const CardOptionsButton = ({ taskId, listId }: CardOptionsButtonProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const deleteTask = useDeleteTask();

    const handleMenuItemClick = (action: string) => {
        // Handle different menu item actions
        console.log(`Action ${action} for task ${taskId} in list ${listId}`);

        if (action === "delete") {
            deleteTask.mutate(taskId.toString());
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
                    <DropdownMenuLabel>Card Options</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={() => handleMenuItemClick("open")}>
                        <Monitor className="mr-2 h-4 w-4" />
                        Open card
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => handleMenuItemClick("edit_labels")}>
                        <Tag className="mr-2 h-4 w-4" />
                        Edit labels
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => handleMenuItemClick("change_members")}>
                        <Users className="mr-2 h-4 w-4" />
                        Change members
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => handleMenuItemClick("change_cover")}>
                        <Palette className="mr-2 h-4 w-4" />
                        Change color
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={() => handleMenuItemClick("move")}>
                        <Move className="mr-2 h-4 w-4" />
                        Move
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => handleMenuItemClick("copy")}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy card
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem variant="destructive" onClick={() => handleMenuItemClick("delete")}>
                        <Archive className="mr-2 h-4 w-4" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};
