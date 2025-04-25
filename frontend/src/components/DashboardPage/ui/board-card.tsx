import { ArrowRight, KanbanSquare, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDeleteBoard } from "@/entities/board/model/queries";
import { Board } from "@/entities/board/model/types";
import Link from "next/link";

interface BoardCardProps extends Board {
    onDelete?: (id: number) => void;
}

export const BoardCard = ({ id, name, description, color, tasksCount = 0, onDelete }: BoardCardProps) => {
    const deleteBoardMutation = useDeleteBoard();

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        deleteBoardMutation.mutate(id);
    };

    return (
        <div>
            <div className={`h-2 rounded-t-xl ${color}`}></div>
            <div className="flex flex-col justify-between min-h-32 bg-muted rounded-b-lg p-4 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-x-2">
                        <KanbanSquare className="inline size-5" />
                        <h3 className="text-xl font-bold font-primary">{name}</h3>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={handleDelete}
                        disabled={deleteBoardMutation.isPending}
                    >
                        <Trash2 className="size-4" />
                    </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{description}</p>
                <p className="text-sm text-muted-foreground mt-1 mb-6">{tasksCount} tasks</p>
                <Link className="w-full cursor-pointer" href="/board/[id]" as={`/board/${id}`}>
                    <Button variant="outline" className="w-full text-xs font-semibold cursor-pointer">
                        <ArrowRight className="inline size-4" />
                        View Board
                    </Button>
                </Link>
            </div>
        </div>
    );
};
