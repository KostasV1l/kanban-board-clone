"use client";

import { WifiOff, Wifi } from "lucide-react";
import { useRealtime } from "../providers";
import { cn } from "@/lib/utils";

/**
 * ConnectionStatus component for displaying the current WebSocket connection status
 */
export const ConnectionStatus = ({ className }: { className?: string }) => {
  const { isConnected } = useRealtime();

  return (
    <div 
      className={cn(
        "flex items-center gap-1.5 text-xs rounded-full px-2 py-0.5 transition-colors", 
        isConnected 
          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" 
          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
        className
      )}
    >
      {isConnected ? (
        <>
          <Wifi className="h-3 w-3" />
          <span>Connected</span>
        </>
      ) : (
        <>
          <WifiOff className="h-3 w-3" />
          <span>Disconnected</span>
        </>
      )}
    </div>
  );
};