export const memberKeys = {
    all: ["members"] as const,
    boards: () => [...memberKeys.all, "boards"] as const,
    board: (boardId: string) => [...memberKeys.boards(), boardId] as const,
    members: (boardId: string) => [...memberKeys.all, "list", boardId] as const,
};
