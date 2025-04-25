// Import specific components from the list entity
import {
    CreateListDto,
    List,
    ListAPI,
    UpdateListDto,
    useCreateList,
    useDeleteList,
    useGetList,
    useGetLists,
    useListReordering,
    useReorderLists,
    useUpdateList,
} from "@/entities/list/model";

// Re-export the types that should be publicly available
export type { List, CreateListDto, UpdateListDto };

// Provide a clean public API for list operations
export const listApi = {
    // List CRUD operations
    getLists: ListAPI.getLists,
    getList: ListAPI.getList,
    createList: ListAPI.createList,
    updateList: ListAPI.updateList,
    deleteList: ListAPI.deleteList,
    reorderLists: ListAPI.reorderLists,
};

// Re-export hooks for use in features and pages
export { useGetList, useGetLists, useCreateList, useUpdateList, useDeleteList, useReorderLists, useListReordering };
