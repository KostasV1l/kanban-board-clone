"use client";

import { useState } from "react";
import { Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { List } from "@/entities/list/model";
import { useDeleteList } from "@entities/list/hooks";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"; // Adjust path if needed

interface ListColumnProps {
  list: List;
}

export const ListColumn = ({ list }: ListColumnProps) => {
  const deleteListMutation = useDeleteList(list.board);

  const handleDelete = () => {
    deleteListMutation.mutate(list.id);
  };

  return (
    <div className="flex h-full min-w-[250px] flex-col rounded-lg border bg-card">
      <div className="flex items-center justify-between border-b p-3">
        <h3 className="font-medium">{list.name}</h3>
        <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium">
          {list.tasksCount}
        </span>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              disabled={deleteListMutation.isPending}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the list and its tasks. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleteListMutation.isPending}
                >
                  {deleteListMutation.isPending ? "Deleting..." : "Delete"}
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="flex-1 overflow-auto p-3">{/* Tasks will go here */}</div>

      <div className="border-t p-3">
        <Button variant="ghost" className="w-full justify-start" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>
    </div>
  );
};
