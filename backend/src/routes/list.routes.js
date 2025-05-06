const express = require("express");
const {
  getLists,
  getList,
  createList,
  updateList,
  deleteList,
  reorderLists
} = require("../controllers/list.controller");
const { protect } = require("../middleware/auth.middleware");
const { checkBoardMembership } = require("../middleware/boardAuth.middleware");
const { ROLES } = require("../config/constants");
const taskRoutes = require("./task.routes");

const router = express.Router({mergeParams: true});

// List of endpoints
// Here the lists refer to the columns of the board where the tasks are stored

// Get all of the the lists in the board
router.get("/", protect, checkBoardMembership(ROLES.VIEWER), getLists);

// Get a specific list by ID
router.get("/:listId", protect, checkBoardMembership(ROLES.VIEWER), getList);

// Create a new list
router.post("/", protect, checkBoardMembership(ROLES.EDITOR), createList);

// Edit the list
router.put("/:listId", protect, checkBoardMembership(ROLES.EDITOR), updateList);

// Remove the list from the board
router.delete("/:listId", protect, checkBoardMembership(ROLES.OWNER), deleteList);

// Reorder the lists (drag and drop)
router.post("/boards/:boardId/reorder", protect, checkBoardMembership(ROLES.EDITOR), reorderLists);

router.use("/:listId/tasks", taskRoutes);

module.exports = router;
