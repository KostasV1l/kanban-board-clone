import { FolderKanban } from "lucide-react";
import { CreateBoard } from "../../features/dashboard/create-board";

export const BoardHeader = () => {
    return (
        <div className="flex items-center justify-between font-primary mb-1 bg-muted rounded-lg py-4 px-3 shadow-sm">
            <h2 className="font-bold text-xl flex items-center">
                <FolderKanban className="inline size-5 me-2" />
                Your Boards
            </h2>
            <CreateBoard />
        </div>
    );
};
