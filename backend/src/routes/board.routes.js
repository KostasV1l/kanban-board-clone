const express = require("express");
const {
    getBoards,
    getGuestBoards,
    createBoard,
    createGuestBoard,
    getBoard,
    updateBoard,
    deleteBoard,
} = require("../controllers/board.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

// Protected routes for authenticated users
router.get("/", protect, getBoards);
router.post("/", protect, createBoard);

// Guest routes
router.get("/guest/:guestId", getGuestBoards);
router.post("/guest/:guestId", createGuestBoard);

// Protected board-specific routes
router.get("/:boardId", protect, getBoard);
router.put("/:boardId", protect, updateBoard);
router.delete("/:boardId", protect, deleteBoard);

module.exports = router;
