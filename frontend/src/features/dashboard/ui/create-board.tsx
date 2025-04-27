import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useCreateBoard } from "@/features/board/hooks";

const BOARD_COLORS = [
    { label: "Blue", value: "bg-blue-600" },
    { label: "Green", value: "bg-green-600" },
    { label: "Red", value: "bg-red-600" },
    { label: "Yellow", value: "bg-yellow-600" },
    { label: "Purple", value: "bg-purple-600" },
    { label: "Pink", value: "bg-pink-600" },
    { label: "Indigo", value: "bg-indigo-600" },
];

export const CreateBoard = () => {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [color, setColor] = useState("bg-blue-600");

    const createBoard = useCreateBoard();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createBoard.mutateAsync({
                name,
                description,
                color,
            });

            // Reset form and close sheet
            setName("");
            setDescription("");
            setColor("bg-blue-600");
            setOpen(false);
        } catch (error) {
            console.error("Failed to create board:", error);
        }
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button>
                    <Plus className="me-0.5 size" />
                    New Board
                </Button>
            </SheetTrigger>
            <SheetContent className="px-4 bg-muted" side="right">
                <form onSubmit={handleSubmit}>
                    <SheetHeader className="px-0">
                        <SheetTitle>
                            <Plus className="inline me-2 size-4" />
                            Create New Board
                        </SheetTitle>
                    </SheetHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                placeholder="Enter board name"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                placeholder="Enter board description"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Color</Label>
                            <div className="flex flex-wrap gap-2 mt-4">
                                {BOARD_COLORS.map(boardColor => (
                                    <div
                                        key={boardColor.value}
                                        className={`w-8 h-8 rounded-full cursor-pointer transition-all ${boardColor.value} ${
                                            color === boardColor.value ? "ring-2 ring-offset-2 ring-primary" : ""
                                        }`}
                                        onClick={() => setColor(boardColor.value)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    <SheetFooter className="!px-0">
                        <Button type="submit" disabled={createBoard.isPending || !name.trim()}>
                            {createBoard.isPending ? "Creating..." : "Create Board"}
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
};
