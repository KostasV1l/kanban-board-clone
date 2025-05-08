"use client";

import { Plus, X } from "lucide-react";
import { useState, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateList } from "@entities/list/hooks";

interface NewListColumnProps {
    boardId: string;
    currentLength: number; 
}

export const NewListColumn = ({ boardId, currentLength }: NewListColumnProps) => {
    const [title, setTitle] = useState("");
    const [editing, setEditing] = useState(false);
    const { mutate: createList, isPending: isCreating } = useCreateList();

    const handleCreate = () => {
        if (!title.trim()) return;

        createList(
            {
                boardId,
                data: {
                    name: title.trim(),
                    order: currentLength,
                },
            },
            {
                onSuccess: () => {
                    setTitle("");
                    setEditing(false);
                },
            },
        );
    };

    const handleCancel = () => {
        setTitle("");
        setEditing(false);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Escape") {
            handleCancel();
        } else if (e.key === "Enter") {
            handleCreate();
        }
    };

    return (
        <div className="flex h-full min-w-[250px] flex-col rounded-lg border bg-card">
            <div className="p-3">
                {editing ? (
                    <form 
                        className="space-y-2" 
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleCreate();
                        }}
                    >
                        <Input
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="List name"
                            className="text-sm"
                            aria-label="New list name"
                            autoFocus
                            required
                        />
                        <div className="flex gap-2">
                            <Button 
                                type="submit" 
                                size="sm" 
                                className="flex-1" 
                                disabled={isCreating || !title.trim()}
                            >
                                {isCreating ? "Creating..." : "Create"}
                            </Button>
                            <Button 
                                type="button" 
                                variant="outline" 
                                size="sm" 
                                onClick={handleCancel}
                                aria-label="Cancel adding new list"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </form>
                ) : (
                    <Button 
                        variant="ghost" 
                        className="w-full justify-start text-sm cursor-pointer"
                        onClick={() => setEditing(true)}
                        aria-label="Add new list"
                    >
                        <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
                        Add List
                    </Button>
                )}
            </div>
        </div>
    );
};
