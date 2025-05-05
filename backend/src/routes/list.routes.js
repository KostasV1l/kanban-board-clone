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

// list of endpoints
router.get("/", protect, checkBoardMembership(ROLES.VIEWER), getLists);
router.get("/:listId", protect, checkBoardMembership(ROLES.VIEWER), getList);
router.post("/", protect, checkBoardMembership(ROLES.EDITOR), createList);
router.put("/:listId", protect, checkBoardMembership(ROLES.EDITOR), updateList);
router.delete("/:listId", protect, checkBoardMembership(ROLES.OWNER), deleteList);
router.post("/boards/:boardId/reorder", protect, checkBoardMembership(ROLES.EDITOR), reorderLists);
router.use("/:listId/tasks", taskRoutes);

module.exports = router;
