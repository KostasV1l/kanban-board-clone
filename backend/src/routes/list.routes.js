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

const router = express.Router();

// list of endpoints
router.get("/", protect, getLists);
router.get("/:listId", protect, getList);
router.post("/", protect, createList);
router.put("/:listId", protect, updateList);
router.delete("/:listId", protect, deleteList);
router.post("/boards/:boardId/reorder", protect, reorderLists);

module.exports = router;
