"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { List } from "@/entities/list/model";

interface ListColumnProps {
    list: List;
}

export const ListColumn = ({ list }: ListColumnProps) => {
    return (
        <div className="flex h-full min-w-[250px] flex-col rounded-lg border bg-card">
            <div className="flex items-center justify-between border-b p-3">
                <h3 className="font-medium">{list.name}</h3>
                <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium">{list.tasksCount}</span>
            </div>

            <div className="flex-1 overflow-auto p-3">
                {/* <div className="space-y-3">
          {list.task.map((task) => (
            <Task key={task.id} task={task} onDragStart={(e) => onDragStart(e, task.id, column.id)} />
          ))}
        </div> */}
            </div>

            <div className="border-t p-3">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Task
                </Button>
            </div>
        </div>
    );
};
