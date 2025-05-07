export const taskKeys = {
    all: ["tasks"] as const,
    lists: () => [...taskKeys.all, "list"] as const,
    list: (listId?: string | number) => [...taskKeys.lists(), listId] as const,
    detail: (id?: string | number) => [...taskKeys.all, "detail", id] as const,
    task: (id?: string | number) => [...taskKeys.all, "task", id] as const,
    board: (boardId?: string | number) => [...taskKeys.all, "board", boardId] as const,
};
