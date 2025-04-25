/**
 * TanStack Query keys for task-related data
 * Used for cache management and invalidation
 */
export const taskKeys = {
    all: ["tasks"] as const,
    lists: () => [...taskKeys.all, "list"] as const,
    list: (filters: { boardId?: number }) => [...taskKeys.lists(), { filters }] as const,
    details: () => [...taskKeys.all, "detail"] as const,
    detail: (id: number) => [...taskKeys.details(), id] as const,
};
