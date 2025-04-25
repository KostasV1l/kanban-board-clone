"use client";

import { useEffect, useState } from "react";
import { BoardAPI } from "./api";
import { Board } from "./types";

// Hook to fetch all boards with loading and error states
export const useBoardsList = () => {
    const [boards, setBoards] = useState<Board[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBoards = async () => {
            try {
                setLoading(true);
                const data = await BoardAPI.getBoards();
                setBoards(data);
                setError(null);
            } catch (err) {
                setError("Failed to fetch boards");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchBoards();
    }, []);

    // Function to add a new board
    const addBoard = async (board: Omit<Board, "id">) => {
        try {
            setLoading(true);
            const newBoard = await BoardAPI.createBoard(board);
            setBoards(prev => [...prev, newBoard]);
            return newBoard;
        } catch (err) {
            setError("Failed to create board");
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Function to update a board
    const updateBoard = async (board: Board) => {
        try {
            setLoading(true);
            const updatedBoard = await BoardAPI.updateBoard(board);
            setBoards(prev => prev.map(b => (b.id === board.id ? updatedBoard : b)));
            return updatedBoard;
        } catch (err) {
            setError("Failed to update board");
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Function to delete a board
    const deleteBoard = async (id: number) => {
        try {
            setLoading(true);
            await BoardAPI.deleteBoard(id);
            setBoards(prev => prev.filter(b => b.id !== id));
            return true;
        } catch (err) {
            setError("Failed to delete board");
            console.error(err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        boards,
        loading,
        error,
        addBoard,
        updateBoard,
        deleteBoard,
    };
};

// Hook to fetch a single board by ID
export const useBoardState = (id: number) => {
    const [board, setBoard] = useState<Board | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBoard = async () => {
            try {
                setLoading(true);
                const data = await BoardAPI.getBoard(id);
                setBoard(data || null);
                setError(null);
            } catch (err) {
                setError("Failed to fetch board");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchBoard();
    }, [id]);

    return { board, loading, error };
};
