import { io, Socket } from 'socket.io-client';
import { RealtimeEvent } from '../model';

/**
 * Socket service responsible for establishing and managing WebSocket connections
 */
class SocketService {
  private _socket: Socket | null = null;
  private _isConnected: boolean = false;
  private _connectionListeners: Set<() => void> = new Set();
  private _disconnectionListeners: Set<() => void> = new Set();

  /**
   * Connects to the WebSocket server
   */
  connect(): Socket {
    if (this._socket) {
      return this._socket;
    }

    this._socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000', {
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
    });

    this._socket.on(RealtimeEvent.CONNECT, this.handleConnect);
    this._socket.on(RealtimeEvent.DISCONNECT, this.handleDisconnect);
    this._socket.on(RealtimeEvent.RECONNECT, this.handleReconnect);

    return this._socket;
  }

  /**
   * Disconnects from the WebSocket server
   */
  disconnect(): void {
    if (this._socket) {
      this._socket.disconnect();
      this._socket = null;
      this._isConnected = false;
    }
  }

  /**
   * Join a specific room to receive events for that entity
   */
  joinRoom(roomId: string): void {
    if (this._socket && this._isConnected) {
      this._socket.emit(RealtimeEvent.JOIN_ROOM, roomId);
    }
  }

  /**
   * Join a board room
   */
  joinBoard(boardId: string): void {
    if (this._socket && this._isConnected) {
      this._socket.emit(RealtimeEvent.JOIN_BOARD, boardId);
    }
  }

  /**
   * Leave a board room
   */
  leaveBoard(boardId: string): void {
    if (this._socket && this._isConnected) {
      this._socket.emit(RealtimeEvent.LEAVE_BOARD, boardId);
    }
  }

  /**
   * Leave a specific room
   */
  leaveRoom(roomId: string): void {
    if (this._socket && this._isConnected) {
      this._socket.emit(RealtimeEvent.LEAVE_ROOM, roomId);
    }
  }

  /**
   * Add event listener to the socket
   */
  on<T>(event: string | RealtimeEvent, callback: (data: T) => void): void {
    if (this._socket) {
      this._socket.on(event, callback);
    }
  }

  /**
   * Remove event listener from the socket
   */
  off<T>(event: string | RealtimeEvent, callback: (data: T) => void): void {
    if (this._socket) {
      this._socket.off(event, callback);
    }
  }

  /**
   * Emit an event to the server
   */
  emit(event: string | RealtimeEvent, data?: any): void {
    if (this._socket && this._isConnected) {
      this._socket.emit(event, data);
    }
  }

  /**
   * Add connection listener
   */
  addConnectionListener(listener: () => void): void {
    this._connectionListeners.add(listener);
    if (this._isConnected) {
      listener();
    }
  }

  /**
   * Remove connection listener
   */
  removeConnectionListener(listener: () => void): void {
    this._connectionListeners.delete(listener);
  }

  /**
   * Add disconnection listener
   */
  addDisconnectionListener(listener: () => void): void {
    this._disconnectionListeners.add(listener);
    if (!this._isConnected) {
      listener();
    }
  }

  /**
   * Remove disconnection listener
   */
  removeDisconnectionListener(listener: () => void): void {
    this._disconnectionListeners.delete(listener);
  }

  /**
   * Check if socket is connected
   */
  get isConnected(): boolean {
    return this._isConnected;
  }

  /**
   * Get socket instance
   */
  get socket(): Socket | null {
    return this._socket;
  }

  private handleConnect = () => {
    console.log('Socket connected');
    this._isConnected = true;
    this._connectionListeners.forEach(listener => listener());
  };

  private handleDisconnect = () => {
    console.log('Socket disconnected');
    this._isConnected = false;
    this._disconnectionListeners.forEach(listener => listener());
  };

  private handleReconnect = () => {
    console.log('Socket reconnected');
    this._isConnected = true;
    this._connectionListeners.forEach(listener => listener());
  };
}

// Create a singleton instance
export const socketService = new SocketService();