const express = require("express");
const { ROLES } = require("../config/constants");
const {
  getMembers,
  inviteMembers,
  deleteMember,
  updateMemberRole
} = require("../controllers/member.controller");
const { checkBoardMembership } = require("../middleware/boardAuth.middleware");
const { protect } = require("../middleware/auth.middleware");
// Use mergeParams to access :boardId from the parent router (board.routes.js)
const router = express.Router({ mergeParams: true });

// Path is now relative to the mount point (/boards/:boardId/members/)
router.get("/", protect, checkBoardMembership(ROLES.VIEWER), getMembers);

router.post("/", protect, checkBoardMembership(ROLES.OWNER), inviteMembers);

// boards/:boardId/members/:memberId
router.delete(
  "/:memberId",
  protect,
  checkBoardMembership(ROLES.OWNER),
  deleteMember
);

router.put(
  "/:memberId",
  protect,
  checkBoardMembership(ROLES.OWNER),
  updateMemberRole
);

module.exports = router;
