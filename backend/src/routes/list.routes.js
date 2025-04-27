const express = require("express");
const {
  getLists,
  getList,
  createList,
  updateList,
  deleteList,
  reorderLists,
} = require("../controllers/list.controller");

const router = express.Router();

// list of endpoints
router.get("/lists", getLists);
router.get("/:listId", getList);
router.post("/lists", createList);
router.put("/:listId", updateList);
router.delete(":listId", deleteList);

module.exports = router;
