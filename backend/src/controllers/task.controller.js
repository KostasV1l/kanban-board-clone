const taskService = require("../services/task.service");

// @desc    Get all tasks from a list
// @route   GET /api/tasks/list/:listId
exports.getTasksByList = async (req, res, next) => {
  try {
    const tasks = await taskService.getTasksByList(req.params.listId);
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all tasks from a board
// @route   GET /api/tasks/board/:boardId
exports.getTasksByBoard = async (req, res, next) => {
  try {
    const tasks = await taskService.getTasksByBoard(req.params.boardId);
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single task by ID
// @route   GET /api/tasks/:taskId
exports.getTask = async (req, res, next) => {
  try {
    const task = await taskService.findById(req.params.taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
exports.createTask = async (req, res, next) => {
  try {
    const { title, list, board } = req.body;

    // Validation
    if (!title || !list || !board) {
      return res.status(400).json({
        message: "Title, list, and board are required fields.",
      });
    }

    req.body.createdBy = req.user.id;

    // Create the task
    const task = await taskService.createTask(req.body);
    res.status(201).json(task);
  } catch (error) {
    next(error);
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
      return res.status(404).json({ message: "Task not found" });
    }

    // Update the task
    const updatedTask = await taskService.updateTask(taskId, req.body);
    res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
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
      return res.status(404).json({ message: "Task not found" });
    }

    // Delete the task
    await taskService.deleteTask(taskId);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
