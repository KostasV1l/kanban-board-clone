import { Socket } from "socket.io-client";

// Connection state types
export interface RealtimeConnectionState {
    socket: Socket | null;
    isConnected: boolean;
}

export interface RealtimeContextType extends RealtimeConnectionState {
    connect: () => void;
    disconnect: () => void;
    joinRoom: (roomId: string) => void;
    leaveRoom: (roomId: string) => void;
    emit: (event: RealtimeEvent, data?: any) => void;
}

// Event data types
export interface UserSocketData {
    id: string;
    username: string;
    email?: string;
}

export interface BoardSocketData {
    id: string;
    name: string;
    description?: string;
    color?: string;
}

export interface ListSocketData {
    id: string;
    boardId: string;
    name: string;
    order?: number;
}

export interface TaskSocketData {
    id: string;
    listId: string;
    boardId: string;
    title: string;
    description?: string;
    priority?: "LOW" | "MEDIUM" | "HIGH";
    dueDate?: string;
    assigneeId?: string;
    order?: number;
}

export interface CommentSocketData {
    id: string;
    taskId: string;
    userId: string;
    content: string;
    createdAt: string;
}

export interface MemberSocketData {
    id: string;
    boardId: string;
    userId: string;
    role: "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";
    user?: UserSocketData;
}

export interface TaskMovedSocketData {
    task: TaskSocketData;
    oldListId: string;
}

// Define all possible socket events
export enum RealtimeEvent {
    // Connection events
    CONNECT = "connect",
    DISCONNECT = "disconnect",
    RECONNECT = "reconnect",

    // Room events
    JOIN_ROOM = "join-room",
    LEAVE_ROOM = "leave-room",
    JOIN_BOARD = "join-board",
    LEAVE_BOARD = "leave-board",

    // Presence events
    USER_ONLINE = "user:online",
    USER_OFFLINE = "user:offline",
    USER_TYPING = "user:typing",

    // Board events
    BOARD_CREATED = "board:created",
    BOARD_UPDATED = "board:updated",
    BOARD_DELETED = "board:deleted",

    // List events
    LIST_CREATED = "list:created",
    LIST_UPDATED = "list:updated",
    LIST_DELETED = "list:deleted",
    LISTS_REORDERED = "lists:reordered",

    // Task events
    TASK_CREATED = "task:created",
    TASK_UPDATED = "task:updated",
    TASK_DELETED = "task:deleted",
    TASK_MOVED = "task:moved",
    TASKS_REORDERED = "tasks:reordered",

    // Member events
    MEMBER_ADDED = "member:added",
    MEMBER_UPDATED = "member:updated",
    MEMBER_REMOVED = "member:removed",

    // Comment events
    COMMENT_ADDED = "comment:added",
    COMMENT_UPDATED = "comment:updated",
    COMMENT_DELETED = "comment:deleted",

    // Activity events
    ACTIVITY_CREATED = "activity:created",
}

// Room types
export enum RoomType {
    BOARD = "board",
    TASK = "task",
    USER = "user",
}

// Socket event handler type
export type SocketEventHandler<T = any> = (data: T) => void;
