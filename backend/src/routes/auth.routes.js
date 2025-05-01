const express = require("express");
const { 
  register, 
  login, 
  refreshToken, 
  logout, 
  getCurrentUser,
  getUserSessions,
  revokeSession,
  revokeAllSessions
} = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/logout", protect, logout);
router.get("/me", protect, getCurrentUser);

// Session management routes
router.get("/sessions", protect, getUserSessions); // allows user to see all their sessions
router.delete("/sessions/:sessionId", protect, revokeSession); // allows user to revoke a specific session
router.delete("/sessions", protect, revokeAllSessions); // allows user to revoke all sessions

module.exports = router;
