import { useMutation } from "@tanstack/react-query";
import { List, ListAPI, listKeys } from "../model";
import { queryClient } from "@shared/api/query-client";

// Reorder lists
export const useReorderLists = () => {
    return useMutation({
        mutationFn: ({ boardId, listUpdates }: { boardId: string; listUpdates: { id: string; order: number }[] }) =>
            ListAPI.reorderLists(boardId, listUpdates),
        onSuccess: (updatedLists, { boardId, listUpdates }) => {
            queryClient.setQueryData(listKeys.boardLists(boardId), (old: List[] | undefined) => {
              if (!old) return [];
          
              // Merge new orders
              return old.map(list => {
                const found = listUpdates.find(update => update.id === list.id);
                return found ? { ...list, order: found.order } : list;
              }).sort((a, b) => a.order - b.order);
            });
          }
    });
};
