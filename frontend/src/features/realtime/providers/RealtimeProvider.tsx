"use client";

import { useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";
import { listKeys } from "@/entities/list/model";
import { memberKeys } from "@/entities/member/model";
import { taskKeys } from "@/entities/task/model";
import { useAuthStatus } from "@/features/auth/hooks";
import { Socket } from "socket.io-client";
import { socketService } from "../api";
import { RealtimeContextType, RealtimeEvent } from "../model";

// Create the Realtime Context
const RealtimeContext = createContext<RealtimeContextType>({
    socket: null,
    isConnected: false,
    connect: () => {},
    disconnect: () => {},
    joinRoom: () => {},
    leaveRoom: () => {},
    emit: () => {},
});

// Hook for using the Realtime Context
export const useRealtime = () => useContext(RealtimeContext);

/**
 * Provider component for real-time functionality with automatic query invalidation
 */
export const RealtimeProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const { isAuthenticated } = useAuthStatus();
    const queryClient = useQueryClient();

    // State for screen reader announcements
    const [lastTaskEvent, setLastTaskEvent] = useState<RealtimeContextType["lastTaskEvent"]>();
    const [lastListEvent, setLastListEvent] = useState<RealtimeContextType["lastListEvent"]>();
    const [lastMemberEvent, setLastMemberEvent] = useState<RealtimeContextType["lastMemberEvent"]>();

    // This function handles all socket event to query invalidation mappings
    const setupGlobalEventHandlers = (socket: Socket) => {
        // Task events
        socket.on(RealtimeEvent.TASK_CREATED, (data: any) => {
            console.log("🔄 Global event: Task created", data);
            // Force refetch ALL task queries
            queryClient.invalidateQueries({ queryKey: taskKeys.all });
            // Also invalidate the list to update counts
            if (data.listId) {
                queryClient.invalidateQueries({ queryKey: listKeys.list(data.listId) });
            }

            // Set announcement for screen readers
            setLastTaskEvent({
                type: "created",
                task: data,
            });
        });

        socket.on(RealtimeEvent.TASK_UPDATED, (data: any) => {
            console.log("🔄 Global event: Task updated", data);
            // Force refetch ALL task queries
            queryClient.invalidateQueries({ queryKey: taskKeys.all });

            // Set announcement for screen readers
            setLastTaskEvent({
                type: "updated",
                task: data,
            });
        });

        socket.on(RealtimeEvent.TASK_DELETED, (data: any) => {
            console.log("🔄 Global event: Task deleted", data);
            // Force refetch ALL task queries
            queryClient.invalidateQueries({ queryKey: taskKeys.all });
            // Also invalidate the list to update counts
            if (data.listId) {
                queryClient.invalidateQueries({ queryKey: listKeys.list(data.listId) });
            }

            // Set announcement for screen readers
            setLastTaskEvent({
                type: "deleted",
                task: data,
            });
        });

        socket.on(RealtimeEvent.TASK_MOVED, (data: any) => {
            console.log("🔄 Global event: Task moved", data);
            // Force refetch ALL task queries
            queryClient.invalidateQueries({ queryKey: taskKeys.all });
            // Invalidate both source and destination lists
            if (data.oldListId) {
                queryClient.invalidateQueries({ queryKey: listKeys.list(data.oldListId) });
            }
            if (data.task && data.task.listId) {
                queryClient.invalidateQueries({ queryKey: listKeys.list(data.task.listId) });
            }
        });

        socket.on(RealtimeEvent.TASKS_REORDERED, (data: any) => {
            console.log("🔄 Global event: Tasks reordered", data);
            // Force refetch ALL task queries
            queryClient.invalidateQueries({ queryKey: taskKeys.all });
        });

        // List events
        socket.on(RealtimeEvent.LIST_CREATED, (data: any) => {
            console.log("🔄 Global event: List created", data);
            // Force refetch ALL list queries
            queryClient.invalidateQueries({ queryKey: listKeys.all });

            // Set announcement for screen readers
            setLastListEvent({
                type: "created",
                list: data,
            });
        });

        socket.on(RealtimeEvent.LIST_UPDATED, (data: any) => {
            console.log("🔄 Global event: List updated", data);
            // Force refetch ALL list queries
            queryClient.invalidateQueries({ queryKey: listKeys.all });

            // Set announcement for screen readers
            setLastListEvent({
                type: "updated",
                list: data,
            });
        });

        socket.on(RealtimeEvent.LIST_DELETED, (data: any) => {
            console.log("🔄 Global event: List deleted", data);
            // Force refetch ALL list queries
            queryClient.invalidateQueries({ queryKey: listKeys.all });

            // Set announcement for screen readers
            setLastListEvent({
                type: "deleted",
                list: data,
            });
        });

        socket.on(RealtimeEvent.LISTS_REORDERED, () => {
            console.log("🔄 Global event: Lists reordered");
            // Force refetch ALL list queries
            queryClient.invalidateQueries({ queryKey: listKeys.all });
        });

        // Member events
        socket.on(RealtimeEvent.MEMBER_ADDED, (data: any) => {
            console.log("🔄 Global event: Member added", data);
            // Force refetch ALL member queries
            queryClient.invalidateQueries({ queryKey: memberKeys.all });

            // Set announcement for screen readers
            setLastMemberEvent({
                type: "added",
                member: data,
            });
        });

        socket.on(RealtimeEvent.MEMBER_UPDATED, (data: any) => {
            console.log("🔄 Global event: Member updated", data);
            // Force refetch ALL member queries
            queryClient.invalidateQueries({ queryKey: memberKeys.all });

            // Set announcement for screen readers
            setLastMemberEvent({
                type: "updated",
                member: data,
            });
        });

        socket.on(RealtimeEvent.MEMBER_REMOVED, (data: any) => {
            console.log("🔄 Global event: Member removed", data);
            // Force refetch ALL member queries
            queryClient.invalidateQueries({ queryKey: memberKeys.all });

            // Set announcement for screen readers
            setLastMemberEvent({
                type: "removed",
                member: data,
            });
        });
    };

    // Clean up socket event handlers to prevent memory leaks
    const cleanupGlobalEventHandlers = (socket: Socket) => {
        socket.off(RealtimeEvent.TASK_CREATED);
        socket.off(RealtimeEvent.TASK_UPDATED);
        socket.off(RealtimeEvent.TASK_DELETED);
        socket.off(RealtimeEvent.TASK_MOVED);
        socket.off(RealtimeEvent.TASKS_REORDERED);
        socket.off(RealtimeEvent.LIST_CREATED);
        socket.off(RealtimeEvent.LIST_UPDATED);
        socket.off(RealtimeEvent.LIST_DELETED);
        socket.off(RealtimeEvent.LISTS_REORDERED);
        socket.off(RealtimeEvent.MEMBER_ADDED);
        socket.off(RealtimeEvent.MEMBER_UPDATED);
        socket.off(RealtimeEvent.MEMBER_REMOVED);
    };

    // Connect to WebSocket when authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            return;
        }

        const handleConnection = () => {
            setIsConnected(true);
            setSocket(socketService.socket);

            // Set up global event handlers when connected
            if (socketService.socket) {
                setupGlobalEventHandlers(socketService.socket);
            }
        };

        const handleDisconnection = () => {
            setIsConnected(false);

            // Clean up global event handlers on disconnect
            if (socketService.socket) {
                cleanupGlobalEventHandlers(socketService.socket);
            }
        };

        // Connect to socket
        socketService.connect();
        setSocket(socketService.socket);

        // Set up listeners
        socketService.addConnectionListener(handleConnection);
        socketService.addDisconnectionListener(handleDisconnection);

        // Set initial connection state
        setIsConnected(socketService.isConnected);

        // Set up global event handlers if already connected
        if (socketService.isConnected && socketService.socket) {
            setupGlobalEventHandlers(socketService.socket);
        }

        // Cleanup on unmount
        return () => {
            socketService.removeConnectionListener(handleConnection);
            socketService.removeDisconnectionListener(handleDisconnection);

            if (socketService.socket) {
                cleanupGlobalEventHandlers(socketService.socket);
            }
        };
    }, [isAuthenticated, queryClient]);

    // Reconnect on authentication change
    useEffect(() => {
        if (isAuthenticated && !socket) {
            socketService.connect();
            setSocket(socketService.socket);

            // Set up global event handlers
            if (socketService.socket) {
                setupGlobalEventHandlers(socketService.socket);
            }
        }
    }, [isAuthenticated, socket, queryClient]);

    // Connect/disconnect methods
    const connect = () => {
        if (!socket) {
            const newSocket = socketService.connect();
            setSocket(newSocket);

            if (newSocket) {
                setupGlobalEventHandlers(newSocket);
            }
        }
    };

    const disconnect = () => {
        if (socket) {
            cleanupGlobalEventHandlers(socket);
        }
        socketService.disconnect();
        setSocket(null);
        setIsConnected(false);
    };

    // Room management methods
    const joinRoom = (roomId: string) => {
        socketService.joinRoom(roomId);
    };

    const leaveRoom = (roomId: string) => {
        socketService.leaveRoom(roomId);
    };

    // Event emission method
    const emit = (event: RealtimeEvent, data?: any) => {
        socketService.emit(event, data);
    };

    // Clear announcements after 5 seconds
    useEffect(() => {
        if (lastTaskEvent) {
            const timer = setTimeout(() => {
                setLastTaskEvent(undefined);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [lastTaskEvent]);

    useEffect(() => {
        if (lastListEvent) {
            const timer = setTimeout(() => {
                setLastListEvent(undefined);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [lastListEvent]);

    useEffect(() => {
        if (lastMemberEvent) {
            const timer = setTimeout(() => {
                setLastMemberEvent(undefined);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [lastMemberEvent]);

    return (
        <RealtimeContext.Provider
            value={{
                socket,
                isConnected,
                connect,
                disconnect,
                joinRoom,
                leaveRoom,
                emit,
                lastTaskEvent,
                lastListEvent,
                lastMemberEvent,
            }}
        >
            <div aria-live="polite" className="sr-only">
                {isConnected ? "You are connected to real-time updates" : "Real-time updates disconnected"}
            </div>

            {/* Task event announcements */}
            <div aria-live="polite" className="sr-only">
                {lastTaskEvent && `Task ${lastTaskEvent.task.title} was ${lastTaskEvent.type}`}
            </div>

            {/* List event announcements */}
            <div aria-live="polite" className="sr-only">
                {lastListEvent && `List ${lastListEvent.list.name} was ${lastListEvent.type}`}
            </div>

            {/* Member event announcements */}
            <div aria-live="polite" className="sr-only">
                {lastMemberEvent &&
                    lastMemberEvent.member.user &&
                    `Member ${lastMemberEvent.member.user.username} was ${lastMemberEvent.type}`}
            </div>

            {children}
        </RealtimeContext.Provider>
    );
};
