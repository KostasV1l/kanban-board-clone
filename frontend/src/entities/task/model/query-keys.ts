export const taskKeys = {
    all: ["tasks"] as const,
    lists: () => [...taskKeys.all, "list"] as const,
    list: (listId?: string | number) => [...taskKeys.lists(), listId] as const,
    detail: (id?: string | number) => [...taskKeys.all, "detail", id] as const,
};
