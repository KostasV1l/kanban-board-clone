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
const { checkBoardMembership } = require("../middleware/boardAuth.middleware");
const memberRoutes = require("./member.routes");
const listRoutes = require("./list.routes");
const { ROLES } = require("../config/constants");

const router = express.Router();

// Protected routes for authenticated users
router.get("/", protect, getBoards);
router.post("/", protect, createBoard);

// Guest routes
router.get("/guest/:guestId", getGuestBoards);
router.post("/guest/:guestId", createGuestBoard);

// Protected board-specific routes
router.get("/:boardId", protect, checkBoardMembership(ROLES.VIEWER), getBoard);
router.put("/:boardId", protect, checkBoardMembership(ROLES.EDITOR), updateBoard);
router.delete("/:boardId", protect, checkBoardMembership(ROLES.OWNER), deleteBoard);

// Mount member routes under /:boardId/members
router.use("/:boardId/members", memberRoutes);

router.use("/:boardId/lists", listRoutes);

module.exports = router;
