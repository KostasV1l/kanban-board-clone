const express = require("express");
const { ROLES } = require("../config/constants");
const {
  getMembers,
  inviteMembers,
  deleteMember,
} = require("../controllers/member.controller");
const { checkBoardMembership } = require("../middleware/boardAuth.middleware");
const { protect } = require("../middleware/auth.middleware");
// Use mergeParams to access :boardId from the parent router (board.routes.js)
const router = express.Router({ mergeParams: true });

// Path is now relative to the mount point (/boards/:boardId/members)
router.get("/", protect, checkBoardMembership(ROLES.VIEWER), getMembers);

router.post("/", protect, checkBoardMembership(ROLES.OWNER), inviteMembers);

router.delete(
  "/:memberId",
  protect,
  checkBoardMembership(ROLES.OWNER),
  deleteMember
);

module.exports = router;
