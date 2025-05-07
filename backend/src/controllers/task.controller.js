const { TASK_STATUS, TASK_PRIORITY } = require("../config/constants");
const taskService = require("../services/task.service");
const { BadRequestError, TaskNotFoundError } = require("../utils/ApiError");
const { formatTaskResponse, formatTasksResponse } = require("../utils/responseFormatters");

// @desc    Get all tasks from a list
// @route   GET /api/tasks/list/:listId
exports.getTasksByList = async (req, res, next) => {
    try {
        const tasks = await taskService.getTasksByList(req.params.listId);
        res.status(200).json(formatTasksResponse(tasks));
    } catch (error) {
        return next(error);
    }
};

// @desc    Get all tasks from a board
// @route   GET /api/tasks/board/:boardId
exports.getTasksByBoard = async (req, res, next) => {
    try {
        const tasks = await taskService.getTasksByBoard(req.params.boardId);
        res.status(200).json(formatTasksResponse(tasks));
    } catch (error) {
        return next(error);
    }
};

// @desc    Get a single task by ID
// @route   GET /api/tasks/:taskId
exports.getTask = async (req, res, next) => {
    try {
        const task = await taskService.findById(req.params.taskId);

        if (!task) {
            return next(new TaskNotFoundError());
        }

        res.status(200).json(formatTaskResponse(task));
    } catch (error) {
        return next(error);
    }
};

// @desc    Create a new task
// @route   POST /api/tasks
exports.createTask = async (req, res, next) => {
    try {
        const { boardId, listId } = req.params;

        const { title, description, status, priority, dueDate, assignedTo } = req.body;

        if (!title || typeof title !== "string" || !title.trim()) {
            return next(new BadRequestError("Task title is required and must be a non-empty string"));
        }

        if (status && !Object.values(TASK_STATUS).includes(status)) {
            return next(new BadRequestError("Invalid status"));
        }

        if (priority && !Object.values(TASK_PRIORITY).includes(priority)) {
            return next(new BadRequestError("Invalid priority"));
        }

        const taskData = {
            title,
            description,
            status,
            priority: priority || TASK_PRIORITY.MEDIUM,
            dueDate,
            assignedTo,
            createdBy: req.user.id,
            board: boardId,
            list: listId,
        };

        // Create the task
        const task = await taskService.createTask(taskData);
        res.status(201).json(formatTaskResponse(task));
    } catch (error) {
        return next(error);
    }
};

// @desc    Update an existing task
// @route   PUT /api/tasks/:taskId
exports.updateTask = async (req, res, next) => {
    try {
        const { taskId } = req.params;

        // Check if task exists
        const existingTask = await taskService.findById(taskId);
        if (!existingTask) {
            return next(new TaskNotFoundError());
        }

        // Update the task
        const updatedTask = await taskService.updateTask(taskId, req.body);
        res.status(200).json(formatTaskResponse(updatedTask));
    } catch (error) {
        return next(error);
    }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:taskId
exports.deleteTask = async (req, res, next) => {
    try {
        const { taskId } = req.params;

        // Check if task exists
        const existingTask = await taskService.findById(taskId);
        if (!existingTask) {
            return next(new TaskNotFoundError());
        }

        // Delete the task
        await taskService.deleteTask(taskId);
        res.status(200).json(formatTaskResponse(existingTask));
    } catch (error) {
        return next(error);
    }
};
