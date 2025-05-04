const express = require("express");
const { ROLES } = require("../config/constants");
const { getMembers } = require("../controllers/member.controller");
const { checkBoardMembership } = require("../middleware/boardAuth.middleware");
const { protect } = require("../middleware/auth.middleware");
// Use mergeParams to access :boardId from the parent router (board.routes.js)
const router = express.Router({ mergeParams: true });

// Path is now relative to the mount point (/boards/:boardId/members)
router.get(
  "/", 
  protect,
  checkBoardMembership(ROLES.VIEWER),
  getMembers
);

// Add placeholders for future routes
// POST /boards/:boardId/members
// router.post("/", protect, checkBoardMembership(ROLES.EDITOR), addMember); 
// DELETE /boards/:boardId/members/:userId
// router.delete("/:userId", protect, checkBoardMembership(ROLES.EDITOR), removeMember);
// PATCH /boards/:boardId/members/:userId
// router.patch("/:userId", protect, checkBoardMembership(ROLES.EDITOR), updateMemberRole);


module.exports = router;
