"use client";

import { useEffect, useState } from "react";
import { Board } from "@/entities/board/model";
import { BoardAPI } from "@features/board/api";

// Hook to fetch a single board by ID
export const useBoardState = (id: string) => {
    const [board, setBoard] = useState<Board | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBoard = async () => {
            if (!id) {
                setLoading(false);
                return;
            }

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
