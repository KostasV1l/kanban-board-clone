"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateList } from "@entities/list/hooks";

interface NewListColumnProps {
  boardId: string;
  currentLength: number; // To keep track of list order
}

export const NewListColumn = ({ boardId, currentLength }: NewListColumnProps) => {
  const [title, setTitle] = useState("");
  const [editing, setEditing] = useState(false);
  const createList = useCreateList();

  const handleCreate = () => {
    if (!title.trim()) return;

    createList.mutate(
      {
        name: title.trim(),
        board: boardId,
        order: currentLength,
      },
      {
        onSuccess: () => {
          setTitle("");
          setEditing(false);
        },
      }
    );
  };

  return (
    <div className="flex h-full min-w-[250px] flex-col rounded-lg border bg-card">
      <div className="p-3">
        {editing ? (
          <div className="space-y-2">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="List name"
              className="text-sm"
            />
            <Button size="sm" className="w-full" onClick={handleCreate}>
              Create
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            className="w-full justify-start text-sm cursor-pointer"
            onClick={() => setEditing(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add List
          </Button>
        )}
      </div>
    </div>
  );
};
