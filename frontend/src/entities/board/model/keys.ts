/**
 * TanStack Query keys for board-related data
 * Used for cache management and invalidation
 */
export const boardKeys = {
    all: ["boards"] as const,
    lists: () => [...boardKeys.all, "list"] as const,
    list: (filters: string) => [...boardKeys.lists(), { filters }] as const,
    details: () => [...boardKeys.all, "detail"] as const,
    detail: (id: number) => [...boardKeys.details(), id] as const,
};
