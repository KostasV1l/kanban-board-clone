const express = require("express");
const router = express.Router();
const {
  getTask,
  createTask,
  updateTask,
  deleteTask,
  updateTaskOrder,
  moveTask,
  getTasksByList,
  getTasksByBoard,
} = require("../controllers/task.controller");
const { protect } = require("../middleware/auth.middleware");

// Additional routes for tasks by list
router.get("/list/:listId", protect, getTasksByList);

// Additional routes for tasks by board
router.get("/board/:boardId", protect, getTasksByBoard);

// Get a specific task
router.get("/:taskId", protect, getTask);

// Create a new task
router.post("/", protect, createTask);

// Update a task
router.put("/:taskId", protect, updateTask);

// Delete a task
router.delete("/:taskId", protect, deleteTask);


module.exports = router;
