import { useCallback, useEffect, useRef } from "react";
import { RealtimeEvent, SocketEventHandler } from "../model";
import { useRealtime } from "../providers";

/**
 * Hook for subscribing to real-time events
 * @param eventName The name of the event to subscribe to
 * @param callback The callback to execute when the event occurs
 * @returns Object with an emitEvent function
 */
export function useRealtimeEvent<T = any>(eventName: string | RealtimeEvent, callback: SocketEventHandler<T>) {
    const { socket, isConnected } = useRealtime();

    // Use a ref to maintain the same callback reference for socket.off
    const callbackRef = useRef(callback);

    // Update the callback ref when the callback changes
    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    // Set up the event subscription
    useEffect(() => {
        if (!socket) return;

        const handler = (data: T) => {
            callbackRef.current(data);
        };

        // Add event listener
        socket.on(eventName, handler);

        // Cleanup listener on unmount or when dependencies change
        return () => {
            socket.off(eventName, handler);
        };
    }, [socket, eventName]);

    // Function to emit events
    const emitEvent = useCallback(
        (emitEventName: string | RealtimeEvent, data?: any) => {
            if (socket && isConnected) {
                socket.emit(emitEventName, data);
            }
        },
        [socket, isConnected],
    );

    return { emitEvent, isConnected };
}
