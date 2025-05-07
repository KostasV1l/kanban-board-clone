// Utility functions for consistent API response formatting

/**
 * Formats a task object for API response
 * @param {Object} task - Mongoose task document
 * @returns {Object} Formatted task object
 */
exports.formatTaskResponse = (task) => {
    if (!task) return null;

    return {
        id: task.id,
        title: task.title,
        description: task.description || "",
        order: task.order,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        assignedTo: task.assignedTo ? task.assignedTo.toString() : undefined,
        createdBy: task.createdBy,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
        listId: task.list.toString(),
        boardId: task.board.toString(),
    };
};

/**
 * Formats an array of task objects for API response
 * @param {Array} tasks - Array of Mongoose task documents
 * @returns {Array} Array of formatted task objects
 */
exports.formatTasksResponse = (tasks) => {
    if (!tasks || !Array.isArray(tasks)) return [];

    return tasks.map((task) => exports.formatTaskResponse(task));
};
