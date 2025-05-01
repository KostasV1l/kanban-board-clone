/**
 * TanStack Query keys for lists
 * Helps with cache invalidation and consistent key structure
 */
export const listKeys = {
    all: ["lists"] as const,
    lists: () => [...listKeys.all, "list"] as const,
    list: (id: string) => [...listKeys.lists(), id] as const,
    boardLists: (boardId: string) => [...listKeys.lists(), "board", boardId] as const,
};
