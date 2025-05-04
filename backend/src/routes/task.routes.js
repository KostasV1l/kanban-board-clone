const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTasksByList,
} = require("../controllers/task.controller");
const { protect } = require("../middleware/auth.middleware");
const { checkBoardMembership } = require("../middleware/boardAuth.middleware");
const { ROLES } = require("../config/constants");

// Base path: /api/boards/:boardId/lists/:listId/tasks

// GET all tasks for the specific list
router.get("/", protect, checkBoardMembership(ROLES.VIEWER), getTasksByList);

// Create a new task in this list
router.post("/", protect, checkBoardMembership(ROLES.EDITOR), createTask);

// Get a specific task
router.get("/:taskId", protect, checkBoardMembership(ROLES.VIEWER), getTask);

// Update a task
router.put("/:taskId", protect, checkBoardMembership(ROLES.EDITOR), updateTask);

// Delete a task
router.delete("/:taskId", protect, checkBoardMembership(ROLES.EDITOR), deleteTask);

module.exports = router;
