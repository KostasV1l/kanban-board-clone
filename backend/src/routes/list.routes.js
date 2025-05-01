const express = require("express");
const {
  getLists,
  getList,
  createList,
  updateList,
  reorderLists,
  deleteList,
} = require("../controllers/list.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

// list of endpoints
router.get("/lists", protect, getLists);
router.get("/:listId", protect, getList);
router.post("/lists", protect, createList);
router.put("/:listId", protect, updateList);
router.patch("/reorder", protect, reorderLists);
router.delete(":listId", protect, deleteList);

module.exports = router;
