"use client";

import { Wifi, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRealtime } from "../providers";

/**
 * ConnectionStatus component for displaying the current WebSocket connection status
 */
export const ConnectionStatus = () => {
    const { isConnected } = useRealtime();

    return (
        <div
            className={`flex items-center gap-1 text-xs px-2 py-1 rounded-sm opacity-80 ${
                isConnected
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
            }`}
            role="status"
            aria-live="polite"
        >
            {isConnected ? (
                <>
                    <Wifi className="h-3 w-3" aria-hidden="true" />
                    <span>Connected</span>
                    <span className="sr-only">Real-time updates are active</span>
                </>
            ) : (
                <>
                    <WifiOff className="h-3 w-3" aria-hidden="true" />
                    <span>Disconnected</span>
                    <span className="sr-only">Real-time updates are inactive. Changes may not appear immediately.</span>
                </>
            )}
        </div>
    );
};
