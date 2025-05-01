import axiosInstance from "@shared/api/axios-instance";
import { CreateListDto, List, UpdateListDto } from "../model/types";

// Base API functions for list operations -> Used in Tanstack Query hooks
export const ListAPI = {
    // Get all lists for a board
    getLists: async (boardId: string): Promise<List[]> => {
        try {
          const { data } = await axiosInstance.get<List[]>("/lists", {
            params: { boardId },
          });
          return data;
        } catch (error) {
          console.error("Failed to fetch lists:", error);
          throw error;
        }
      },

    // Get a single list by ID
    getList: async (id: number, userId: string): Promise<List> => {
        try {
            // TODO: Change to actual API endpoint
            const res = await fetch(`/api/lists/${id}?userId=${userId}`);

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Failed to fetch list");
            }

            return res.json();
        } catch (error) {
            console.error("Failed to fetch list:", error);
            throw error;
        }
    },

    // Create a new list
    createList: async (data: CreateListDto, userId: string): Promise<List> => {
        try {
            // TODO: Change to actual API endpoint
            const res = await fetch(`/api/lists?userId=${userId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Failed to create list");
            }

            return res.json();
        } catch (error) {
            console.error("Failed to create list:", error);
            throw error;
        }
    },

    // Update a list
    updateList: async (id: number, data: UpdateListDto, userId: string): Promise<List> => {
        try {
            // TODO: Change to actual API endpoint
            const res = await fetch(`/api/lists/${id}?userId=${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Failed to update list");
            }

            return res.json();
        } catch (error) {
            console.error("Failed to update list:", error);
            throw error;
        }
    },

    // Delete a list
    deleteList: async (id: number, userId: string): Promise<void> => {
        try {
            // TODO: Change to actual API endpoint
            const res = await fetch(`/api/lists/${id}?userId=${userId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                },
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Failed to delete list");
            }
        } catch (error) {
            console.error("Failed to delete list:", error);
            throw error;
        }
    },

    // Reorder lists within a board
    reorderLists: async (boardId: number, listIds: number[], userId: string): Promise<List[]> => {
        try {
            // TODO: Change to actual API endpoint
            const res = await fetch(`/api/boards/${boardId}/lists/reorder?userId=${userId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                },
                body: JSON.stringify({ listIds }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Failed to reorder lists");
            }

            return res.json();
        } catch (error) {
            console.error("Failed to reorder lists:", error);
            throw error;
        }
    },
};
