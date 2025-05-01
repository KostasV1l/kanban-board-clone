const express = require("express");
const {
  getLists,
  getList,
  createList,
  updateList,
  deleteList,
} = require("../controllers/list.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

// list of endpoints
router.get("/", protect, getLists);
router.get("/:listId", protect, getList);
router.post("/", protect, createList);
router.put("/:listId", protect, updateList);
router.delete(":listId", protect, deleteList);

module.exports = router;
