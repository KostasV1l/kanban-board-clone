const { getIO } = require("../config/socket");

const socketEvents = {
    // Board events
    boardUpdated: (boardId, data) => {
        getIO().to(`board:${boardId}`).emit("board:updated", data);
    },

    // List events
    listCreated: (boardId, data) => {
        getIO().to(`board:${boardId}`).emit("list:created", data);
    },

    listUpdated: (boardId, listId, data) => {
        getIO()
            .to(`board:${boardId}`)
            .emit("list:updated", { listId, ...data });
    },

    listDeleted: (boardId, listId) => {
        getIO().to(`board:${boardId}`).emit("list:deleted", { listId });
    },

    listsReordered: (boardId, data) => {
        getIO().to(`board:${boardId}`).emit("lists:reordered", data);
    },

    // Task events
    taskCreated: (boardId, data) => {
        getIO().to(`board:${boardId}`).emit("task:created", data);
    },

    taskUpdated: (boardId, taskId, data) => {
        getIO()
            .to(`board:${boardId}`)
            .emit("task:updated", { taskId, ...data });
    },

    taskDeleted: (boardId, taskId) => {
        getIO().to(`board:${boardId}`).emit("task:deleted", { taskId });
    },
    
    taskMoved: (boardId, task, oldListId) => {
        getIO().to(`board:${boardId}`).emit("task:moved", { 
            task, 
            oldListId 
        });
    },

    tasksReordered: (boardId, listId, tasks) => {
        getIO().to(`board:${boardId}`).emit("tasks:reordered", {
            listId,
            tasks
        });
    },

    // Member events
    memberAdded: (boardId, data) => {
        getIO().to(`board:${boardId}`).emit("member:added", data);
    },

    memberRemoved: (boardId, userId) => {
        getIO().to(`board:${boardId}`).emit("member:removed", { userId });
    },
};

module.exports = socketEvents;
