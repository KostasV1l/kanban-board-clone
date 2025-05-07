const { Server } = require("socket.io");
const logger = require("./logger");

let io;

const initSocketServer = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL || "http://localhost:3000",
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        logger.info(`New client connected: ${socket.id}`);

        // Join a board room
        socket.on("join-board", (boardId) => {
            socket.join(`board:${boardId}`);
            logger.info(`Socket ${socket.id} joined board:${boardId}`);
        });

        // Leave a board room
        socket.on("leave-board", (boardId) => {
            socket.leave(`board:${boardId}`);
            logger.info(`Socket ${socket.id} left board:${boardId}`);
        });

        socket.on("disconnect", () => {
            logger.info(`Client disconnected: ${socket.id}`);
        });
    });

    return io;
};

// Get the sockets.io instance
const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized");
    }
    return io;
};

module.exports = { initSocketServer, getIO };
